import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { Task, CreateTaskInput, UpdateTaskInput, TaskFilters } from '../types/task';
import {
  useTasksQuery,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from '../hooks/useTasks';

interface TaskContextType {
  tasks: Task[];
  filters: TaskFilters;
  loading: boolean;
  error: string | null;
  addTask: (input: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setFilters: (filters: TaskFilters) => void;
  getFilteredTasks: () => Task[];
  refreshTasks: () => Promise<void>;
  clearError: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<TaskFilters>({});

  const { data: tasks = [], isLoading, error: queryError, refetch } = useTasksQuery();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const loading = isLoading || createTaskMutation.isPending || updateTaskMutation.isPending || deleteTaskMutation.isPending;

  const error = queryError?.message || createTaskMutation.error?.message || updateTaskMutation.error?.message || deleteTaskMutation.error?.message || null;

  const addTask = useCallback(async (input: CreateTaskInput) => {
    await createTaskMutation.mutateAsync(input);
  }, [createTaskMutation]);

  const updateTask = useCallback(async (id: string, input: UpdateTaskInput) => {
    await updateTaskMutation.mutateAsync({ id, input });
  }, [updateTaskMutation]);

  const deleteTask = useCallback(async (id: string) => {
    await deleteTaskMutation.mutateAsync(id);
  }, [deleteTaskMutation]);

  const getFilteredTasks = useCallback(() => {
    let filtered = [...tasks];

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        task =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
      );
    }

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(task => filters.status!.includes(task.status));
    }

    if (filters.priority && filters.priority.length > 0) {
      filtered = filtered.filter(task => filters.priority!.includes(task.priority));
    }

    if (filters.dueDateRange) {
      const { start, end } = filters.dueDateRange;
      filtered = filtered.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        if (start && dueDate < start) return false;
        if (end && dueDate > end) return false;
        return true;
      });
    }

    return filtered;
  }, [tasks, filters]);

  const refreshTasks = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const clearError = useCallback(() => {
    createTaskMutation.reset();
    updateTaskMutation.reset();
    deleteTaskMutation.reset();
  }, [createTaskMutation, updateTaskMutation, deleteTaskMutation]);

  const value: TaskContextType = useMemo(() => ({
    tasks,
    filters,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    setFilters,
    getFilteredTasks,
    refreshTasks,
    clearError,
  }), [
    tasks,
    filters,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    getFilteredTasks,
    refreshTasks,
    clearError,
  ]);

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
