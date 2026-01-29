<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</p>

<h1 align="center">Task Colab</h1>

<p align="center">
  <strong>A Modern Role-Based Marketplace Project Workflow System</strong>
</p>

<p align="center">
  <a href="https://task-colab.vercel.app">Live Demo</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-feedback">Feedback</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Live-success?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square" alt="PRs Welcome" />
</p>

---

## Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Project Lifecycle](#-project-lifecycle)
- [Tech Stack](#-tech-stack)
- [User Roles & Workflows](#-user-roles--workflows)
- [Contributing](#-contributing)
- [Feedback](#-feedback)
- [Contact](#-contact)

---

## Overview

**Task Colab** is a comprehensive marketplace platform that connects **Buyers** with skilled **Problem Solvers** to collaborate on projects. The platform features a robust role-based access control system, smooth animated transitions, and a complete project lifecycle management system.

Built with modern technologies including **Next.js 16**, **React 19**, **Express.js**, and **MongoDB**, Task Colab demonstrates best practices in full-stack development with emphasis on user experience, security, and scalability.

### Key Highlights

- **Role-Based Access Control** - Three distinct user roles with specific permissions
- **Complete Project Lifecycle** - From creation to delivery with clear state transitions
- **Real-Time Collaboration** - Seamless interaction between buyers and problem solvers
- **Modern UI/UX** - Smooth animations and intuitive interface
- **Secure Authentication** - JWT-based auth with Google OAuth integration

---

## Live Demo

<p align="center">
  <a href="https://task-colab.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🚀_Visit_Live_Demo-task--colab.vercel.app-4F46E5?style=for-the-badge" alt="Live Demo" />
  </a>
</p>

| Environment | URL |
|-------------|-----|
| **Frontend** | [https://task-colab.vercel.app](https://task-colab.vercel.app) |
| **Backend API** | [https://task-colab-backend.vercel.app](https://task-colab-backend.vercel.app) |

---

## Features

### Authentication & Authorization
- [x] JWT-based secure authentication
- [x] Google OAuth 2.0 integration
- [x] Role-based access control (RBAC)
- [x] Protected routes and API endpoints
- [x] Password visibility toggle
- [x] Persistent login sessions

### User Management
- [x] User registration with role selection
- [x] Profile management with image upload
- [x] Admin user management dashboard
- [x] Role assignment by admin

### Project Management
- [x] Create projects with detailed descriptions
- [x] Budget and timeline specifications
- [x] Skill requirements tagging
- [x] Project status tracking
- [x] File attachments support

### Collaboration Workflow
- [x] Problem solvers can request to work on projects
- [x] Buyers can review and select problem solvers
- [x] Task/sub-module creation within projects
- [x] ZIP file submissions for completed work
- [x] Accept/reject submission workflow

### User Experience
- [x] Smooth animated transitions (Framer Motion)
- [x] Responsive design for all devices
- [x] Dark/Light mode ready components
- [x] Loading states and micro-interactions
- [x] Toast notifications for feedback
- [x] Intuitive navigation

### Dashboard Features
- [x] Role-specific dashboards
- [x] Project statistics and overview
- [x] Recent activity tracking
- [x] Quick action buttons

---

## Project Lifecycle

### Project Lifecycle State Machine

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    OPEN      │────▶│   ASSIGNED   │────▶│  IN_PROGRESS │
│  (Created)   │     │  (Selected)  │     │   (Working)  │
└──────────────┘     └──────────────┘     └──────────────┘
                                                  │
                                                  ▼
                     ┌──────────────┐     ┌──────────────┐
                     │  COMPLETED   │◀────│   REVIEW     │
                     │   (Done)     │     │ (Submitted)  │
                     └──────────────┘     └──────────────┘
```

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.x | React Framework with App Router |
| React | 19.x | UI Library |
| TypeScript | 5.3.x | Type Safety |
| Tailwind CSS | 4.0 | Styling |
| Framer Motion | 12.x | Animations |
| Radix UI | Latest | Accessible Components |
| Lucide React | Latest | Icons |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x | Runtime Environment |
| Express.js | 4.18.x | Web Framework |
| TypeScript | 5.3.x | Type Safety |
| MongoDB | Latest | Database |
| Mongoose | 8.x | ODM |
| Zod | 4.x | Schema Validation |
| JWT | 9.x | Authentication |
| Cloudinary | 2.x | File Storage |

---

## User Roles & Workflows

### Admin
**Capabilities:**
- View all users in the system
- Assign/change user roles
- View all projects (read-only)
- System oversight and management

**Workflow:**
1. Login to admin dashboard
2. Navigate to user management
3. View user list and details
4. Assign roles as needed

---

### Buyer
**Capabilities:**
- Create new projects
- Define project requirements and budget
- Review solver requests
- Assign problem solvers to projects
- Review and accept/reject submissions

**Workflow:**
1. Create a new project with details
2. Wait for problem solver requests
3. Review solver profiles and proposals
4. Select and assign a problem solver
5. Monitor project progress
6. Review submitted work
7. Accept or request revisions

---

### Problem Solver
**Capabilities:**
- Browse available projects
- Request to work on projects
- Create tasks/sub-modules (when assigned)
- Submit completed work as ZIP files
- Track project progress

**Workflow:**
1. Browse open projects
2. Request to work on interesting projects
3. Wait for buyer approval
4. Once assigned, create task breakdown
5. Work on tasks and update status
6. Submit completed work
7. Address any revision requests

---

## Contributing

Contributions are welcome and greatly appreciated! Here's how you can contribute:

1. **Fork the Project**
   ```bash
   git clone https://github.com/saminul-amin/task-colab.git
   ```

2. **Create your Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Commit your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

4. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features when applicable
- Update documentation as needed
- Be respectful and constructive in discussions

---

## Feedback

Your feedback is incredibly valuable to us! We're constantly working to improve Task Colab and would love to hear from you.

### How to Provide Feedback

| Channel | Link | Best For |
|---------|------|----------|
| **GitHub Issues** | [Create Issue](https://github.com/yourusername/task-colab/issues/new) | Bug reports, feature requests |
| **GitHub Discussions** | [Start Discussion](https://github.com/yourusername/task-colab/discussions) | General feedback, questions |
| **Email** | [your.email@example.com](mailto:your.email@example.com) | Private feedback, collaboration |

### Reporting Bugs

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser/device information

### Feature Requests

We welcome new ideas! When suggesting features:
- Describe the problem it solves
- Explain your proposed solution
- Share any alternatives you've considered

### Show Your Support

If you find Task Colab helpful, please consider:
- Giving it a ⭐ star on GitHub
- Sharing it with others
- Contributing to the project

---

## Contact

<p align="center">
  <a href="https://github.com/saminul-amin">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://www.linkedin.com/in/md-saminul-amin/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="mailto:saminul.amin@gmail.com">
    <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" />
  </a>
</p>

---

<p align="center">
  <strong>Built with ❤️ by Md. Saminul Amin</strong>
</p>

<p align="center">
  <a href="#-task-colab">⬆️ Back to Top</a>
</p>
