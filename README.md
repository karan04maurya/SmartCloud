# SmartCloud

**"Your Study. Your Files. Your Cloud."**

SmartCloud is a modern cloud-based student file management and learning assistant platform. It allows students to securely store, manage, organize, search, and share their academic resources.

## Features
- **Cloud Storage:** Securely upload and manage academic files (Notes, PDFs, PPTs, Assignments).
- **Smart Search:** Global search by file name, subject, description, or type.
- **File Sharing:** Generate secure, expiring shareable links for files.
- **Analytics Dashboard:** Visual insights into file distribution, storage usage, and activity.
- **AI Study Assistant:** A built-in chat interface to interact with an AI for learning and query resolution.
- **Admin Panel:** Complete oversight for administrators to manage users, files, subjects, and announcements.

## Tech Stack
- **Frontend:** React.js, Vite, Tailwind CSS, Framer Motion, Chart.js
- **Backend:** Node.js, Express.js, REST API
- **Database:** MySQL
- **Cloud Storage:** Firebase Storage
- **Authentication:** JWT (JSON Web Tokens)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL Server

### Database Setup
1. Create a MySQL database and import the `database.sql` file located in the root directory:
   ```bash
   mysql -u root -p < database.sql
   ```

### Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the `backend` folder by copying the `.env.example` from the root directory.
   - Update the database and JWT credentials.
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## License
Copyright 2026 SmartCloud
