# Job Portal - Full Stack MERN Application

A comprehensive job portal application with three user panels (Admin, Recruiter, Job Seeker) featuring ATS resume scanning, social feed, and complete job application management.

## 🚀 Features

### Admin Panel
- Approve/reject recruiter registrations
- Manage all users (view, deactivate, delete)
- View and delete jobs
- Analytics dashboard (users, jobs, applications)
- System-wide monitoring

### Recruiter Panel
- Company profile management
- Create, edit, and delete job postings
- View job applications
- Update application status (Applied, Shortlisted, Interview, Rejected, Hired)
- Add recruiter notes to applications
- View applicant resumes and profiles

### Job Seeker Panel
- Profile creation and management
- Resume upload (PDF)
- Browse and search jobs
- Apply for jobs with cover letter
- Track application status
- Resume builder (Phase 2)
- ATS resume checker (Phase 2)
- Professional feed (Phase 1)

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer + Cloudinary
- **Validation**: express-validator

### Frontend
- **Library**: React 18
- **Routing**: React Router v6
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: React Icons

## 📁 Project Structure

```
job-portal/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   ├── adminController.js
│   │   ├── postController.js
│   │   ├── resumeController.js
│   │   └── atsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   ├── Like.js
│   │   ├── Resume.js
│   │   └── ATSResult.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── postRoutes.js
│   │   ├── resumeRoutes.js
│   │   └── atsRoutes.js
│   ├── utils/
│   │   ├── atsScoreCalculator.js
│   │   └── seedAdmin.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Layout/
    │   │   │   ├── Navbar.jsx
    │   │   │   └── Sidebar.jsx
    │   │   ├── Feed/
    │   │   ├── Resume/
    │   │   ├── ATS/
    │   │   └── Common/
    │   ├── pages/
    │   │   ├── Auth/
    │   │   ├── Dashboard/
    │   │   ├── FeedPage.jsx
    │   │   ├── ResumePage.jsx
    │   │   └── ATSPage.jsx
    │   ├── redux/
    │   │   ├── store.js
    │   │   └── slices/
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── jobService.js
    │   │   ├── feedService.js
    │   │   ├── resumeService.js
    │   │   └── atsService.js
    │   ├── utils/
    │   │   ├── constants.js
    │   │   └── atsUtils.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    └── vite.config.js
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for file uploads)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173

ADMIN_EMAIL=admin@jobportal.com
ADMIN_PASSWORD=Admin@123
```

5. Seed admin user:
```bash
npm run seed
```

6. Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🔐 Default Admin Credentials

- **Email**: admin@jobportal.com
- **Password**: Admin@123

⚠️ **Important**: Change the admin password immediately after first login!

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
GET    /api/auth/me                - Get current user
PUT    /api/auth/profile           - Update profile
POST   /api/auth/upload-picture    - Upload profile picture
POST   /api/auth/upload-resume     - Upload resume
PUT    /api/auth/change-password   - Change password
```

### Jobs
```
GET    /api/jobs                   - Get all jobs (with filters)
GET    /api/jobs/:id               - Get single job
POST   /api/jobs                   - Create job (Recruiter)
PUT    /api/jobs/:id               - Update job (Recruiter)
DELETE /api/jobs/:id               - Delete job (Recruiter/Admin)
GET    /api/jobs/recruiter/my-jobs - Get recruiter's jobs
POST   /api/jobs/:id/apply         - Apply for job (Job Seeker)
GET    /api/jobs/:id/applications  - Get job applications (Recruiter)
PUT    /api/jobs/applications/:id/status - Update application status
GET    /api/jobs/my-applications   - Get user's applications
```

### Admin
```
GET    /api/admin/users            - Get all users
GET    /api/admin/recruiters/pending - Get pending recruiters
PUT    /api/admin/recruiters/:id/approve - Approve/reject recruiter
DELETE /api/admin/users/:id        - Delete user
PUT    /api/admin/users/:id/toggle-active - Toggle user status
GET    /api/admin/analytics        - Get analytics
GET    /api/admin/jobs             - Get all jobs (admin view)
```

### Posts (Feed)
```
GET    /api/posts                  - Get all posts
POST   /api/posts                  - Create post
GET    /api/posts/:id              - Get single post
PUT    /api/posts/:id              - Update post
DELETE /api/posts/:id              - Delete post
POST   /api/posts/:id/like         - Toggle like
POST   /api/posts/:id/comments     - Add comment
GET    /api/posts/:id/comments     - Get comments
DELETE /api/posts/comments/:id     - Delete comment
GET    /api/posts/user/:userId     - Get user's posts
```

### Resume
```
POST   /api/resumes                - Create/update resume
GET    /api/resumes/my-resume      - Get user's resume
GET    /api/resumes/:id            - Get resume by ID
DELETE /api/resumes/:id            - Delete resume
POST   /api/resumes/upload-pdf     - Upload resume PDF
PUT    /api/resumes/change-template - Change template
```

### ATS
```
POST   /api/ats/scan               - Scan resume
GET    /api/ats/my-results         - Get user's results
GET    /api/ats/:id                - Get result by ID
DELETE /api/ats/:id                - Delete result
POST   /api/ats/analyze-keywords   - Analyze keywords
```

## 🔑 User Roles & Permissions

### ADMIN
- Full system access
- User management
- Recruiter approval
- Job moderation
- Analytics access

### RECRUITER
- Must be approved by admin
- Create/edit/delete own jobs
- View and manage applications
- Update application status
- Add recruiter notes

### JOB_SEEKER
- Browse and search jobs
- Apply for jobs
- Track applications
- Upload resume
- Build resume (Phase 2)
- Check ATS score (Phase 2)

## 📝 Data Models

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum [ADMIN, RECRUITER, JOB_SEEKER],
  phone: String,
  profilePicture: String,
  resume: String,
  skills: [String],
  experience: Number,
  bio: String,
  companyName: String,
  companyWebsite: String,
  companyDescription: String,
  companyLogo: String,
  isApproved: Boolean,
  location: String,
  isActive: Boolean,
  timestamps
}
```

### Job Schema
```javascript
{
  title: String,
  description: String,
  skillsRequired: [String],
  location: String,
  experienceRequired: Number,
  jobType: Enum,
  salaryRange: { min, max, currency },
  recruiterId: ObjectId,
  companyName: String,
  companyLogo: String,
  applicationDeadline: Date,
  numberOfOpenings: Number,
  isActive: Boolean,
  applicationsCount: Number,
  timestamps
}
```

### Application Schema
```javascript
{
  jobId: ObjectId,
  jobSeekerId: ObjectId,
  resumeUrl: String,
  coverLetter: String,
  status: Enum [Applied, Shortlisted, Rejected, Interview, Hired],
  recruiterNotes: String,
  appliedAt: Date,
  statusHistory: [{ status, changedAt, changedBy }],
  timestamps
}
```

## 🧪 Testing

### Test User Accounts

1. **Admin**
   - Email: admin@jobportal.com
   - Password: Admin@123

2. **Recruiter** (Create via registration, needs admin approval)
   - Role: RECRUITER
   - Company details required

3. **Job Seeker** (Create via registration)
   - Role: JOB_SEEKER
   - Can apply immediately

## 🚀 Deployment

### Backend Deployment (Railway/Render/Heroku)

1. Set environment variables in hosting platform
2. Connect MongoDB Atlas
3. Deploy from GitHub repository

### Frontend Deployment (Vercel/Netlify)

1. Build the project:
```bash
npm run build
```

2. Deploy `dist` folder
3. Set environment variable: `VITE_API_URL`

## 📦 Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb://...
JWT_SECRET=secret_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@jobportal.com
ADMIN_PASSWORD=Admin@123
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Protected routes
- File upload validation
- Input sanitization
- Error handling middleware

## 📄 License

MIT License

## 👥 Support

For issues and questions, please create an issue in the repository.

---

**Happy Coding! 🎉**
