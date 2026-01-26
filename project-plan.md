# Full-Stack Challenge: Marketplace Project Workflow System

## Introduction
This task simulates a real client workflow commonly encountered in the RacoAl Marketplace Projects Division. It is designed to evaluate how you decompose a high-level system into clear roles, flows, APIs, and interfaces. Please focus on correctness, clarity, smooth user experience, and disciplined full-stack execution.

* **Duration:** 3 Days

---

## Objective
Build a role-based project marketplace workflow where projects are created by buyers and executed by problem solvers, with clear state transitions, task management, and delivery submission.

### Evaluation Focus:
* Role-based access control
* Full project lifecycle management
* Clean API design and data flow
* Smooth, animated, and understandable UI states

---

## User Roles & Capabilities

### 1. Admin
* Assign Buyer role to users
* View all users and projects
* No project execution responsibilities

### 2. Buyer
* Create a project
* View incoming requests from problem solvers
* Assign one problem solver to a project
* Review task submissions
* Accept or reject submitted work

### 3. Problem Solver
* Create and manage a profile
* Browse available projects
* Request to work on a project
* **Once assigned:**
    * Create multiple sub-modules / tasks
    * Manage task timelines and metadata
    * Submit completed work as a ZIP file per task

---

## Core Workflow (Must Implement)
1.  **Admin** assigns Buyer role to a user.
2.  **Buyer** creates a project.
3.  **Problem solvers** request to work on the project.
4.  **Buyer** selects one problem solver.
5.  Project becomes **Assigned**.
6.  **Problem Solver:**
    * Creates tasks/sub-modules.
    * Adds metadata (Title, Description, Timeline, Status).
    * Submits ZIP file upon completion.
7.  **Buyer:**
    * Reviews submission.
    * Accepts submission → task marked as completed.

---

## UI / UX Requirements
* Clear visual distinction between roles.
* Step-by-step project lifecycle visualization.
* Smooth animated transitions between states (e.g., Unassigned → Assigned).
* Use animations to explain system state (Framer Motion or GSAP recommended).
* Subtle micro-interactions (hover, loading, success states).

---

## Technical Requirements

### Frontend
* **Framework:** Next.js
* Role-aware routing and UI rendering.
* Clean component architecture and responsive design.

### Backend
* **Framework:** Node.js (Express) or FastAPI.
* RESTful APIs: Auth, Users, Projects, Requests, Tasks, Submissions.
* Secure file upload handling (ZIP only).

### Database
* **Type:** PostgreSQL or MongoDB.
* Clear relationship modeling.

---

## Deliverables
1.  **System Understanding:** Short explanation of role hierarchy and state transitions.
2.  **GitHub Repository:** Public link with a README (setup instructions, API summary, architectural decisions).
3.  **Live Deployment:** (Strongly Preferred) Hosted frontend and backend.

---

## Evaluation Criteria
* Correct role enforcement.
* Logical data modeling and clean API structure.
* Smooth, intentional UI transitions.
* Code quality and readability.

### What Not to Do
* No hardcoded roles or IDs.
* No skipping state transitions.
* No UI without feedback or animation.
* No unclear or undocumented APIs.