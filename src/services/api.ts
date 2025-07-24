const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  token?: string;
  user?: any;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage
    this.token = localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth methods
  async login(username: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (response.success && response.token) {
      this.token = response.token;
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
  }

  async logout() {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  async verifyToken() {
    return this.request('/auth/verify');
  }

  // Certificate methods
  async getCertificates() {
    return this.request('/certificates');
  }

  async getCertificate(id: string) {
    return this.request(`/certificates/${id}`);
  }

  async createCertificate(certificateData: {
    balance: number;
    client_name?: string;
    client_email?: string;
    client_phone?: string;
  }) {
    return this.request('/certificates', {
      method: 'POST',
      body: JSON.stringify(certificateData),
    });
  }

  async updateCertificateBalance(
    id: string,
    operation: 'add' | 'subtract',
    amount: number,
    description?: string
  ) {
    return this.request(`/certificates/${id}/balance`, {
      method: 'PATCH',
      body: JSON.stringify({ operation, amount, description }),
    });
  }

  async createPayment(
    certificateId: string,
    paymentData: {
      amount: number;
      payment_type: 'activate' | 'topup';
      client_name?: string;
      client_email?: string;
      description?: string;
    }
  ) {
    return this.request(`/certificates/${certificateId}/payment`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async getCertificateTransactions(id: string) {
    return this.request(`/certificates/${id}/transactions`);
  }

  async getCertificatePayments(id: string) {
    return this.request(`/certificates/${id}/payments`);
  }

  // Payment methods
  async getPayment(id: string) {
    return this.request(`/payments/${id}`);
  }

  async checkPaymentStatus(id: string) {
    return this.request(`/payments/${id}/status`);
  }

  async cancelPayment(id: string) {
    return this.request(`/payments/${id}/cancel`, {
      method: 'POST',
    });
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export const apiService = new ApiService();
export default apiService; 