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
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold truncate">Task Tracker</h1>
              <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                Manage your tasks with voice or manual input
              </p>
            </div>

            <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
              <div className="flex items-center gap-0.5 md:gap-1 border rounded-lg p-0.5 md:p-1">
                <Button
                  variant={viewMode === 'board' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('board')}
                  className="gap-1 md:gap-2 h-8 px-2 md:px-3"
                >
                  <LayoutGrid className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Board</span>
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="gap-1 md:gap-2 h-8 px-2 md:px-3"
                >
                  <List className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">List</span>
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVoiceInputOpen(true)}
                className="gap-1 md:gap-2 h-8 px-2 md:px-3"
              >
                <Mic className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span className="hidden md:inline">Voice</span>
              </Button>

              <Button
                size="sm"
                onClick={() => setIsTaskFormOpen(true)}
                className="gap-1 md:gap-2 h-8 px-2 md:px-3"
              >
                <Plus className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span className="hidden md:inline">Add</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-6">
        {(errorMessage || error) && (
          <div className="mb-4 p-3 md:p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 flex items-center justify-between text-sm">
            <span className="flex-1 pr-2">{errorMessage || error}</span>
            {error && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="h-auto py-1 px-2 flex-shrink-0"
              >
                Dismiss
              </Button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          <aside className="lg:col-span-1 space-y-4">
            <TaskFilters />
            <div className="p-4 bg-muted/30 rounded-lg">
              <h3 className="text-sm font-semibold mb-3">Statistics</h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-medium">{tasks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">To Do</span>
                  <span className="font-medium">
                    {tasks.filter((t) => t.status === 'todo').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Progress</span>
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
