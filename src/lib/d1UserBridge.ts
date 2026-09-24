/**
 * Cloudflare D1 User & Contribution Bridge
 * Connects frontend User Actions (Route maps, fares, volunteer card, experience letter)
 * directly to Cloudflare D1 dedicated user tables:
 * - User_Detail
 * - contributions_Bus
 * - contributions_Stops
 * - contributions_Fare
 * - volunteer_card
 * - experience_certificate
 */

export interface PublicUserProfile {
  user_id: string;
  public_user_id: string;
  email: string;
  display_name: string;
  mobile?: string;
  photo_url?: string;
  cnic?: string;
  home_city?: string;
  gender?: string;
  bio?: string;
  emergency_contact_name?: string;
  emergency_contact_number?: string;
  registration_date?: string;
}

export const d1UserBridge = {
  // 1. Ensure user has a User_Detail entry with public_user_id in D1
  ensureProfile: async (user: { uid: string; email?: string | null; displayName?: string | null; photoURL?: string | null }): Promise<string> => {
    try {
      const res = await fetch('/api/users/ensure-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.uid,
          email: user.email || '',
          display_name: user.displayName || '',
          photo_url: user.photoURL || ''
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.public_user_id) {
          localStorage.setItem(`asp_pub_id_${user.uid}`, data.public_user_id);
          return data.public_user_id;
        }
      }
    } catch (e) {
      console.warn('d1UserBridge.ensureProfile note:', e);
    }
    // Fallback ID from localStorage or generated from date
    const cached = localStorage.getItem(`asp_pub_id_${user.uid}`);
    if (cached) return cached;
    const now = new Date();
    const datePrefix = now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
    return `${datePrefix}01`;
  },

  // 2. Sync profile details to User_Detail in D1
  updateProfile: async (publicUserId: string, details: Partial<PublicUserProfile>): Promise<boolean> => {
    try {
      const res = await fetch('/api/users/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_user_id: publicUserId,
          ...details
        })
      });
      return res.ok;
    } catch (e) {
      console.warn('d1UserBridge.updateProfile error:', e);
      return false;
    }
  },

  // 3. Submit bus & stops to contributions_Bus & contributions_Stops (User specific tables, NEVER main DB)
  submitBusContribution: async (publicUserId: string, bus: any, stops: any[]): Promise<{ success: boolean; id?: number; message?: string }> => {
    try {
      const res = await fetch('/api/contributions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_user_id: publicUserId,
          bus,
          stops
        })
      });
      const data = await res.json();
      return data;
    } catch (e: any) {
      return { success: false, message: e.message || 'Submission failed' };
    }
  },

  // 4. Submit fares to contributions_Fare
  submitFareContribution: async (publicUserId: string, fareData: any): Promise<{ success: boolean; id?: number; message?: string }> => {
    try {
      const res = await fetch('/api/fare-requests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_user_id: publicUserId,
          ...fareData
        })
      });
      const data = await res.json();
      return data;
    } catch (e: any) {
      return { success: false, message: e.message || 'Fare submission failed' };
    }
  },

  // 5. Submit volunteer card to volunteer_card
  submitVolunteerCard: async (publicUserId: string, cardData: any): Promise<{ success: boolean; id?: number; message?: string }> => {
    try {
      const res = await fetch('/api/volunteer-card/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_user_id: publicUserId,
          ...cardData
        })
      });
      const data = await res.json();
      return data;
    } catch (e: any) {
      return { success: false, message: e.message || 'Volunteer card submission failed' };
    }
  },

  // 6. Submit experience certificate request to experience_certificate
  submitExperienceCertificate: async (publicUserId: string, expData: any): Promise<{ success: boolean; id?: number; message?: string }> => {
    try {
      const res = await fetch('/api/experience-certificate/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_user_id: publicUserId,
          ...expData
        })
      });
      const data = await res.json();
      return data;
    } catch (e: any) {
      return { success: false, message: e.message || 'Certificate submission failed' };
    }
  },

  // 7. Sync all Firebase Users into D1 User_Detail table
  syncFirebaseUsersToD1: async (users: any[]): Promise<{ count: number; success: boolean }> => {
    try {
      const res = await fetch('/api/users/sync-all-to-d1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users })
      });
      return await res.json();
    } catch (e) {
      return { count: 0, success: false };
    }
  }
};
