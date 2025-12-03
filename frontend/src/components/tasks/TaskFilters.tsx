import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { TaskPriority, TaskStatus } from '../../types/task';
import { useTaskContext } from '../../contexts/TaskContext';
import { cn } from '../../lib/utils';

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export const TaskFilters: React.FC = () => {
  const { filters, setFilters } = useTaskContext();
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || '');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFilters({ ...filters, searchQuery: query });
  };

  const toggleStatus = (status: TaskStatus) => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter((s) => s !== status)
      : [...currentStatuses, status];

    setFilters({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined,
    });
  };

  const togglePriority = (priority: TaskPriority) => {
    const currentPriorities = filters.priority || [];
    const newPriorities = currentPriorities.includes(priority)
      ? currentPriorities.filter((p) => p !== priority)
      : [...currentPriorities, priority];

    setFilters({
      ...filters,
      priority: newPriorities.length > 0 ? newPriorities : undefined,
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({});
  };

  const hasActiveFilters =
    searchQuery ||
    (filters.status && filters.status.length > 0) ||
    (filters.priority && filters.priority.length > 0);

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-auto py-1 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-9"
        />
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs font-medium mb-2 text-muted-foreground">Status</p>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => {
              const isActive = filters.status?.includes(option.value);
              return (
                <Badge
                  key={option.value}
                  variant={isActive ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer transition-colors',
                    !isActive && 'hover:bg-muted'
                  )}
                  onClick={() => toggleStatus(option.value)}
                >
                  {option.label}
                </Badge>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium mb-2 text-muted-foreground">Priority</p>
          <div className="flex flex-wrap gap-2">
            {priorityOptions.map((option) => {
              const isActive = filters.priority?.includes(option.value);
              return (
                <Badge
                  key={option.value}
                  variant={isActive ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer transition-colors',
                    !isActive && 'hover:bg-muted'
                  )}
                  onClick={() => togglePriority(option.value)}
                >
                  {option.label}
                </Badge>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
