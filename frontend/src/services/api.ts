import type { Task, CreateTaskInput, UpdateTaskInput } from '../types/task';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
  message?: string;
}

class ApiError extends Error {
  status?: number;
  response?: any;

  constructor(message: string, status?: number, response?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data: ApiResponse<T> = await response.json();

  if (!response.ok || !data.success) {
    throw new ApiError(
      data.error || 'An error occurred',
      response.status,
      data
    );
  }

  return data.data as T;
}

export const taskAPI = {
  // Get all tasks with optional filters
  async getAll(params?: {
    status?: string;
    priority?: string;
    search?: string;
    sort?: string;
  }): Promise<Task[]> {
    const queryParams = new URLSearchParams();

    if (params?.status) queryParams.append('status', params.status);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sort) queryParams.append('sort', params.sort);

    const url = `${API_URL}/tasks${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

    const response = await fetch(url);
    const data: ApiResponse<Task[]> = await response.json();

    if (!response.ok || !data.success) {
      throw new ApiError(data.error || 'Failed to fetch tasks', response.status);
    }

    return data.data || [];
  },

  // Get single task by ID
  async getOne(id: string): Promise<Task> {
    const response = await fetch(`${API_URL}/tasks/${id}`);
    return handleResponse<Task>(response);
  },

  // Create new task
  async create(input: CreateTaskInput): Promise<Task> {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    return handleResponse<Task>(response);
  },

  // Update task
  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    return handleResponse<Task>(response);
  },

  // Delete task
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const data = await response.json();
      throw new ApiError(data.error || 'Failed to delete task', response.status);
    }
  },

  // Get task statistics
  async getStats(): Promise<{
    total: number;
    byStatus: Array<{ _id: string; count: number }>;
    byPriority: Array<{ _id: string; count: number }>;
  }> {
    const response = await fetch(`${API_URL}/tasks/stats`);
    return handleResponse(response);
  },
};

export { ApiError };
export type { ApiResponse };
