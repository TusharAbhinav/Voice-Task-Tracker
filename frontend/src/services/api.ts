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

export const taskAPI = {
  async getAll(): Promise<Task[]> {
    const response = await fetch(`${API_URL}/tasks`);
    const data: ApiResponse<Task[]> = await response.json();

    if (!response.ok || !data.success) {
      throw new ApiError(data.error || 'Failed to fetch tasks', response.status);
    }

    return data.data || [];
  },

  async create(input: CreateTaskInput): Promise<Task> {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    const data: ApiResponse<Task> = await response.json();

    if (!response.ok || !data.success) {
      throw new ApiError(data.error || 'Failed to create task', response.status);
    }

    return data.data as Task;
  },

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    const data: ApiResponse<Task> = await response.json();

    if (!response.ok || !data.success) {
      throw new ApiError(data.error || 'Failed to update task', response.status);
    }

    return data.data as Task;
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const data = await response.json();
      throw new ApiError(data.error || 'Failed to delete task', response.status);
    }
  },
};

export { ApiError };
export type { ApiResponse };
