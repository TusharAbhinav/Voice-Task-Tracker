# Voice-Enabled Task Tracker - Frontend

A modern, intuitive task tracking application built with React, TypeScript, and Vite. Features intelligent voice input for creating tasks naturally through speech.

## Features

- **Voice Input**: Create tasks by speaking naturally with intelligent parsing
- **Dual View Modes**: Switch between Kanban board and list views
- **Drag & Drop**: Easily move tasks between status columns
- **Smart Filtering**: Filter by status, priority, and search by keywords
- **Task Management**: Full CRUD operations with validation
- **Real-time Statistics**: Track task counts by status
- **Responsive Design**: Works seamlessly on desktop and tablet devices
- **Modern UI**: Built with shadcn/ui and Tailwind CSS

## Tech Stack

### Core
- **React 18.3** - UI library
- **TypeScript 5.x** - Type safety
- **Vite 7.x** - Build tool and dev server

### UI Components & Styling
- **shadcn/ui** - High-quality, accessible components
- **Tailwind CSS v3** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible component primitives
- **Lucide React** - Icon library
- **class-variance-authority** - Component variant management

### State Management & Forms
- **React Context API** - Global state management
- **React Hook Form** - Form validation and management
- **Zod** - Schema validation

### Drag & Drop
- **@dnd-kit/core** - Drag and drop functionality
- **@dnd-kit/sortable** - Sortable lists
- **@dnd-kit/utilities** - Utility functions

### Date Handling
- **date-fns** - Modern date utility library

### Voice Recognition
- **Web Speech API** - Browser-native speech recognition

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   └── ...
│   │   └── tasks/           # Task-specific components
│   │       ├── TaskBoard.tsx
│   │       ├── TaskCard.tsx
│   │       ├── TaskForm.tsx
│   │       ├── TaskList.tsx
│   │       ├── TaskFilters.tsx
│   │       ├── VoiceInput.tsx
│   │       ├── VoiceTaskReview.tsx
│   │       └── SortableTaskCard.tsx
│   ├── contexts/
│   │   └── TaskContext.tsx  # Global task state management
│   ├── hooks/               # Custom React hooks (future)
│   ├── lib/
│   │   └── utils.ts         # Utility functions (cn)
│   ├── types/
│   │   └── task.ts          # TypeScript type definitions
│   ├── utils/
│   │   └── parseVoiceInput.ts  # Voice parsing logic
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles and Tailwind imports
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
└── vite.config.ts           # Vite configuration
```

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Modern Browser**: Chrome, Edge, or Safari with Web Speech API support

## Installation

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **No environment variables required** for the frontend (uses browser's Web Speech API)

## Running the Application

### Development Mode

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Production Build

Build the application for production:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Usage Guide

### Creating Tasks Manually

1. Click the **"Add Task"** button in the header
2. Fill in the task details:
   - **Title** (required)
   - **Description** (optional)
   - **Status**: To Do, In Progress, or Done
   - **Priority**: Low, Medium, High, or Urgent
   - **Due Date** (optional)
3. Click **"Create Task"** to save

### Creating Tasks with Voice

1. Click the **"Voice Input"** button in the header
2. Click the microphone icon to start recording
3. Speak your task naturally, for example:
   - "Create a high priority task to review the pull request by tomorrow evening"
   - "Add a task to prepare presentation slides for next Monday"
   - "Remind me to send the project proposal by Friday"
4. Click the microphone again to stop recording
5. Review the parsed task details in the preview modal
6. Edit any fields if needed
7. Click **"Create Task"** to save

### Voice Input Examples

The voice parser understands natural language patterns:

**Priority Keywords**:
- "urgent", "critical", "asap" → Urgent
- "high priority", "important" → High
- "low priority" → Low
- Default → Medium

**Due Date Examples**:
- "today", "today evening", "today morning"
- "tomorrow", "tomorrow afternoon"
- "next Monday", "this Friday"
- "in 3 days", "in 2 weeks"
- "15th January", "Jan 20"

**Status Keywords**:
- "in progress", "working on" → In Progress
- "done", "completed" → Done
- Default → To Do

### Managing Tasks

**Edit Task**:
- Hover over a task card
- Click the edit (pencil) icon
- Modify fields and save

**Delete Task**:
- Hover over a task card
- Click the delete (trash) icon

**Move Tasks** (Board View):
- Drag a task card to a different column
- Drop it to update the status

### Filtering Tasks

Use the sidebar filters to narrow down tasks:

1. **Search**: Type keywords to search in task titles and descriptions
2. **Status**: Click status badges to filter by To Do, In Progress, or Done
3. **Priority**: Click priority badges to filter by Low, Medium, High, or Urgent
4. **Clear All**: Remove all active filters

### Switching Views

Toggle between views using the header buttons:

- **Board View**: Kanban-style columns for visual task management
- **List View**: Tabular view with all task details

## Voice Input Technical Details

### Speech Recognition

The application uses the **Web Speech API** (`webkitSpeechRecognition` or `SpeechRecognition`):

- **Language**: English (en-US)
- **Continuous**: False (stops after one phrase)
- **Interim Results**: False (returns only final results)

### Browser Compatibility

Voice input works in:
- ✅ Google Chrome (all platforms)
- ✅ Microsoft Edge (Chromium-based)
- ✅ Safari 14.1+ (macOS, iOS)
- ❌ Firefox (not supported)

### Voice Parsing Logic

The `parseVoiceInput` utility function (`src/utils/parseVoiceInput.ts`) extracts:

1. **Title**: Main task description (cleaned of metadata)
2. **Priority**: Keywords like "urgent", "high priority"
3. **Due Date**: Relative dates ("tomorrow") or absolute dates ("Jan 20")
4. **Status**: Defaults to "To Do"

## Development

### Adding New Components

1. Create component in appropriate directory
2. Use TypeScript for type safety
3. Follow existing patterns for consistency
4. Use shadcn/ui components where possible

### Modifying Types

Edit `src/types/task.ts` to add new fields or change interfaces.

### Customizing Theme

Modify `src/index.css` to adjust the color palette and design tokens.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (if configured)

## Key Design Decisions

### State Management
- **React Context API** chosen over Redux for simplicity
- Single TaskContext manages all task operations
- Filters stored separately for easy reset

### Component Architecture
- **Compound components** pattern for complex UI (Card, Dialog)
- **Render props** for drag & drop (dnd-kit)
- **Controlled components** for forms (react-hook-form)

### Voice Parsing
- **Client-side parsing** for instant feedback
- **Pattern matching** with regex for natural language
- **Graceful degradation** when fields can't be extracted

### Styling
- **Tailwind CSS** for rapid development
- **CSS variables** for theming (shadcn approach)
- **Responsive utilities** for mobile support

## Known Limitations

1. **Voice Recognition**:
   - Requires microphone permissions
   - Internet connection needed (browser API limitation)
   - Works only in supported browsers

2. **Data Persistence**:
   - Tasks stored in memory only (refreshing clears all tasks)
   - Backend integration required for persistence

3. **Voice Parsing**:
   - English language only
   - May misinterpret complex or ambiguous phrasing
   - Users should review parsed results before saving

## Future Enhancements

- [ ] Backend integration with RESTful API
- [ ] Local storage for persistence
- [ ] More natural language patterns
- [ ] Multiple language support
- [ ] Task attachments and comments
- [ ] Recurring tasks
- [ ] Task categories/tags
- [ ] Dark mode toggle
- [ ] Export tasks to CSV/JSON
- [ ] Keyboard shortcuts
- [ ] Accessibility improvements (ARIA labels)

## Troubleshooting

### Voice Input Not Working

**Issue**: Microphone button doesn't respond or shows error

**Solutions**:
1. Check browser compatibility (use Chrome or Edge)
2. Allow microphone permissions when prompted
3. Ensure you're using HTTPS (or localhost)
4. Check browser console for error messages

### Build Errors

**Issue**: `npm run build` fails

**Solutions**:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Ensure Node.js version is 18 or higher
4. Check for TypeScript errors

### Development Server Issues

**Issue**: `npm run dev` fails or port 5173 in use

**Solutions**:
1. Kill any process using port 5173
2. Use `--port` flag: `npm run dev -- --port 3000`
3. Check for file permission issues

## Contributing

When contributing to this project:

1. Follow the existing code style and patterns
2. Use TypeScript for all new code
3. Test in multiple browsers
4. Update documentation for new features
5. Ensure the build passes before submitting

## License

This project is part of an SDE assignment for educational purposes.
