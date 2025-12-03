export type TaskStatus = "todo" | "in_progress" | "done";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
}

export interface VoiceTaskInput {
  transcript: string;
  parsedTitle?: string;
  parsedPriority?: TaskPriority;
  parsedDueDate?: Date;
  parsedStatus?: TaskStatus;
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  dueDateRange?: {
    start?: Date;
    end?: Date;
  };
  searchQuery?: string;
}

export type ViewMode = "board" | "list";
