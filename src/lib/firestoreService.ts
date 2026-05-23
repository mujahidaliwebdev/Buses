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
      handleFirestoreError(error, OperationType.GET, path);
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
      await updateDoc(doc(db, 'buses', busId), busData);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  bulkUpdateFares: async (origin: string, destination: string, newFare: number) => {
    const path = 'buses';
    try {
      const q = query(
        collection(db, path), 
        where('origin', '==', origin),
        where('destination', '==', destination)
      );
      const snapshot = await getDocs(q);
      const count = snapshot.size;
      if (count === 0) return 0;

      const batch = writeBatch(db);
      snapshot.docs.forEach(docSnap => {
        batch.update(docSnap.ref, { fare: newFare });
      });
      await batch.commit();
      return count;
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
      throw error;
    }
  },

  deleteBus: async (busId: string) => {
    const path = `buses/${busId}`;
    try {
      await deleteDoc(doc(db, 'buses', busId));
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
