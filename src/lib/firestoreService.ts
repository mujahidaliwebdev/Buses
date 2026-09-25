import { 
  collection, 
  doc, 
  getDoc,
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  runTransaction
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

// 1. User Profile Service (Admin & User Login persistence, Permanent Volunteer Verification ID)
export const userService = {
  // Generate or retrieve the permanent Verification ID for a user.
  // Generated on the day of account creation (registration date) and NEVER changes afterwards.
  generateOrGetVerificationId: async (user: { uid: string; email?: string | null; displayName?: string | null; metadata?: { creationTime?: string } }, customName?: string): Promise<string> => {
    if (!user || !user.uid) return '';

    const userUid = user.uid;
    const localKey = `asp_volunteer_cert_${userUid}`;

    const isMujahid = (
      userUid === 'mujahid-ali-id' ||
      Boolean(user.email && (user.email.toLowerCase().includes('mujahid') || user.email.toLowerCase() === 'mujahidali.webdev@gmail.com' || user.email.toLowerCase() === 'mujahidalikhaskheli786@gmail.com')) ||
      Boolean(user.displayName && user.displayName.toLowerCase().includes('mujahid')) ||
      Boolean(customName && customName.toLowerCase().includes('mujahid'))
    );

    // 1. Check local storage cache first
    try {
      if (isMujahid) {
        localStorage.setItem(localKey, 'ASP/EXP/2026051201');
      } else {
        const cached = localStorage.getItem(localKey);
        if (cached && cached.startsWith('ASP/EXP/')) {
          return cached;
        }
      }
    } catch (e) {
      // ignore
    }

    // 2. Check user document in Firestore
    try {
      if (!isMujahid) {
        const userRef = doc(db, 'users', userUid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data()?.verificationId) {
          const existingId = userSnap.data().verificationId;
          try { localStorage.setItem(localKey, existingId); } catch (e) {}
          return existingId;
        }

        // Check user_certificates mapping
        const certMappingRef = doc(db, 'user_certificates', userUid);
        const mappingSnap = await getDoc(certMappingRef);
        if (mappingSnap.exists() && mappingSnap.data()?.verificationId) {
          const existingId = mappingSnap.data().verificationId;
          try { localStorage.setItem(localKey, existingId); } catch (e) {}
          return existingId;
        }
      }
    } catch (err) {
      console.warn('Notice reading existing verification ID:', err);
    }

    // 3. Registration date and ID calculation
    // Mujahid Ali official registration date is strictly 12 May 2026 (20260512)
    const now = new Date();
    let regDate = isMujahid ? new Date(2026, 4, 12) : now;
    if (!isMujahid && user.metadata?.creationTime) {
      const parsed = new Date(user.metadata.creationTime);
      if (!isNaN(parsed.getTime())) {
        regDate = parsed;
      }
    }

    const regYear = regDate.getFullYear().toString();
    const regMonth = String(regDate.getMonth() + 1).padStart(2, '0');
    const regDay = String(regDate.getDate()).padStart(2, '0');
    const dateKey = isMujahid ? '20260512' : `${regYear}${regMonth}${regDay}`; // YYYYMMDD based on registration day

    let assignedId = isMujahid ? 'ASP/EXP/2026051201' : '';
    const counterDocRef = doc(db, 'certificate_daily_counters', dateKey);

    if (!isMujahid) {
      try {
        await runTransaction(db, async (transaction) => {
          const counterSnap = await transaction.get(counterDocRef);
          let nextSeq = 1;
          if (counterSnap.exists()) {
            const currentCount = counterSnap.data().count || 0;
            nextSeq = currentCount + 1;
          }
          const seqStr = String(nextSeq).padStart(2, '0');
          assignedId = `ASP/EXP/${dateKey}${seqStr}`;

          // Increment counter in transaction
          transaction.set(counterDocRef, { count: nextSeq, date: dateKey }, { merge: true });

          // Save permanent mapping for this user so it NEVER changes
          const mappingRef = doc(db, 'user_certificates', userUid);
          transaction.set(mappingRef, {
            userId: userUid,
            verificationId: assignedId,
            dateKey: dateKey,
            sequenceNumber: nextSeq,
            createdAt: now.toISOString()
          }, { merge: true });
        });
      } catch (txErr) {
        console.warn('Transaction on counter notice, using fallback sequence 01:', txErr);
        assignedId = `ASP/EXP/${dateKey}01`;
        try {
          const mappingRef = doc(db, 'user_certificates', userUid);
          await setDoc(mappingRef, {
            userId: userUid,
            verificationId: assignedId,
            dateKey: dateKey,
            sequenceNumber: 1,
            createdAt: now.toISOString()
          }, { merge: true });
        } catch (e) {}
      }
    } else {
      // Save permanent mapping for Mujahid Ali
      try {
        const mappingRef = doc(db, 'user_certificates', userUid);
        await setDoc(mappingRef, {
          userId: userUid,
          verificationId: assignedId,
          dateKey: '20260512',
          sequenceNumber: 1,
          createdAt: new Date(2026, 4, 12).toISOString()
        }, { merge: true });
      } catch (e) {}
    }

    if (!assignedId) {
      assignedId = `ASP/EXP/${dateKey}01`;
    }

    // 4. Save to local storage for instant offline access
    try {
      localStorage.setItem(localKey, assignedId);
    } catch (e) {}

    // 5. Save public certificate record in experience_certificates
    const safeKey = assignedId.replace(/\//g, '_');
    const displayName = customName || user.displayName || (user.email?.includes('mujahid') ? 'Mujahid Ali' : 'Official Volunteer');
    const joiningDateStr = regDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const issueDateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const certRecord = {
      id: assignedId,
      safeKey: safeKey,
      userId: userUid,
      fullName: displayName,
      email: user.email || '',
      role: 'Official Community Volunteer',
      organization: 'AsaanSafar Pakistan',
      department: 'Community Operations & Data Verification',
      joiningDate: joiningDateStr,
      issueDate: issueDateStr,
      status: 'Letter Verified & Active',
      isVerified: true,
      createdAt: now.toISOString()
    };

    try {
      localStorage.setItem(`asp_cert_${safeKey}`, JSON.stringify(certRecord));
    } catch (e) {}

    try {
      const certDocRef = doc(db, 'experience_certificates', safeKey);
      await setDoc(certDocRef, certRecord, { merge: true });
    } catch (e) {
      console.warn('Could not save to experience_certificates:', e);
    }

    // 6. Update user document with verificationId
    try {
      const userRef = doc(db, 'users', userUid);
      await setDoc(userRef, {
        verificationId: assignedId,
        certificateId: assignedId
      }, { merge: true });
    } catch (e) {}

    return assignedId;
  },

  saveUserProfile: async (user: { uid: string; email: string | null; displayName?: string | null; photoURL?: string | null; role?: string; metadata?: any }) => {
    const path = `users/${user.uid}`;
    try {
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      const nowIso = new Date().toISOString();
      const existingData = snap.exists() ? snap.data() : null;

      const isMujahid = (
        user.uid === 'mujahid-ali-id' ||
        Boolean(user.email && (user.email.toLowerCase().includes('mujahid') || user.email.toLowerCase() === 'mujahidali.webdev@gmail.com' || user.email.toLowerCase() === 'mujahidalikhaskheli786@gmail.com')) ||
        Boolean(user.displayName && user.displayName.toLowerCase().includes('mujahid'))
      );

      // Ensure verificationId exists and is never changed if already present
      let verificationId = isMujahid ? 'ASP/EXP/2026051201' : existingData?.verificationId;
      if (!verificationId) {
        verificationId = await userService.generateOrGetVerificationId(user);
      }

      const registrationDate = isMujahid ? '2026-05-12T00:00:00.000Z' : (existingData?.registrationDate || nowIso);
      const regDateObj = new Date(registrationDate);
      const yyyy = regDateObj.getFullYear();
      const mm = String(regDateObj.getMonth() + 1).padStart(2, '0');
      const dd = String(regDateObj.getDate()).padStart(2, '0');
      const dateKey = `${yyyy}${mm}${dd}`;

      let volunteerCardId = existingData?.volunteerCardId;
      if (!volunteerCardId) {
        if (isMujahid || dateKey === '20260512') {
          volunteerCardId = '2026051201';
        } else {
          volunteerCardId = `${dateKey}01`;
        }
      }

      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || existingData?.displayName || (isMujahid ? 'Mujahid Ali' : 'User'),
        photoURL: user.photoURL || '',
        role: user.role || 'user',
        verificationId: verificationId,
        certificateId: verificationId,
        volunteerCardId: volunteerCardId,
        volunteerCardApproved: true,
        registrationDate: registrationDate,
        lastLogin: nowIso
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  updateUserRegistrationDate: async (userId: string, registrationDate: string) => {
    const path = `users/${userId}`;
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        registrationDate: registrationDate,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      throw error;
    }
  }
};

export interface ExperienceRequestItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhoto?: string;
  userMobile?: string;
  homeCity?: string;
  registrationDate: string;
  durationMonths: number;
  contributionsCount: number;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  userNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  verificationId?: string;
}

export interface VolunteerCardRequestItem {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userPhoto?: string;
  userMobile?: string;
  cnic?: string;
  homeCity?: string;
  registrationDate: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  rejectionReason?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  volunteerCardId?: string;
}

export const volunteerCardRequestService = {
  submitRequest: async (data: {
    userId: string;
    userName: string;
    userEmail?: string;
    userPhoto?: string;
    userMobile?: string;
    cnic?: string;
    homeCity?: string;
    registrationDate: string;
  }) => {
    const path = `volunteer_card_requests/${data.userId}`;
    try {
      const docRef = doc(db, 'volunteer_card_requests', data.userId);
      const payload = {
        ...data,
        id: data.userId,
        status: 'pending',
        submittedAt: new Date().toISOString()
      };
      await setDoc(docRef, payload, { merge: true });
      return payload;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      throw error;
    }
  },

  getUserRequest: async (userId: string) => {
    const path = `volunteer_card_requests/${userId}`;
    try {
      const docRef = doc(db, 'volunteer_card_requests', userId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as VolunteerCardRequestItem;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  subscribeUserRequest: (userId: string, callback: (req: VolunteerCardRequestItem | null) => void) => {
    return onSnapshot(doc(db, 'volunteer_card_requests', userId), (snap) => {
      if (snap.exists()) {
        callback({ id: snap.id, ...snap.data() } as VolunteerCardRequestItem);
      } else {
        callback(null);
      }
    }, (error) => {
      callback(null);
    });
  },

  subscribeAllRequests: (callback: (requests: VolunteerCardRequestItem[]) => void) => {
    return onSnapshot(collection(db, 'volunteer_card_requests'), (snapshot) => {
      const list: VolunteerCardRequestItem[] = [];
      snapshot.forEach(d => {
        list.push({ id: d.id, ...d.data() } as VolunteerCardRequestItem);
      });
      list.sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());
      callback(list);
    }, (error) => {
      callback([]);
    });
  },

  approveRequest: async (requestId: string, reviewerEmail: string, customCardId?: string) => {
    const path = `volunteer_card_requests/${requestId}`;
    try {
      const reqRef = doc(db, 'volunteer_card_requests', requestId);
      const snap = await getDoc(reqRef);
      const reqData = snap.exists() ? snap.data() : null;
      const targetUserId = reqData?.userId || requestId;

      let volunteerCardId = customCardId;
      if (!volunteerCardId) {
        let regDateStr = reqData?.registrationDate || '2026-05-12';
        const dateObj = new Date(regDateStr);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        // For Mujahid Ali or first registrations on May 12, 2026, use 01
        let suffix = '01';
        if (targetUserId !== 'tUEBGy3NIFb3yERl4hiwUtQ44OW2' && reqData?.email !== 'mujahidali.webdev@gmail.com') {
          suffix = targetUserId.replace(/[^0-9]/g, '').slice(-2) || '01';
        }
        volunteerCardId = `${yyyy}${mm}${dd}${suffix}`;
      }

      await setDoc(reqRef, {
        status: 'approved',
        reviewedAt: new Date().toISOString(),
        reviewedBy: reviewerEmail,
        volunteerCardId
      }, { merge: true });

      const userRef = doc(db, 'users', targetUserId);
      await setDoc(userRef, {
        volunteerCardApproved: true,
        volunteerCardId
      }, { merge: true });

      return volunteerCardId;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      throw error;
    }
  },

  rejectRequest: async (requestId: string, reviewerEmail: string, rejectionReason: string) => {
    const path = `volunteer_card_requests/${requestId}`;
    try {
      const reqRef = doc(db, 'volunteer_card_requests', requestId);
      await setDoc(reqRef, {
        status: 'rejected',
        reviewedAt: new Date().toISOString(),
        reviewedBy: reviewerEmail,
        rejectionReason
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      throw error;
    }
  }
};

export const experienceRequestService = {
  submitRequest: async (data: {
    userId: string;
    userName: string;
    userEmail?: string;
    userPhoto?: string;
    userMobile?: string;
    homeCity?: string;
    registrationDate: string;
    durationMonths: number;
    contributionsCount: number;
    userNotes?: string;
  }) => {
    const path = `experience_requests/${data.userId}`;
    try {
      const docRef = doc(db, 'experience_requests', data.userId);
      const payload = {
        ...data,
        id: data.userId,
        status: 'pending',
        submittedAt: new Date().toISOString()
      };
      await setDoc(docRef, payload, { merge: true });
      return payload;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      throw error;
    }
  },

  getUserRequest: async (userId: string) => {
    const path = `experience_requests/${userId}`;
    try {
      const docRef = doc(db, 'experience_requests', userId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as ExperienceRequestItem;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  subscribeUserRequest: (userId: string, callback: (req: ExperienceRequestItem | null) => void) => {
    const path = `experience_requests/${userId}`;
    return onSnapshot(doc(db, 'experience_requests', userId), (snap) => {
      if (snap.exists()) {
        callback({ id: snap.id, ...snap.data() } as ExperienceRequestItem);
      } else {
        callback(null);
      }
    }, (error) => {
      console.warn("Notice subscribing to experience request: ", error);
      callback(null);
    });
  },

  subscribeAllRequests: (callback: (requests: ExperienceRequestItem[]) => void) => {
    const path = 'experience_requests';
    return onSnapshot(collection(db, 'experience_requests'), (snapshot) => {
      const list: ExperienceRequestItem[] = [];
      snapshot.forEach(d => {
        list.push({ id: d.id, ...d.data() } as ExperienceRequestItem);
      });
      list.sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());
      callback(list);
    }, (error) => {
      console.warn("Notice subscribing to all experience requests: ", error);
      callback([]);
    });
  },

  approveRequest: async (requestId: string, reviewerEmail: string, verificationId?: string) => {
    const path = `experience_requests/${requestId}`;
    try {
      const reqRef = doc(db, 'experience_requests', requestId);
      const snap = await getDoc(reqRef);
      const reqData = snap.exists() ? snap.data() : null;
      const targetUserId = reqData?.userId || requestId;

      let finalVerificationId = verificationId || reqData?.verificationId;
      if (!finalVerificationId) {
        finalVerificationId = await userService.generateOrGetVerificationId({
          uid: targetUserId,
          email: reqData?.userEmail || '',
          displayName: reqData?.userName || ''
        }, reqData?.userName);
      }

      await setDoc(reqRef, {
        status: 'approved',
        reviewedAt: new Date().toISOString(),
        reviewedBy: reviewerEmail,
        verificationId: finalVerificationId
      }, { merge: true });

      const userRef = doc(db, 'users', targetUserId);
      await setDoc(userRef, {
        experienceLetterApproved: true,
        verificationId: finalVerificationId,
        certificateId: finalVerificationId
      }, { merge: true });

      return finalVerificationId;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      throw error;
    }
  },

  rejectRequest: async (requestId: string, reviewerEmail: string, reason: string) => {
    const path = `experience_requests/${requestId}`;
    try {
      const reqRef = doc(db, 'experience_requests', requestId);
      await setDoc(reqRef, {
        status: 'rejected',
        rejectionReason: reason,
        reviewedAt: new Date().toISOString(),
        reviewedBy: reviewerEmail
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      throw error;
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
      const stops = busData.stopsList || busData.stops || [];
      const companyName = busData.company || busData.companyName || busData.company_name || 'Bus Service';
      const busId = busData.busId || busData.bus_id || `B-${Date.now().toString().slice(-5)}`;
      
      const res = await fetch('/api/d1/bus/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bus: {
            bus_id: busId,
            company_name: companyName,
            vehicle_plate: busData.number || busData.vehiclePlate || busData.vehicle_plate || busData.busNumber || '',
            contact_number: busData.contact || busData.contactNumber || busData.contact_number || '',
            service_type: busData.serviceType || busData.service_type || busData.type || 'Standard',
            climate_control: busData.climateControl || busData.climate_control || (busData.isAC ? 'AC' : 'Non-AC'),
            route_map: busData.routeMap || busData.route_map || ''
          },
          stops
        })
      });
      const data = await res.json();
      if (!data.success) {
        console.warn('D1 bus save response message:', data.message);
      }

      // Also mirror to Firestore 'buses' collection
      try {
        await addDoc(collection(db, 'buses'), {
          busId,
          companyName,
          busNumber: busData.number || busData.vehiclePlate || busData.busNumber || '',
          contactNumber: busData.contact || busData.contactNumber || '',
          type: busData.serviceType || busData.type || 'Standard',
          isAC: busData.climateControl === 'AC' || busData.isAC || false,
          routeMap: busData.routeMap || '',
          origin: stops[0]?.city_name || busData.origin || '',
          destination: stops[stops.length - 1]?.city_name || busData.destination || '',
          departureTime: stops[0]?.departure_time || busData.departureTime || '08:00',
          fare: busData.fare || 0,
          stops,
          status: 'On Schedule',
          createdAt: new Date().toISOString()
        });
      } catch (fbErr) {
        console.warn('Firestore bus mirror notice:', fbErr);
      }

      return busId;
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
        status: contribution.status || 'Pending',
        submittedAt: new Date().toISOString(),
        userId: auth.currentUser?.uid || 'anonymous'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  updateContributionStatus: async (contribId: string, status: 'Approved' | 'Rejected' | 'Pending', remarks?: string) => {
    const path = `contributions/${contribId}`;
    try {
      await updateDoc(doc(db, 'contributions', contribId), {
        status,
        remarks: remarks || '',
        updatedAt: new Date().toISOString(),
        reviewedBy: auth.currentUser?.email || 'admin@asaansafar.com'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
      throw error;
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

export const volunteerService = {
  submitVolunteerApplication: async (data: {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    interestArea: string;
    motivation: string;
    cnic?: string;
  }) => {
    const path = 'volunteers';
    try {
      await addDoc(collection(db, path), {
        ...data,
        userId: auth.currentUser?.uid || 'anonymous',
        submittedAt: new Date().toISOString(),
        status: 'approved'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }
};





