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
  onSnapshot
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Bus, Company } from '../types';

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

  updateBus: async (busId: string, busData: Partial<Bus>) => {
    const path = `buses/${busId}`;
    try {
      await updateDoc(doc(db, 'buses', busId), busData);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  deleteBus: async (busId: string) => {
    const path = `buses/${busId}`;
    try {
      await deleteDoc(doc(db, 'buses', busId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
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
  }
};
