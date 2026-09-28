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
  },

  // 8. Admin Approve Volunteer Card in D1
  approveVolunteerCard: async (data: {
    id?: number | string;
    public_user_id?: string;
    user_id?: string;
    user_email?: string;
    volunteer_card_id?: string;
    admin_email?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`/api/volunteer-card/${data.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (e: any) {
      console.warn('d1UserBridge.approveVolunteerCard note:', e);
      return { success: false, message: e.message };
    }
  },

  // 9. Admin Reject Volunteer Card in D1
  rejectVolunteerCard: async (data: {
    id?: number | string;
    public_user_id?: string;
    user_id?: string;
    user_email?: string;
    reason?: string;
    admin_email?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`/api/volunteer-card/${data.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (e: any) {
      console.warn('d1UserBridge.rejectVolunteerCard note:', e);
      return { success: false, message: e.message };
    }
  },

  // 10. Admin Approve Experience Certificate in D1
  approveExperienceCertificate: async (data: {
    id?: number | string;
    public_user_id?: string;
    user_id?: string;
    user_email?: string;
    verification_id?: string;
    registration_date?: string;
    duration_months?: number;
    contributions_count?: number;
    admin_email?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`/api/experience-certificate/${data.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (e: any) {
      console.warn('d1UserBridge.approveExperienceCertificate note:', e);
      return { success: false, message: e.message };
    }
  },

  // 11. Admin Reject Experience Certificate in D1
  rejectExperienceCertificate: async (data: {
    id?: number | string;
    public_user_id?: string;
    user_id?: string;
    user_email?: string;
    reason?: string;
    admin_email?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`/api/experience-certificate/${data.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (e: any) {
      console.warn('d1UserBridge.rejectExperienceCertificate note:', e);
      return { success: false, message: e.message };
    }
  },

  // 12. Fetch all Volunteer Card requests for Admin from D1
  getAdminVolunteerCardRequests: async (adminEmail: string): Promise<any[]> => {
    try {
      const res = await fetch(`/api/volunteer-card/admin/all?email=${encodeURIComponent(adminEmail)}`);
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data.requests) ? data.requests : [];
      }
      return [];
    } catch (e) {
      return [];
    }
  },

  // 13. Fetch all Experience Certificate requests for Admin from D1
  getAdminExperienceRequests: async (adminEmail: string): Promise<any[]> => {
    try {
      const res = await fetch(`/api/experience-certificate/admin/all?email=${encodeURIComponent(adminEmail)}`);
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data.requests) ? data.requests : [];
      }
      return [];
    } catch (e) {
      return [];
    }
  },

  // 14. Fetch user volunteer card from D1
  getMyVolunteerCard: async (publicUserId?: string, userId?: string): Promise<any | null> => {
    try {
      const params = new URLSearchParams();
      if (publicUserId) params.set('public_user_id', publicUserId);
      const res = await fetch(`/api/volunteer-card/mine?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data.requests) && data.requests.length > 0 ? data.requests[0] : null;
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  // 15. Fetch user experience certificate from D1
  getMyExperienceCertificate: async (publicUserId?: string, userId?: string): Promise<any | null> => {
    try {
      const params = new URLSearchParams();
      if (publicUserId) params.set('public_user_id', publicUserId);
      const res = await fetch(`/api/experience-certificate/mine?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data.requests) && data.requests.length > 0 ? data.requests[0] : null;
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  // 16. Admin Fetch all Fare requests from D1
  getAdminFareRequests: async (adminEmail: string): Promise<any[]> => {
    try {
      const res = await fetch(`/api/fare-requests/admin/all?email=${encodeURIComponent(adminEmail)}`);
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data.requests) ? data.requests : [];
      }
      return [];
    } catch (e) {
      return [];
    }
  },

  // 17. Admin Approve Fare request in D1
  approveFareRequest: async (id: number | string, adminEmail: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`/api/fare-requests/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_email: adminEmail })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  },

  // 18. Admin Reject Fare request in D1
  rejectFareRequest: async (id: number | string, reason: string, adminEmail: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`/api/fare-requests/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, admin_email: adminEmail })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  },

  // 19. User Fetch my Fare requests from D1
  getMyFareRequests: async (publicUserId: string, userId?: string): Promise<any[]> => {
    try {
      const params = new URLSearchParams();
      if (publicUserId) params.set('public_user_id', publicUserId);
      if (userId) params.set('user_id', userId);
      const res = await fetch(`/api/fare-requests/mine?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return Array.isArray(data.fares) ? data.fares : [];
      }
      return [];
    } catch (e) {
      return [];
    }
  },

  // 20. User Resubmit rejected bus contribution in D1
  resubmitBusContribution: async (id: number | string, publicUserId: string, busData: any, stops: any[]): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`/api/contributions/${id}/resubmit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_user_id: publicUserId,
          ...busData,
          stops
        })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  },

  // 21. User Resubmit rejected fare request in D1
  resubmitFareContribution: async (id: number | string, publicUserId: string, fareData: any): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch(`/api/fare-requests/${id}/resubmit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_user_id: publicUserId,
          ...fareData
        })
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }
};
