# 📋 Celebal Task Management System

[![License](<img width="1894" height="908" alt="image" src="https://github.com/user-attachments/assets/a547753e-ec69-41a9-9cca-07381f8913f1" />)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green.svg)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express-4.18+-lightgrey.svg)](https://expressjs.com)

A full-stack task management system built with the **MERN stack** during the **Celebal Technologies** internship program. This application provides a comprehensive solution for managing tasks, projects, and team productivity with a modern, responsive interface.

## 🌟 Features

### Core Functionality
- ✅ **Task Management** - Complete CRUD operations for tasks
- 📊 **Dashboard Analytics** - Visual insights with charts and statistics
- 📅 **Calendar Integration** - Calendar view for task scheduling
- 👥 **User Authentication** - Secure login/registration with JWT
- 🎯 **Priority & Status** - Task prioritization and status tracking
- 🔍 **Search & Filter** - Advanced task filtering capabilities

### Advanced Features
- 📈 **Productivity Charts** - Data visualization with Chart.js
- 🏷️ **Task Categories** - Organize tasks by projects/categories
- 📱 **Responsive Design** - Mobile-first responsive interface
- 🌙 **Theme Toggle** - Light/Dark mode support
- 🔔 **Real-time Updates** - Live task updates
- 📊 **Progress Tracking** - Visual progress indicators

## 🛠️ Technology Stack

### Frontend
- **React 18+** - Modern UI library with hooks
- **JavaScript (ES6+)** - Latest JavaScript features
- **CSS3** - Modern styling with Flexbox/Grid
- **Chart.js** - Data visualization
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment configuration

## 📦 Installation & Setup

### Prerequisites
```bash
Node.js 16+ 
npm or yarn
MongoDB (local or Atlas)
Git
```

### Quick Start

1. **Clone the Repository**
   ```bash
   git clone https://github.com/harsheel55/celebal_task_management_system.git
   cd celebal_task_management_system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create `.env` file in `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/task_management
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

5. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas connection string
   ```

6. **Run the Application**
   
   **Terminal 1 (Backend):**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Terminal 2 (Frontend):**
   ```bash
   cd frontend
   npm start
   ```

7. **Access the Application**
   ```
   Frontend: http://localhost:3000
   Backend API: http://localhost:5000
   ```

## 📁 Project Structure

```
celebal_task_management_system/
│
├── frontend/                          # React Frontend
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── api/                      # API service functions
│   │   ├── components/               # Reusable React components
│   │   │   ├── dashboard/
│   │   │   │   ├── Calendar.css
│   │   │   │   ├── DashOverview.jsx
│   │   │   │   ├── ProductivityChart.jsx
│   │   │   │   ├── StatCard.jsx
│   │   │   │   ├── TaskModal.jsx
│   │   │   │   └── TaskList.jsx
│   │   │   ├── Aurora.jsx            # UI Effects
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── context/                  # React Context
│   │   ├── pages/                    # Page components
│   │   │   ├── AllTasks.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── ResetPassword.jsx
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── logo.svg
│   │   ├── reportWebVitals.js
│   │   └── setupTests.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                           # Node.js Backend
│   ├── config/                       # Configuration files
│   ├── controllers/                  # Route controllers
│   │   └── middleware/               # Custom middleware
│   ├── models/                       # MongoDB models
│   ├── node_modules/                 # Dependencies
│   ├── routes/                       # API routes
│   ├── utils/                        # Utility functions
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── README.md
│   ├── server.js                     # Main server file
│   └── tailwind.config.js
│
├── .gitignore
└── README.md                         # This file
```

## 🚀 Usage Guide

### Getting Started

1. **Register Account**: Create a new account on the registration page
2. **Login**: Sign in with your credentials
3. **Dashboard**: View your task overview and analytics
4. **Create Tasks**: Use the task modal to add new tasks
5. **Manage Tasks**: Edit, update, or delete tasks as needed

### Key Features

#### Dashboard
- **Overview Statistics**: Total tasks, completed, pending, overdue
- **Productivity Chart**: Visual representation of task completion over time
- **Recent Tasks**: Quick access to recently created/modified tasks
- **Calendar View**: Monthly calendar with task indicators

#### Task Management
- **Create Task**: Title, description, priority, due date, category
- **Task List**: Filterable and searchable task list
- **Status Updates**: Mark tasks as complete/incomplete
- **Task Categories**: Organize tasks by projects or categories

#### User Features
- **Profile Management**: Update user information
- **Theme Toggle**: Switch between light and dark themes
- **Responsive Design**: Works on all device sizes

## 🔧 API Documentation

### Authentication Endpoints
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
GET  /api/auth/profile     # Get user profile
PUT  /api/auth/profile     # Update user profile
POST /api/auth/forgot      # Forgot password
POST /api/auth/reset       # Reset password
```

### Task Endpoints
```
GET    /api/tasks          # Get all tasks
POST   /api/tasks          # Create new task
GET    /api/tasks/:id      # Get specific task
PUT    /api/tasks/:id      # Update task
DELETE /api/tasks/:id      # Delete task
GET    /api/tasks/stats    # Get task statistics
```

### Request/Response Examples

**Create Task:**
```json
POST /api/tasks
{
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation",
  "priority": "high",
  "dueDate": "2024-12-31",
  "category": "Work",
  "status": "pending"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64a7b8c9d1234567890abcde",
    "title": "Complete project documentation",
    "description": "Write comprehensive documentation",
    "priority": "high",
    "dueDate": "2024-12-31T00:00:00.000Z",
    "category": "Work",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test
```

### Backend Testing
```bash
cd backend
npm test
```

## 📊 Features Showcase

### Dashboard Analytics
- Real-time task statistics
- Productivity charts with Chart.js
- Progress tracking and completion rates
- Calendar integration for deadline management

### Task Management
- Intuitive task creation and editing
- Priority-based task organization
- Advanced filtering and search capabilities
- Drag-and-drop functionality (if implemented)

### User Experience
- Modern, responsive UI design
- Dark/Light theme toggle
- Smooth animations and transitions
- Mobile-optimized interface

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Controlled cross-origin requests
- **Environment Variables**: Sensitive data protection

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the build folder
```

### Backend Deployment (Heroku/Railway)
```bash
cd backend
# Set environment variables
# Deploy to your preferred platform
```

### MongoDB Atlas
- Set up MongoDB Atlas cluster
- Update connection string in environment variables
- Configure network access and database users

## 🛣️ Roadmap

- [ ] **Mobile App**: React Native mobile application
- [ ] **Real-time Collaboration**: WebSocket integration
- [ ] **File Attachments**: Task file upload functionality
- [ ] **Team Management**: Multi-user team features
- [ ] **Time Tracking**: Built-in time tracking tools
- [ ] **Integration**: Third-party app integrations (Slack, Google Calendar)
- [ ] **Advanced Analytics**: Detailed productivity insights
- [ ] **Offline Support**: PWA capabilities

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Write meaningful commit messages
- Add comments for complex functionality
- Test your changes thoroughly
- Update documentation as needed

## 🐛 Known Issues

- Large task lists may impact performance
- Calendar view needs optimization for mobile devices
- Email notifications require SMTP configuration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Celebal Technologies** for the internship opportunity and guidance
- **MERN Stack Community** for excellent documentation and resources
- **Chart.js** for beautiful data visualization components
- **MongoDB** for the flexible NoSQL database solution
- **React Community** for the powerful frontend framework

## 📞 Contact & Support

**Developer**: Harsheel  
**GitHub**: [@harsheel55](https://github.com/harsheel55)  
**Project Link**: [https://github.com/harsheel55/celebal_task_management_system](https://github.com/harsheel55/celebal_task_management_system)

For support or queries:
- Open an issue on GitHub
- Contact through Celebal Technologies mentorship program

---

⭐ **If you found this project helpful, please give it a star on GitHub!**

---

*Built with ❤️ during the Celebal Technologies Summer Internship Program 2024*
