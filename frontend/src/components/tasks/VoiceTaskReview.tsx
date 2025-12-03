import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { AlertCircle } from 'lucide-react';
import type { TaskPriority, TaskStatus } from '../../types/task';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useTaskContext } from '../../contexts/TaskContext';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  status: z.enum(['todo', 'in_progress', 'done']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface VoiceTaskReviewProps {
  transcript: string;
  parsedTitle: string;
  parsedPriority: TaskPriority;
  parsedDueDate?: Date;
  parsedStatus: TaskStatus;
  onSuccess: () => void;
  onCancel: () => void;
}

export const VoiceTaskReview: React.FC<VoiceTaskReviewProps> = ({
  transcript,
  parsedTitle,
  parsedPriority,
  parsedDueDate,
  parsedStatus,
  onSuccess,
  onCancel,
}) => {
  const { addTask } = useTaskContext();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: parsedTitle,
      status: parsedStatus,
      priority: parsedPriority,
      dueDate: parsedDueDate ? format(parsedDueDate, 'yyyy-MM-dd') : '',
    },
  });

  const selectedStatus = watch('status');
  const selectedPriority = watch('priority');

  const onSubmit = (data: TaskFormData) => {
    addTask({
      title: data.title,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    });
    onSuccess();
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg space-y-2">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Voice Transcript</p>
            <p className="text-sm text-muted-foreground italic">"{transcript}"</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Parsed Task Details</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Review and edit the details below before creating the task
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter task title"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={selectedStatus}
                onValueChange={(value) => setValue('status', value as TaskStatus)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={selectedPriority}
                onValueChange={(value) => setValue('priority', value as TaskPriority)}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              {...register('dueDate')}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
