// Automatically detect environment and set API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = {
  // Admin endpoints
  adminLogin: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    return response.json();
  },

  // User endpoints
  verifyUser: async (username: string) => {
    const response = await fetch(`${API_BASE_URL}/api/users/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Verification failed');
    }
    
    return response.json();
  },

  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/api/users`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch users');
    }
    
    return response.json();
  },

  createUser: async (userData: {
    full_name: string;
    phone_number: string;
    is_adult: boolean;
    status: 'active' | 'inactive';
    admin_id: number;
    duration?: '1_week' | '15_days' | '1_month' | '3_months' | '6_months' | 'unlimited';
  }) => {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create user');
    }
    
    return response.json();
  },

  updateUser: async (userId: number, userData: {
    full_name: string;
    phone_number: string;
    is_adult: boolean;
    status: 'active' | 'inactive';
    duration?: '1_week' | '15_days' | '1_month' | '3_months' | '6_months' | 'unlimited';
  }) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update user');
    }
    
    return response.json();
  },

  deleteUser: async (userId: number) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete user');
    }
    
    return response.json();
  },

  // Admin management endpoints
  changeAdminPassword: async (adminId: number, passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/${adminId}/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(passwordData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to change password');
    }
    
    return response.json();
  },

  // Feedback endpoints
  submitFeedback: async (feedbackData: {
    name: string;
    email?: string;
    message: string;
    rating: number;
    username?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedbackData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit feedback');
    }
    
    return response.json();
  },

  getFeedbacks: async () => {
    const response = await fetch(`${API_BASE_URL}/api/feedback`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch feedbacks');
    }
    
    return response.json();
  },

  getPublicReviews: async () => {
    const response = await fetch(`${API_BASE_URL}/api/feedback/public`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch reviews');
    }
    
    return response.json();
  },

  deleteFeedback: async (feedbackId: number) => {
    const response = await fetch(`${API_BASE_URL}/api/feedback/${feedbackId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete feedback');
    }
    
    return response.json();
  },

  approveFeedback: async (feedbackId: number) => {
    const response = await fetch(`${API_BASE_URL}/api/feedback/${feedbackId}/approve`, {
      method: 'PUT',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to approve feedback');
    }
    
    return response.json();
  },

  rejectFeedback: async (feedbackId: number) => {
    const response = await fetch(`${API_BASE_URL}/api/feedback/${feedbackId}/reject`, {
      method: 'PUT',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to reject feedback');
    }
    
    return response.json();
  },

  // Adult page password management
  getAdultPagePassword: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/adult-password`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get adult page password');
    }
    
    return response.json();
  },

  updateAdultPagePassword: async (newPassword: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/adult-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: newPassword }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update adult page password');
    }
    
    return response.json();
  },
};
