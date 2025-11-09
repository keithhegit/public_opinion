/**
 * BettaFish API客户端
 * 封装所有API调用
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  [key: string]: any;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // 系统状态
  async getStatus() {
    return this.request<ApiResponse>('/api/status');
  }

  // Engine管理
  async startEngine(appName: string) {
    return this.request<ApiResponse>(`/api/start/${appName}`, {
      method: 'POST',
    });
  }

  async stopEngine(appName: string) {
    return this.request<ApiResponse>(`/api/stop/${appName}`, {
      method: 'POST',
    });
  }

  async getEngineOutput(appName: string) {
    return this.request<ApiResponse>(`/api/output/${appName}`);
  }

  // 搜索
  async search(query: string, engine?: string) {
    return this.request<ApiResponse>('/api/search', {
      method: 'POST',
      body: JSON.stringify({ query, engine }),
    });
  }

  // 配置管理
  async getConfig() {
    return this.request<Record<string, string>>('/api/config');
  }

  async updateConfig(updates: Record<string, string>) {
    return this.request<ApiResponse>('/api/config', {
      method: 'POST',
      body: JSON.stringify(updates),
    });
  }

  // 论坛管理
  async getForumLog() {
    return this.request<ApiResponse>('/api/forum/log');
  }

  async startForum() {
    return this.request<ApiResponse>('/api/forum/start', {
      method: 'POST',
    });
  }

  async stopForum() {
    return this.request<ApiResponse>('/api/forum/stop', {
      method: 'POST',
    });
  }

  // 报告生成
  async generateReport(query: string, customTemplate?: string) {
    return this.request<ApiResponse>('/api/report/generate', {
      method: 'POST',
      body: JSON.stringify({ query, custom_template: customTemplate }),
    });
  }

  async getReportStatus(taskId: string) {
    return this.request<ApiResponse>(`/api/report/status/${taskId}`);
  }

  async getReportResult(taskId: string) {
    return this.request<ApiResponse>(`/api/report/result/${taskId}`);
  }

  async checkEnginesReady() {
    return this.request<ApiResponse>('/api/report/check');
  }
}

export const apiClient = new ApiClient();

