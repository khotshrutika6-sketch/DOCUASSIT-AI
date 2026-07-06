export interface Activity {
  id: string;
  title: string;
  type: string; // 'verification' | 'service' | 'workflow' | 'checklist' | 'reminder'
  timestamp: string;
  status: 'Verified' | 'Processing' | 'Pending' | 'Completed' | 'Failed' | 'Rejected' | 'Approved';
  progress: number; // 0 - 100
  details?: string;
}

export const activityService = {
  getActivities(userId: string): Activity[] {
    if (!userId) return [];
    try {
      const data = localStorage.getItem(`docassist_activity_${userId}`);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to parse user activities', e);
      return [];
    }
  },

  addActivity(userId: string, item: Omit<Activity, 'id' | 'timestamp'>): Activity {
    if (!userId) {
      throw new Error('User ID is required to log activity');
    }
    const activities = this.getActivities(userId);
    const newActivity: Activity = {
      ...item,
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    
    // Add to the front of the list (newest first)
    const updated = [newActivity, ...activities];
    localStorage.setItem(`docassist_activity_${userId}`, JSON.stringify(updated));

    // Dispatch a custom event to notify components in real-time
    window.dispatchEvent(new CustomEvent('docassist_activity_update', { detail: { userId } }));
    
    return newActivity;
  },

  clearActivities(userId: string): void {
    if (!userId) return;
    localStorage.removeItem(`docassist_activity_${userId}`);
    window.dispatchEvent(new CustomEvent('docassist_activity_update', { detail: { userId } }));
  }
};
