import { useState } from 'react';
import { Plus, Mic, LayoutGrid, List, Loader2 } from 'lucide-react';
import type { Task, ViewMode } from './types/task';
import { TaskBoard } from './components/tasks/TaskBoard';
import { TaskList } from './components/tasks/TaskList';
import { TaskForm } from './components/tasks/TaskForm';
import { TaskFilters } from './components/tasks/TaskFilters';
import { VoiceInput } from './components/tasks/VoiceInput';
import { VoiceTaskReview } from './components/tasks/VoiceTaskReview';
import { Button } from './components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './components/ui/dialog';
import { parseVoiceInput } from './utils/parseVoiceInput';
import { useTaskContext } from './contexts/TaskContext';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isVoiceInputOpen, setIsVoiceInputOpen] = useState(false);
  const [isVoiceReviewOpen, setIsVoiceReviewOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [parsedVoiceTask, setParsedVoiceTask] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { getFilteredTasks, loading, error, clearError } = useTaskContext();

  const handleVoiceTranscript = (transcript: string) => {
    setVoiceTranscript(transcript);
    const parsed = parseVoiceInput(transcript);
    setParsedVoiceTask(parsed);
    setIsVoiceInputOpen(false);
    setIsVoiceReviewOpen(true);
  };

  const handleVoiceError = (error: string) => {
    setErrorMessage(error);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleCloseTaskForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(undefined);
  };

  const handleCloseVoiceReview = () => {
    setIsVoiceReviewOpen(false);
    setVoiceTranscript('');
    setParsedVoiceTask(null);
  };

  const tasks = getFilteredTasks();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Task Tracker</h1>
              <p className="text-sm text-muted-foreground">
                Manage your tasks with voice or manual input
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 border rounded-lg p-1">
                <Button
                  variant={viewMode === 'board' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('board')}
                  className="gap-2"
                >
                  <LayoutGrid className="h-4 w-4" />
                  Board
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="gap-2"
                >
                  <List className="h-4 w-4" />
                  List
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVoiceInputOpen(true)}
                className="gap-2"
              >
                <Mic className="h-4 w-4" />
                Voice Input
              </Button>

              <Button
                size="sm"
                onClick={() => setIsTaskFormOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {(errorMessage || error) && (
          <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 flex items-center justify-between">
            <span>{errorMessage || error}</span>
            {error && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="h-auto py-1 px-2"
              >
                Dismiss
              </Button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <TaskFilters />
            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <h3 className="text-sm font-semibold mb-2">Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Tasks</span>
                  <span className="font-medium">{tasks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">To Do</span>
                  <span className="font-medium">
                    {tasks.filter((t) => t.status === 'todo').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">In Progress</span>
                  <span className="font-medium">
                    {tasks.filter((t) => t.status === 'in_progress').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Done</span>
                  <span className="font-medium">
                    {tasks.filter((t) => t.status === 'done').length}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3">
            {loading && tasks.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading tasks...</p>
                </div>
              </div>
            ) : viewMode === 'board' ? (
              <TaskBoard onEditTask={handleEditTask} />
            ) : (
              <TaskList onEditTask={handleEditTask} />
            )}
          </div>
        </div>
      </main>

      <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </DialogTitle>
          </DialogHeader>
          <TaskForm
            task={editingTask}
            onSuccess={handleCloseTaskForm}
            onCancel={handleCloseTaskForm}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isVoiceInputOpen} onOpenChange={setIsVoiceInputOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Voice Input</DialogTitle>
          </DialogHeader>
          <VoiceInput
            onTranscript={handleVoiceTranscript}
            onError={handleVoiceError}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isVoiceReviewOpen} onOpenChange={setIsVoiceReviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Voice Task</DialogTitle>
          </DialogHeader>
          {parsedVoiceTask && (
            <VoiceTaskReview
              transcript={voiceTranscript}
              parsedTitle={parsedVoiceTask.title}
              parsedPriority={parsedVoiceTask.priority}
              parsedDueDate={parsedVoiceTask.dueDate}
              parsedStatus={parsedVoiceTask.status}
              onSuccess={handleCloseVoiceReview}
              onCancel={handleCloseVoiceReview}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
