import React from 'react';
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { Task, TaskStatus } from '../../types/task';
import { TaskCard } from './TaskCard';
import { DroppableColumn } from './DroppableColumn';
import { useTaskContext } from '../../contexts/TaskContext';

interface TaskBoardProps {
  onEditTask: (task: Task) => void;
}

const statusColumns: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export const TaskBoard: React.FC<TaskBoardProps> = ({ onEditTask }) => {
  const { getFilteredTasks, updateTask, deleteTask } = useTaskContext();
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const tasks = getFilteredTasks();

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = active.id as string;
    const overId = over.id as string;

    // Check if dropped on a column
    const targetColumn = statusColumns.find((col) => col.id === overId);
    if (targetColumn) {
      updateTask(taskId, { status: targetColumn.id });
      setActiveTask(null);
      return;
    }

    // Check if dropped on another task - find which column that task is in
    const targetTask = tasks.find((t) => t.id === overId);
    if (targetTask && targetTask.status !== activeTask?.status) {
      updateTask(taskId, { status: targetTask.status });
    }

    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {statusColumns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);

          return (
            <DroppableColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={columnTasks}
              onEdit={onEditTask}
              onDelete={deleteTask}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="opacity-50">
            <TaskCard
              task={activeTask}
              onEdit={onEditTask}
              onDelete={deleteTask}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
