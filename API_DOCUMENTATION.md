# API Routes Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "JOB_SEEKER", // or "RECRUITER"
  "phone": "+1234567890",
  "companyName": "Tech Corp" // Required if role is RECRUITER
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "JOB_SEEKER",
    "isApproved": false
  }
}
```

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer {token}
```

### Update Profile
**PUT** `/auth/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+1234567890",
  "bio": "Software Engineer",
  "skills": ["JavaScript", "React", "Node.js"],
  "experience": 3,
  "location": "New York, USA"
}
```

### Upload Profile Picture
**POST** `/auth/upload-picture`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**
- image: File

### Upload Resume
**POST** `/auth/upload-resume`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**
- resume: File (PDF)

### Change Password
**PUT** `/auth/change-password`

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

---

## Job Endpoints

### Get All Jobs (Public)
**GET** `/jobs`

**Query Parameters:**
- keyword: string (optional)
- location: string (optional)
- jobType: string (optional)
- experienceRequired: number (optional)
- page: number (default: 1)
- limit: number (default: 10)

**Response:**
```json
{
  "success": true,
  "jobs": [...],
  "totalPages": 5,
  "currentPage": 1,
  "total": 50
}
```

### Get Single Job
**GET** `/jobs/:id`

### Create Job (Recruiter Only)
**POST** `/jobs`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "Senior React Developer",
  "description": "We are looking for...",
  "skillsRequired": ["React", "TypeScript", "Node.js"],
  "location": "San Francisco, CA",
  "experienceRequired": 5,
  "jobType": "Full-time",
  "salaryRange": {
    "min": 120000,
    "max": 150000,
    "currency": "USD"
  },
  "applicationDeadline": "2024-12-31",
  "numberOfOpenings": 2
}
```

### Update Job (Recruiter Only)
**PUT** `/jobs/:id`

### Delete Job (Recruiter/Admin)
**DELETE** `/jobs/:id`

### Get My Jobs (Recruiter)
**GET** `/jobs/recruiter/my-jobs`

### Apply for Job (Job Seeker)
**POST** `/jobs/:id/apply`

**Request Body:**
```json
{
  "coverLetter": "I am very interested in..."
}
```

### Get Job Applications (Recruiter)
**GET** `/jobs/:id/applications`

**Response:**
```json
{
  "success": true,
  "count": 10,
  "applications": [
    {
      "_id": "app_id",
      "jobSeekerId": {
        "name": "John Doe",
        "email": "john@example.com",
        "resume": "resume_url",
        "skills": ["React", "Node.js"]
      },
      "status": "Applied",
      "appliedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Update Application Status (Recruiter)
**PUT** `/jobs/applications/:id/status`

**Request Body:**
```json
{
  "status": "Shortlisted", // or "Interview", "Rejected", "Hired"
  "recruiterNotes": "Strong candidate with excellent skills"
}
```

### Get My Applications (Job Seeker)
**GET** `/jobs/my-applications`

---

## Admin Endpoints

### Get All Users
**GET** `/admin/users`

**Query Parameters:**
- role: string (optional)
- page: number
- limit: number

### Get Pending Recruiters
**GET** `/admin/recruiters/pending`

### Approve/Reject Recruiter
**PUT** `/admin/recruiters/:id/approve`

**Request Body:**
```json
{
  "isApproved": true
}
```

### Delete User
**DELETE** `/admin/users/:id`

### Toggle User Status
**PUT** `/admin/users/:id/toggle-active`

### Get Analytics
**GET** `/admin/analytics`

**Response:**
```json
{
  "success": true,
  "analytics": {
    "users": {
      "total": 150,
      "jobSeekers": 100,
      "recruiters": 45,
      "approvedRecruiters": 40,
      "pendingRecruiters": 5
    },
    "jobs": {
      "total": 75,
      "active": 60,
      "inactive": 15
    },
    "applications": {
      "total": 500,
      "byStatus": [...]
    }
  }
}
```

### Get All Jobs (Admin View)
**GET** `/admin/jobs`

---

## Post Endpoints (Feed)

### Get All Posts
**GET** `/posts`

**Query Parameters:**
- page: number (default: 1)
- limit: number (default: 10)

### Create Post
**POST** `/posts`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**
- content: string
- images: File[] (optional, max 5)

### Get Single Post
**GET** `/posts/:id`

### Update Post
**PUT** `/posts/:id`

### Delete Post
**DELETE** `/posts/:id`

### Toggle Like
**POST** `/posts/:id/like`

### Add Comment
**POST** `/posts/:id/comments`

**Request Body:**
```json
{
  "content": "Great post!"
}
```

### Get Comments
**GET** `/posts/:id/comments`

### Delete Comment
**DELETE** `/posts/comments/:id`

### Get User Posts
**GET** `/posts/user/:userId`

---

## Resume Endpoints

### Create/Update Resume
**POST** `/resumes`

**Request Body:**
```json
{
  "templateId": "template1",
  "personalInfo": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "location": "New York, USA",
    "linkedIn": "linkedin.com/in/johndoe",
    "summary": "Experienced software engineer..."
  },
  "education": [...],
  "experience": [...],
  "skills": [...],
  "projects": [...],
  "certifications": [...]
}
```

### Get My Resume
**GET** `/resumes/my-resume`

### Get Resume by ID
**GET** `/resumes/:id`

### Delete Resume
**DELETE** `/resumes/:id`

### Upload Resume PDF
**POST** `/resumes/upload-pdf`

**Form Data:**
- pdf: File

### Change Template
**PUT** `/resumes/change-template`

**Request Body:**
```json
{
  "templateId": "template2"
}
```

---

## ATS Endpoints

### Scan Resume
**POST** `/ats/scan`

**Request Body:**
```json
{
  "resumeText": "Full resume content as text...",
  "jobDescription": "Job description text..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Resume scanned successfully",
  "result": {
    "score": 75,
    "analysis": {
      "matchedKeywords": ["JavaScript", "React", "Node.js"],
      "missingKeywords": ["TypeScript", "AWS"],
      "skillsMatch": 80,
      "experienceMatch": 70,
      "educationMatch": 100,
      "formatScore": 85
    },
    "suggestions": [
      "Add more relevant technical skills",
      "Improve keyword match..."
    ]
  }
}
```

### Get My Results
**GET** `/ats/my-results`

### Get Result by ID
**GET** `/ats/:id`

### Delete Result
**DELETE** `/ats/:id`

### Analyze Keywords
**POST** `/ats/analyze-keywords`

**Request Body:**
```json
{
  "text": "Text to analyze for keywords..."
}
```

---

## Error Responses

All endpoints may return error responses in this format:

```json
{
  "success": false,
  "message": "Error message description"
}
```

**Common HTTP Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
