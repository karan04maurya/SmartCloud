# Software Requirements Specification (SRS) for SmartCloud

## 1. Introduction
### 1.1 Purpose
The purpose of this document is to outline the software requirements for SmartCloud, a modern, cloud-based student file management and learning assistant platform. It is designed to help developers, designers, and stakeholders understand the scope, features, and technical constraints of the project.

### 1.2 Document Conventions
This document follows standard IEEE conventions for SRS documents. Priority levels (High, Medium, Low) are used to indicate the importance of each requirement.

### 1.3 Intended Audience and Reading Suggestions
This document is intended for:
- Developers: To guide the implementation of backend APIs, database schemas, and frontend UI.
- Administrators: To understand the capabilities of the administrative dashboard.
- Users (Students): To understand the features provided by the platform.

### 1.4 Product Scope
SmartCloud aims to be a unified platform for students to securely store, manage, organize, search, and share academic resources. Additionally, it integrates an AI-powered study assistant to help students learn and resolve queries effectively. It replaces fragmented cloud storage and note-taking apps by combining storage, analytics, and an AI learning assistant into a single cohesive platform.

---

## 2. Overall Description
### 2.1 Product Perspective
SmartCloud operates as a standalone web application. It relies on Firebase for cloud file storage and MySQL for structured relational data (users, metadata, logs). It features a responsive frontend built with React.js and a scalable backend built with Node.js and Express.js.

### 2.2 Product Functions
- **User Authentication:** Registration, login, and JWT-based session management for Students and Admins.
- **File Management:** Upload, rename, delete (with recycle bin), and organize academic files (Notes, PDFs, PPTs).
- **Smart Search:** Global search across file names, subjects, descriptions, and file types.
- **Secure File Sharing:** Generation of time-limited, secure shareable links for files.
- **AI Study Assistant:** Chatbot interface for answering academic queries and summarizing content.
- **Analytics Dashboard:** Visual representation of storage usage, file distributions, and user activity.
- **Admin Management:** Management of users, files, subjects, and platform-wide announcements.

### 2.3 User Classes and Characteristics
- **Student User:** Needs to upload, organize, and share files. Expects a seamless, visually appealing UI and rapid AI responses.
- **Administrator:** Needs to monitor platform health, user activity, and manage platform data (subjects, user access, announcements). Expects robust control features.

### 2.4 Operating Environment
- **Frontend:** Modern web browsers (Chrome, Firefox, Safari, Edge).
- **Backend:** Node.js environment (v18+).
- **Database:** MySQL Server.
- **Cloud Infrastructure:** Firebase (Storage).

---

## 3. System Features

### 3.1 Authentication & Authorization
- **Description:** Secure login and role-based access control.
- **Functional Requirements:**
  - System must allow users to register with Email, Full Name, Student ID, College, and Course.
  - System must support 'student' and 'admin' roles.
  - System must secure endpoints using JWT.

### 3.2 File Storage & Management
- **Description:** Core file operations tied to user accounts and subjects.
- **Functional Requirements:**
  - System must allow file uploads to Firebase Storage.
  - System must store file metadata (URL, type, size, subject, description) in MySQL.
  - System must implement a soft-delete mechanism (Recycle Bin).

### 3.3 File Sharing
- **Description:** Sharing files with external or internal users.
- **Functional Requirements:**
  - System must generate unique share tokens for files.
  - System must support expiration dates for shareable links.
  - System must allow users to revoke active share links.

### 3.4 AI Study Assistant
- **Description:** Integrated conversational AI to aid in learning.
- **Functional Requirements:**
  - System must provide a chat interface within the application.
  - System must process user queries and return AI-generated responses contextually relevant to academic study.

### 3.5 Admin Dashboard
- **Description:** Centralized control for system administrators.
- **Functional Requirements:**
  - Admin must be able to view overall activity logs.
  - Admin must be able to manage subject categories.
  - Admin must be able to broadcast announcements to all users.

---

## 4. Non-Functional Requirements

### 4.1 Performance Requirements
- **Response Time:** API responses (excluding AI and large file uploads) should complete within 300ms.
- **Capacity:** The system must handle up to 5,000 concurrent users without significant performance degradation.

### 4.2 Security Requirements
- **Data Protection:** Passwords must be hashed (e.g., using bcrypt) before storage.
- **Access Control:** Files in Firebase Storage must be secured; only authenticated users or users with a valid share token can access files.

### 4.3 Software Quality Attributes
- **Usability:** The interface must be responsive and accessible, leveraging Tailwind CSS and Framer Motion for smooth animations and aesthetics.
- **Maintainability:** Code must be modular, adhering to standard MVC (Model-View-Controller) architecture patterns in the backend and component-based architecture in the frontend.

---

## 5. System Architecture
- **Client Tier:** React.js + Vite application handling UI and state.
- **Application Tier:** Node.js + Express.js handling business logic, authentication, database transactions, and integration with the AI service.
- **Data Tier:** MySQL database for relational mapping (Users, Subjects, Files, Logs).
- **Cloud Tier:** Firebase Storage for hosting raw binary files securely.
