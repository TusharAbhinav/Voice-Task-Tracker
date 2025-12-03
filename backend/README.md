# Voice-Enabled Task Tracker - Backend API

RESTful API backend for the Voice-Enabled Task Tracker application. Built with Node.js, Express, and MongoDB.

## Features

- **RESTful API** - Clean, standard REST endpoints
- **MongoDB Integration** - Persistent data storage with Mongoose ODM
- **CRUD Operations** - Complete Create, Read, Update, Delete functionality
- **Advanced Filtering** - Filter by status, priority, and search
- **Data Validation** - Comprehensive input validation
- **Error Handling** - Centralized error handling middleware
- **CORS Enabled** - Configured for frontend integration
- **Environment Config** - Secure environment variable management

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js v5** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose v9** - MongoDB ODM
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management
- **Morgan** - HTTP request logger
- **Nodemon** - Development auto-restart

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # MongoDB connection configuration
│   ├── controllers/
│   │   └── taskController.js # Task business logic
│   ├── middleware/
│   │   └── errorHandler.js   # Error handling middleware
│   ├── models/
│   │   └── Task.js           # Task Mongoose model
│   ├── routes/
│   │   └── tasks.js          # Task API routes
│   └── server.js             # Main application entry point
├── .env                      # Environment variables (not in git)
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: v6.0 or higher (local or Atlas)

## Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/task-tracker
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/task-tracker

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### 3. Set Up MongoDB

**Option A: Local MongoDB**

1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # macOS
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod

   # Windows
   net start MongoDB
   ```

**Option B: MongoDB Atlas (Cloud)**

1. Create free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

## Running the Application

### Development Mode

Start with auto-reload on file changes:

```bash
npm run dev
```

The server will start at `http://localhost:5000`

### Production Mode

Start without auto-reload:

```bash
npm start
```

## API Documentation

Base URL: `http://localhost:5000/api`

### Health Check

Check if server is running:

**GET** `/health`

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-12-03T12:00:00.000Z"
}
```

### Task Endpoints

#### 1. Get All Tasks

**GET** `/api/tasks`

**Query Parameters:**
- `status` (string, optional) - Filter by status: `todo`, `in_progress`, `done`
- `priority` (string, optional) - Filter by priority: `low`, `medium`, `high`, `urgent`
- `search` (string, optional) - Search in title and description
- `sort` (string, optional) - Sort field (default: `-createdAt`)

**Examples:**
```bash
# Get all tasks
GET /api/tasks

# Filter by status
GET /api/tasks?status=todo

# Multiple filters
GET /api/tasks?status=todo,in_progress&priority=high

# Search
GET /api/tasks?search=review

# Sort by priority
GET /api/tasks?sort=priority
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Review pull request",
      "description": "Review authentication module PR",
      "status": "todo",
      "priority": "high",
      "dueDate": "2025-12-04T18:00:00.000Z",
      "createdAt": "2025-12-03T10:00:00.000Z",
      "updatedAt": "2025-12-03T10:00:00.000Z"
    }
  ]
}
```

#### 2. Get Single Task

**GET** `/api/tasks/:id`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Review pull request",
    "description": "Review authentication module PR",
    "status": "todo",
    "priority": "high",
    "dueDate": "2025-12-04T18:00:00.000Z",
    "createdAt": "2025-12-03T10:00:00.000Z",
    "updatedAt": "2025-12-03T10:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Task not found"
}
```

#### 3. Create Task

**POST** `/api/tasks`

**Request Body:**
```json
{
  "title": "Review pull request",
  "description": "Review authentication module PR",
  "status": "todo",
  "priority": "high",
  "dueDate": "2025-12-04T18:00:00.000Z"
}
```

**Required Fields:**
- `title` (string, max 200 chars)

**Optional Fields:**
- `description` (string, max 1000 chars)
- `status` (string: `todo` | `in_progress` | `done`, default: `todo`)
- `priority` (string: `low` | `medium` | `high` | `urgent`, default: `medium`)
- `dueDate` (ISO date string)

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Review pull request",
    "description": "Review authentication module PR",
    "status": "todo",
    "priority": "high",
    "dueDate": "2025-12-04T18:00:00.000Z",
    "createdAt": "2025-12-03T10:00:00.000Z",
    "updatedAt": "2025-12-03T10:00:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Title is required"
}
```

#### 4. Update Task

**PUT** `/api/tasks/:id`

**Request Body:** (all fields optional)
```json
{
  "title": "Review pull request - Updated",
  "status": "in_progress",
  "priority": "urgent"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Review pull request - Updated",
    "description": "Review authentication module PR",
    "status": "in_progress",
    "priority": "urgent",
    "dueDate": "2025-12-04T18:00:00.000Z",
    "createdAt": "2025-12-03T10:00:00.000Z",
    "updatedAt": "2025-12-03T11:30:00.000Z"
  }
}
```

#### 5. Delete Task

**DELETE** `/api/tasks/:id`

**Success Response (200):**
```json
{
  "success": true,
  "data": {},
  "message": "Task deleted successfully"
}
```

#### 6. Get Task Statistics

**GET** `/api/tasks/stats`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 15,
    "byStatus": [
      { "_id": "todo", "count": 7 },
      { "_id": "in_progress", "count": 5 },
      { "_id": "done", "count": 3 }
    ],
    "byPriority": [
      { "_id": "low", "count": 3 },
      { "_id": "medium", "count": 6 },
      { "_id": "high", "count": 4 },
      { "_id": "urgent", "count": 2 }
    ]
  }
}
```

## Testing the API

### Using cURL

```bash
# Create a task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test task",
    "priority": "high",
    "status": "todo"
  }'

# Get all tasks
curl http://localhost:5000/api/tasks

# Get single task
curl http://localhost:5000/api/tasks/507f1f77bcf86cd799439011

# Update task
curl -X PUT http://localhost:5000/api/tasks/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"status": "done"}'

# Delete task
curl -X DELETE http://localhost:5000/api/tasks/507f1f77bcf86cd799439011
```

### Using Postman

1. Import the API endpoints
2. Set base URL: `http://localhost:5000/api`
3. Test each endpoint with sample data

## Data Model

### Task Schema

```javascript
{
  title: String (required, max 200 chars)
  description: String (optional, max 1000 chars)
  status: Enum ['todo', 'in_progress', 'done'] (default: 'todo')
  priority: Enum ['low', 'medium', 'high', 'urgent'] (default: 'medium')
  dueDate: Date (optional, must be future date)
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-updated)
}
```

### Validation Rules

- **Title**: Required, 1-200 characters
- **Description**: Optional, max 1000 characters
- **Status**: Must be one of: `todo`, `in_progress`, `done`
- **Priority**: Must be one of: `low`, `medium`, `high`, `urgent`
- **Due Date**: Cannot be in the past

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Server Error

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/task-tracker |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## Database Indexes

For optimal query performance, the following indexes are created:

- `status` - For filtering by status
- `priority` - For filtering by priority
- `dueDate` - For sorting by due date
- `createdAt` - For default sorting

## CORS Configuration

CORS is enabled for the frontend URL specified in `.env`:

```javascript
cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
})
```

## Security Considerations

1. **Environment Variables** - Never commit `.env` to version control
2. **Input Validation** - All inputs are validated before processing
3. **MongoDB Injection** - Mongoose provides protection against injection
4. **Error Messages** - Production mode hides sensitive error details

## Troubleshooting

### MongoDB Connection Issues

**Error**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions:**
1. Ensure MongoDB is running: `mongosh` or `mongo`
2. Check MongoDB service status
3. Verify `MONGODB_URI` in `.env`
4. For Atlas, check network access and IP whitelist

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solutions:**
1. Change `PORT` in `.env`
2. Kill process using port 5000:
   ```bash
   # macOS/Linux
   lsof -ti:5000 | xargs kill -9

   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

### CORS Errors

**Error**: `Access-Control-Allow-Origin`

**Solutions:**
1. Verify `FRONTEND_URL` in `.env` matches frontend
2. Check frontend is making requests to correct backend URL
3. Ensure backend is running before frontend

## Integration with Frontend

1. **Update Frontend API Base URL**:
   - Create `.env` in frontend:
     ```env
     VITE_API_URL=http://localhost:5000/api
     ```

2. **Create API Service** (frontend):
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL;

   export const taskAPI = {
     getAll: () => fetch(`${API_URL}/tasks`),
     getOne: (id) => fetch(`${API_URL}/tasks/${id}`),
     create: (data) => fetch(`${API_URL}/tasks`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(data)
     }),
     update: (id, data) => fetch(`${API_URL}/tasks/${id}`, {
       method: 'PUT',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(data)
     }),
     delete: (id) => fetch(`${API_URL}/tasks/${id}`, {
       method: 'DELETE'
     })
   };
   ```

## Future Enhancements

- [ ] User authentication with JWT
- [ ] Rate limiting
- [ ] Request caching
- [ ] File uploads for task attachments
- [ ] WebSocket support for real-time updates
- [ ] API versioning
- [ ] Swagger/OpenAPI documentation
- [ ] Unit and integration tests
- [ ] Docker containerization
- [ ] CI/CD pipeline

## Contributing

1. Follow existing code structure and patterns
2. Add comments for complex logic
3. Test all endpoints before committing
4. Update documentation for API changes

## License

This project is part of an SDE assignment for educational purposes.
