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
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Bus } from '../types';

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
  // Check if it's a connection / offline / unavailable error
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

export const busService = {
  subscribeBuses: (callback: (buses: Bus[]) => void) => {
    const path = 'buses';
    return onSnapshot(collection(db, path), (snapshot) => {
      const buses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bus));
      callback(buses);
    }, (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch (e) {
        console.error("Subscription failed:", e);
      }
      // Pass an empty array so the app falls back to mock buses and stops loading infinitely
      callback([]);
    });
  },

  addBus: async (bus: Omit<Bus, 'id'>) => {
    const path = 'buses';
    try {
      const docRef = await addDoc(collection(db, path), bus);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  bulkAddBuses: async (buses: Omit<Bus, 'id'>[]) => {
    const path = 'buses';
    try {
      const chunks = [];
      const chunkSize = 500;
      
      for (let i = 0; i < buses.length; i += chunkSize) {
        chunks.push(buses.slice(i, i + chunkSize));
      }

      for (const chunk of chunks) {
        const batch = writeBatch(db);
        chunk.forEach(bus => {
          const newDocRef = doc(collection(db, path));
          batch.set(newDocRef, bus);
        });
        await batch.commit();
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  updateBus: async (busId: string, busData: Partial<Bus>) => {
    const path = `buses/${busId}`;
    try {
      const { id, ...data } = busData as any;
      await setDoc(doc(db, 'buses', busId), data, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

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

      // Also update Firestore for compatibility
      try {
        const fareDocKey = `${origin.toLowerCase().trim()}_${destination.toLowerCase().trim()}`;
        const fareDocRef = doc(db, 'fares', fareDocKey);
        const fareRecord: any = {
          origin,
          destination,
          updatedAt: new Date().toISOString()
        };
        if (nonAcFare > 0) fareRecord.non_ac = nonAcFare;
        if (acFare > 0) fareRecord.ac = acFare;
        if (execFare > 0) fareRecord.executive = execFare;
        if (bizFare > 0) fareRecord.business = bizFare;
        if (sleepFare > 0) fareRecord.sleeper = sleepFare;
        await setDoc(fareDocRef, fareRecord, { merge: true });
      } catch (fErr) {
        console.warn('Could not update fares collection in Firestore:', fErr);
      }

      return result.count || 1;
    } catch (error: any) {
      console.error('Bulk update fares error:', error);
      throw error;
    }
  },

  deleteBus: async (busId: string) => {
    const path = `buses/${busId}`;
    try {
      if (busId.startsWith('B')) {
        await setDoc(doc(db, 'buses', busId), { isDeleted: true }, { merge: true });
      } else {
        await deleteDoc(doc(db, 'buses', busId));
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  getBusesByRoute: async (origin: string, destination: string) => {
    const path = 'buses';
    try {
      const q = query(
        collection(db, path), 
        where('origin', '==', origin),
        where('destination', '==', destination)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bus));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return [];
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
      const q = doc(db, 'settings', 'analytics');
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

