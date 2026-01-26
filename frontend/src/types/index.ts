export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "buyer" | "problem_solver";
  createdAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: "open" | "assigned" | "in_progress" | "completed";
  buyerId: string;
  assignedTo?: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "submitted" | "accepted" | "rejected";
  timeline: string;
  createdAt: Date;
}
