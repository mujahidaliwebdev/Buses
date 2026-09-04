import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db, auth } from './firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  if (error && typeof error === 'object') {
    const err = error as any;
    if (
      err.code === 'unavailable' || 
      err.code === 'deadline-exceeded' || 
      (err.message && (
        err.message.toLowerCase().includes('offline') || 
        err.message.toLowerCase().includes('could not reach') || 
        err.message.toLowerCase().includes('failed to connect')
      ))
    ) {
      console.warn(`Firestore is currently offline or unreachable (${err.code || 'unknown'}). Operating in offline/fallback mode.`);
      return;
    }
  }

  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// 1. User Profile Service (Admin & User Login persistence)
export const userService = {
  saveUserProfile: async (user: { uid: string; email: string | null; displayName?: string | null; photoURL?: string | null; role?: string }) => {
    const path = `users/${user.uid}`;
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'User',
        photoURL: user.photoURL || '',
        role: user.role || 'user',
        lastLogin: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }
};

// 2. Website Feedback & Complaints Service
export const feedbackService = {
  submitFeedback: async (data: { name: string; email?: string; message: string; type: 'complaint' | 'feedback'; subject?: string }) => {
    const path = 'feedback';
    try {
      await addDoc(collection(db, path), {
        ...data,
        userId: auth.currentUser?.uid || 'anonymous',
        userEmail: auth.currentUser?.email || data.email || 'anonymous',
        submittedAt: new Date().toISOString(),
        status: 'pending'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  getFeedbackList: async () => {
    const path = 'feedback';
    try {
      const q = query(collection(db, path), orderBy('submittedAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  }
};

// 3. Route Add Query / Suggestion Service
export const routeQueryService = {
  submitRouteQuery: async (data: { origin: string; destination: string; notes?: string }) => {
    const path = 'route_queries';
    try {
      await addDoc(collection(db, path), {
        ...data,
        userId: auth.currentUser?.uid || 'anonymous',
        userEmail: auth.currentUser?.email || 'anonymous',
        submittedAt: new Date().toISOString(),
        status: 'pending'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  getRouteQueries: async () => {
    const path = 'route_queries';
    try {
      const q = query(collection(db, path), orderBy('submittedAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  }
};

// 4. Bus Feedback & Reports Service (Tied to specific bus_id)
export const busFeedbackService = {
  submitBusFeedback: async (busId: string, data: { rating: number; comment: string; category?: string; reportType?: string }) => {
    const path = 'bus_feedback';
    try {
      await addDoc(collection(db, path), {
        busId: busId.trim().toUpperCase(),
        ...data,
        userId: auth.currentUser?.uid || 'anonymous',
        userEmail: auth.currentUser?.email || 'anonymous',
        submittedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  getBusFeedback: async (busId: string) => {
    const path = 'bus_feedback';
    try {
      const q = query(
        collection(db, path), 
        where('busId', '==', busId.trim().toUpperCase())
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  }
};

// 5. Bus Service (Cloudflare D1 / Server proxy)
export const busService = {
  bulkUpdateFares: async (
    origin: string, 
    destination: string, 
    fareOrFares: number | { non_ac?: number; ac?: number; executive?: number; business?: number; sleeper?: number },
    category: string = 'all'
  ) => {
    const singleFare = typeof fareOrFares === 'number' ? fareOrFares : 0;
    const faresObj = typeof fareOrFares === 'object' ? fareOrFares : {};

    const nonAcFare = singleFare && (category === 'Non_AC' || category === 'all') ? singleFare : (faresObj.non_ac || 0);
    const acFare = singleFare && (category === 'AC' || category === 'all') ? singleFare : (faresObj.ac || 0);
    const execFare = singleFare && (category === 'Executive' || category === 'Exective' || category === 'all') ? singleFare : (faresObj.executive || 0);
    const bizFare = singleFare && (category === 'Business' || category === 'all') ? singleFare : (faresObj.business || 0);
    const sleepFare = singleFare && (category === 'Sleeper' || category === 'all') ? singleFare : (faresObj.sleeper || 0);

    try {
      const response = await fetch('/api/fares/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin,
          destination,
          non_ac: nonAcFare,
          ac: acFare,
          executive: execFare,
          business: bizFare,
          sleeper: sleepFare,
          category
        })
      });

      const responseText = await response.text();
      let result;
      try {
        result = responseText ? JSON.parse(responseText) : { success: false, message: "Empty response" };
      } catch (e) {
        throw new Error(`Server returned invalid JSON (${response.status})`);
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to update fares');
      }

      return result.count || 1;
    } catch (error: any) {
      console.error('Bulk update fares error:', error);
      throw error;
    }
  },

  deleteBus: async (busId: string) => {
    try {
      const res = await fetch('/api/d1/bus/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ busId })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to delete bus');
    } catch (error: any) {
      console.error('Delete bus error:', error);
      throw error;
    }
  },

  updateBus: async (busId: string, busData: any) => {
    try {
      const stops = busData.stopsList || [];
      const res = await fetch('/api/d1/bus/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          busId: busId || busData.busId,
          companyName: busData.company || busData.companyName,
          vehiclePlate: busData.number || busData.vehiclePlate,
          contactNumber: busData.contact || busData.contactNumber,
          serviceType: busData.serviceType || 'Standard',
          climateControl: busData.climateControl || 'Non-AC',
          routeMap: busData.routeMap || '',
          stops
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to update bus');
    } catch (error: any) {
      console.error('Update bus error:', error);
      throw error;
    }
  },

  addBus: async (busData: any) => {
    try {
      const stops = busData.stopsList || [];
      const res = await fetch('/api/d1/bus/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          busId: busData.busId,
          companyName: busData.company || busData.companyName,
          vehiclePlate: busData.number || busData.vehiclePlate,
          contactNumber: busData.contact || busData.contactNumber,
          serviceType: busData.serviceType || 'Standard',
          climateControl: busData.climateControl || 'Non-AC',
          routeMap: busData.routeMap || '',
          stops
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to add bus');
      return busData.busId;
    } catch (error: any) {
      console.error('Add bus error:', error);
      throw error;
    }
  },

  bulkAddBuses: async (busesList: any[]) => {
    for (const b of busesList) {
      await busService.addBus(b);
    }
  }
};

export const contributionService = {
  submitContribution: async (contribution: any) => {
    const path = 'contributions';
    try {
      await addDoc(collection(db, path), {
        ...contribution,
        submittedAt: new Date().toISOString(),
        userId: auth.currentUser?.uid || 'anonymous'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  deleteContribution: async (contribId: string) => {
    const path = `contributions/${contribId}`;
    try {
      await deleteDoc(doc(db, 'contributions', contribId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
      throw error;
    }
  }
};

export const reportService = {
  deleteReport: async (reportId: string) => {
    const path = `reports/${reportId}`;
    try {
      await deleteDoc(doc(db, 'reports', reportId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
      throw error;
    }
  }
};

export const settingsService = {
  getAnalyticsSettings: async () => {
    const path = 'settings/analytics';
    try {
      const snap = await getDocs(query(collection(db, 'settings')));
      const docSnap = snap.docs.find(d => d.id === 'analytics');
      if (docSnap && docSnap.exists()) {
        return docSnap.data() as { measurementId?: string; gscVerification?: string };
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  updateAnalyticsSettings: async (settings: { measurementId: string; gscVerification: string }) => {
    const path = 'settings/analytics';
    try {
      await setDoc(doc(db, 'settings', 'analytics'), settings, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
      throw error;
    }
  },

  subscribeAnalyticsSettings: (callback: (settings: { measurementId?: string; gscVerification?: string } | null) => void) => {
    const path = 'settings/analytics';
    return onSnapshot(doc(db, 'settings', 'analytics'), (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as { measurementId?: string; gscVerification?: string });
      } else {
        callback(null);
      }
    }, (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch (e) {
        console.error("Subscription to settings failed:", e);
      }
      callback(null);
    });
  }
};




