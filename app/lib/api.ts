// API configuration
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com' 
  : 'http://localhost:8080';

export interface Device {
  id: string;
  name: string;
  department: string;
  status: 'active' | 'maintenance' | 'offline';
  last_maintenance: string;
  next_maintenance: string;
  created_at: string;
  updated_at: string;
}

export interface DeviceUpdate {
  device_id: string;
  status: string;
  department: string;
  updated_at: string;
  alert?: string;
}

export interface Analytics {
  predictive: {
    devices_needing_maintenance: number;
    predicted_failures: number;
    maintenance_schedule: Array<{
      device_id: string;
      next_maintenance: string;
    }>;
    accuracy: number;
  };
  utilization: {
    total_devices: number;
    active_devices: number;
    maintenance_devices: number;
    offline_devices: number;
    utilization_rate: number;
  };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Device endpoints
  async getDevices(): Promise<Device[]> {
    return this.request<Device[]>('/api/devices');
  }

  async createDevice(device: Omit<Device, 'id' | 'created_at' | 'updated_at'>): Promise<Device> {
    return this.request<Device>('/api/devices', {
      method: 'POST',
      body: JSON.stringify(device),
    });
  }

  async updateDevice(id: string, updates: Partial<Device>): Promise<Device> {
    return this.request<Device>(`/api/devices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteDevice(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/devices/${id}`, {
      method: 'DELETE',
    });
  }

  async getDevice(id: string): Promise<Device> {
    return this.request<Device>(`/api/devices/${id}`);
  }

  // Analytics endpoints
  async getPredictiveAnalytics(): Promise<Analytics['predictive']> {
    return this.request<Analytics['predictive']>('/api/analytics/predictive');
  }

  async getDeviceUtilization(): Promise<Analytics['utilization']> {
    return this.request<Analytics['utilization']>('/api/analytics/utilization');
  }

  async getDepartments(): Promise<string[]> {
    return this.request<string[]>('/api/departments');
  }
}

export const apiClient = new ApiClient(API_BASE_URL); 