# 🎙️ Voice-Enabled Task Tracker

A modern, full-stack task management application inspired by Linear, featuring intelligent voice input for creating tasks naturally through speech. Built with React, Node.js, Express, and MongoDB.

![Tech Stack](https://img.shields.io/badge/React-18.3-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

## ✨ Key Features

### 🎤 Voice Input
- **Natural Language Processing** - Speak tasks naturally: "Create a high priority task to review the pull request by tomorrow evening"
- **Intelligent Parsing** - Automatically extracts title, priority, due date, and status from speech
- **Review Before Save** - Edit parsed fields before creating the task
- **Smart Date Recognition** - Understands relative dates (tomorrow, next Monday, in 3 days) and absolute dates (Jan 20, 15th January)

### 📋 Task Management
- **Dual View Modes** - Switch between Kanban board and list views
- **Drag & Drop** - Intuitive task status updates by dragging between columns
- **Advanced Filtering** - Filter by status, priority, and search by keywords
- **Full CRUD Operations** - Create, read, update, and delete tasks
- **Real-time Statistics** - Track task counts by status and priority
- **Data Persistence** - All tasks stored in MongoDB Atlas cloud database

### 🎨 Modern UI/UX
- **Responsive Design** - Works seamlessly on desktop and tablet
- **shadcn/ui Components** - Beautiful, accessible component library
- **Tailwind CSS** - Modern styling with dark mode support
- **Loading States** - Clear feedback during API operations
- **Error Handling** - User-friendly error messages

## 🏗️ Architecture

```
Voice-Enabled-Task-Tracker/
├── frontend/                    # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/         # UI components
│   │   │   ├── ui/            # shadcn/ui base components
│   │   │   └── tasks/         # Task-specific components
│   │   ├── contexts/          # React Context for UI state
│   │   ├── hooks/             # React Query hooks
│   │   ├── services/          # API service layer
│   │   ├── types/             # TypeScript definitions
│   │   ├── utils/             # Voice parsing & utilities
│   │   └── App.tsx            # Main application
│   └── package.json
│
└── backend/                    # Node.js + Express + MongoDB
    ├── src/
    │   ├── config/            # Database configuration
    │   ├── controllers/       # Business logic
    │   ├── middleware/        # Error handling
    │   ├── models/            # Mongoose schemas
    │   ├── routes/            # API routes
    │   └── server.js          # Entry point
    └── package.json
```

## 🚀 Tech Stack

### Frontend
- **React 18.3** - UI library with hooks
- **TypeScript 5.x** - Type safety
- **Vite 7.x** - Fast build tool and dev server
- **React Query** - Server state management with caching
- **shadcn/ui** - High-quality component library
- **Tailwind CSS v3** - Utility-first CSS
- **@dnd-kit** - Drag and drop functionality
- **date-fns** - Date manipulation
- **Zod** - Schema validation
- **React Hook Form** - Form management
- **Web Speech API** - Browser-native speech recognition

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express.js v5** - Web framework
- **MongoDB Atlas** - Cloud NoSQL database
- **Mongoose v9** - MongoDB ODM
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration
- **Morgan** - HTTP request logger

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher
- **MongoDB Atlas Account** (free tier available)
- **Modern Browser** - Chrome, Edge, or Safari (for voice input)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Voice-Enabled-Task-Tracker
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables

Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

Edit `.env` with your MongoDB Atlas credentials:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/task-tracker?retryWrites=true&w=majority

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

**To get MongoDB Atlas URI:**
1. Sign up at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free cluster (M0)
3. Create database user
4. Whitelist IP address (0.0.0.0/0 for development)
5. Get connection string from "Connect" → "Drivers"
6. Replace `<password>` and add database name `/task-tracker`

#### Start Backend Server
```bash
npm run dev
```

Backend will run at `http://localhost:3000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Configure Environment Variables

Create `.env` file:
```bash
echo "VITE_API_URL=http://localhost:3000/api" > .env
```

#### Start Frontend Development Server
```bash
npm run dev
```

Frontend will run at `http://localhost:5173`

### 4. Open Application

Navigate to `http://localhost:5173` in your browser!

## 📖 Usage Guide

### Creating Tasks Manually

1. Click **"Add Task"** button
2. Fill in task details:
   - Title (required)
   - Description (optional)
   - Status: To Do, In Progress, or Done
   - Priority: Low, Medium, High, or Urgent
   - Due Date (optional)
3. Click **"Create Task"**

### Creating Tasks with Voice

1. Click **"Voice Input"** button
2. Click the microphone icon
3. Speak naturally:
   ```
   "Create a high priority task to review the authentication module by tomorrow evening"
   ```
4. Review the parsed details
5. Edit if needed
6. Click **"Create Task"**

### Voice Input Examples

**Priority Keywords:**
- "urgent", "critical", "asap" → Urgent
- "high priority", "important" → High
- "low priority" → Low
- Default → Medium

**Due Date Examples:**
- "today", "today evening"
- "tomorrow", "tomorrow afternoon"
- "next Monday", "this Friday"
- "in 3 days", "in 2 weeks"
- "15th January", "Jan 20"

**Status Keywords:**
- "in progress", "working on" → In Progress
- "done", "completed" → Done
- Default → To Do

### Managing Tasks

**View Modes:**
- Click **Board** for Kanban view
- Click **List** for table view

**Edit Task:**
- Hover over task card
- Click edit (pencil) icon
- Modify and save

**Delete Task:**
- Hover over task card
- Click delete (trash) icon

**Move Tasks** (Board View):
- Drag task to different column
- Drop to update status

**Filter Tasks:**
- Use search box for keywords
- Click status badges to filter
- Click priority badges to filter
- Click "Clear All" to reset

## 🔌 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/tasks` | Get all tasks |
| POST | `/tasks` | Create new task |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |

### Example: Create Task

**Request:**
```bash
POST /api/tasks
Content-Type: application/json

{
  "title": "Review pull request",
  "description": "Check authentication module",
  "status": "todo",
  "priority": "high",
  "dueDate": "2025-12-04T18:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Review pull request",
    "description": "Check authentication module",
    "status": "todo",
    "priority": "high",
    "dueDate": "2025-12-04T18:00:00.000Z",
    "createdAt": "2025-12-03T10:00:00.000Z",
    "updatedAt": "2025-12-03T10:00:00.000Z"
  }
}
```

For complete API documentation, see [backend/README.md](./backend/README.md)

## 🧪 Testing

### Test Backend API

```bash
# Health check
curl http://localhost:3000/health

# Get all tasks
curl http://localhost:3000/api/tasks

# Create task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Test task", "priority": "high"}'
```

### Test Frontend

1. Open `http://localhost:5173`
2. Create a task manually
3. Refresh page - task should persist
4. Try voice input (allow microphone access)
5. Drag tasks between columns
6. Test filtering and search

## 🎯 Key Design Decisions

### State Management
- **React Query** for server state management with automatic caching
- **React Context API** for UI state (filters, view mode)
- Automatic refetching and cache invalidation

### Voice Parsing
- **Client-side NLP** with regex patterns for instant feedback
- Handles variations in natural language
- Graceful degradation when fields can't be extracted

### API Design
- **RESTful principles** with proper HTTP methods
- Comprehensive error handling
- Input validation on both frontend and backend

### Database
- **MongoDB Atlas** for cloud persistence
- Mongoose ODM for schema validation
- Indexes on frequently queried fields

## 🔒 Security Considerations

1. **Environment Variables** - Sensitive data in `.env` (not committed)
2. **Input Validation** - Zod schemas and Mongoose validation
3. **CORS** - Configured for specific origins
4. **MongoDB Injection** - Mongoose provides protection
5. **Error Handling** - No sensitive data in error messages

## 🐛 Troubleshooting

### Port 5000 Already in Use (macOS)
**Issue:** AirPlay/AirTunes uses port 5000

**Solution:** Backend uses port 3000 instead

### MongoDB Connection Failed
**Issue:** Can't connect to MongoDB Atlas

**Solutions:**
1. Check `MONGODB_URI` in `.env`
2. Verify database user credentials
3. Ensure IP address is whitelisted (0.0.0.0/0)
4. Check network access in MongoDB Atlas dashboard

### Voice Input Not Working
**Issue:** Microphone not responding

**Solutions:**
1. Use Chrome, Edge, or Safari (Firefox not supported)
2. Allow microphone permissions
3. Use HTTPS or localhost
4. Check browser console for errors

### CORS Errors
**Issue:** Frontend can't reach backend

**Solutions:**
1. Verify backend is running on port 3000
2. Check `VITE_API_URL` in frontend `.env`
3. Ensure `FRONTEND_URL` in backend `.env` is correct

### Tasks Not Persisting
**Issue:** Tasks disappear on refresh

**Solutions:**
1. Verify backend is connected to MongoDB
2. Check backend console for database connection
3. Test API endpoints directly with curl
4. Check browser console for API errors

## 🚀 Production Deployment

### Frontend (Vercel/Netlify)
1. Build: `npm run build` in frontend/
2. Deploy `dist/` folder
3. Set environment variable: `VITE_API_URL=<backend-url>`

### Backend (Heroku/Railway/Render)
1. Set environment variables
2. Deploy from `backend/` directory
3. Ensure `NODE_ENV=production`

### Database
- MongoDB Atlas automatically scales
- Configure proper network access for production
- Set up database backups

## 📚 Project Structure Details

### Frontend Components

```
src/components/
├── ui/                    # Base shadcn/ui components
│   ├── button.tsx        # Button component
│   ├── card.tsx          # Card component
│   ├── dialog.tsx        # Modal dialogs
│   ├── input.tsx         # Input fields
│   ├── select.tsx        # Select dropdowns
│   └── ...
└── tasks/                # Task-specific components
    ├── TaskBoard.tsx     # Kanban board view
    ├── TaskCard.tsx      # Individual task card
    ├── TaskForm.tsx      # Create/edit form
    ├── TaskList.tsx      # List view
    ├── TaskFilters.tsx   # Filter sidebar
    ├── VoiceInput.tsx    # Voice recording UI
    ├── VoiceTaskReview.tsx  # Review parsed task
    └── DroppableColumn.tsx  # Drag & drop column
```

### Backend Structure

```
src/
├── config/
│   └── database.js       # MongoDB connection
├── controllers/
│   └── taskController.js # Task CRUD logic
├── middleware/
│   └── errorHandler.js   # Error handling
├── models/
│   └── Task.js           # Mongoose schema
├── routes/
│   └── tasks.js          # API routes
└── server.js             # Express app setup
```

## 🎓 Learning Resources

This project demonstrates:

- Full-stack TypeScript development
- React hooks and Context API
- RESTful API design
- MongoDB database operations
- Web Speech API integration
- Natural language processing
- Drag and drop interactions
- Modern UI/UX patterns

## 🔮 Future Enhancements

- [ ] User authentication (JWT/OAuth)
- [ ] Task attachments and comments
- [ ] Recurring tasks
- [ ] Task categories/tags
- [ ] Dark mode toggle
- [ ] Email notifications
- [ ] Real-time collaboration (WebSockets)
- [ ] Mobile app (React Native)
- [ ] Advanced NLP with AI (OpenAI/Claude)
- [ ] Export tasks (CSV/JSON/PDF)
- [ ] Calendar integration
- [ ] Team workspaces
- [ ] Analytics dashboard
- [ ] Keyboard shortcuts

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## 📄 License

This project is created as part of an SDE assignment for educational purposes.

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful component library
- **MongoDB Atlas** - Cloud database hosting
- **Vercel** - Vite and React ecosystem
- **Express.js** - Web framework

## 📞 Support

For issues or questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review [backend/README.md](./backend/README.md) for backend details
3. Review [frontend/README.md](./frontend/README.md) for frontend details
4. Open an issue on GitHub

---

**Built with ❤️ using React, Node.js, Express, and MongoDB**

Happy Task Tracking! 🎯
