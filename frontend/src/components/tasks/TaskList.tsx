import React from 'react';
import { format } from 'date-fns';
import { Calendar, Edit, Trash2 } from 'lucide-react';
import type { Task, TaskPriority, TaskStatus } from '../../types/task';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useTaskContext } from '../../contexts/TaskContext';
import { cn } from '../../lib/utils';

interface TaskListProps {
  onEditTask: (task: Task) => void;
}

const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-blue-100 text-blue-800 border-blue-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  urgent: 'bg-red-100 text-red-800 border-red-200',
};

const statusColors: Record<TaskStatus, string> = {
  todo: 'bg-gray-100 text-gray-800 border-gray-200',
  in_progress: 'bg-purple-100 text-purple-800 border-purple-200',
  done: 'bg-green-100 text-green-800 border-green-200',
};

const priorityLabels: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

const statusLabels: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

export const TaskList: React.FC<TaskListProps> = ({ onEditTask }) => {
  const { getFilteredTasks, deleteTask } = useTaskContext();
  const tasks = getFilteredTasks();

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground px-4">
        <p className="text-center text-sm md:text-base">No tasks found. Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Desktop header - hidden on mobile */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
        <div className="col-span-4">Task</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Priority</div>
        <div className="col-span-2">Due Date</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      <div className="space-y-2 md:space-y-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-3 md:p-0 bg-muted/30 md:bg-transparent rounded-lg md:rounded-none border md:border-0"
          >
            {/* Mobile Layout */}
            <div className="md:hidden space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm mb-1 line-clamp-2">{task.title}</h4>
                  {task.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {task.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEditTask(task)}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => deleteTask(task.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className={cn('text-xs', statusColors[task.status])}
                  variant="outline"
                >
                  {statusLabels[task.status]}
                </Badge>
                <Badge
                  className={cn('text-xs', priorityColors[task.priority])}
                  variant="outline"
                >
                  {priorityLabels[task.priority]}
                </Badge>
                {task.dueDate && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-muted/50 rounded-lg transition-colors">
              <div className="col-span-4">
                <h4 className="font-medium text-sm mb-1">{task.title}</h4>
                {task.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {task.description}
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <Badge
                  className={cn('text-xs', statusColors[task.status])}
                  variant="outline"
                >
                  {statusLabels[task.status]}
                </Badge>
              </div>

              <div className="col-span-2">
                <Badge
                  className={cn('text-xs', priorityColors[task.priority])}
                  variant="outline"
                >
                  {priorityLabels[task.priority]}
                </Badge>
              </div>

              <div className="col-span-2 text-sm text-muted-foreground">
                {task.dueDate ? (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                  </div>
                ) : (
                  <span className="text-xs">No due date</span>
                )}
              </div>

              <div className="col-span-2 flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onEditTask(task)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
