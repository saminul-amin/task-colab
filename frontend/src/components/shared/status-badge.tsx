"use client";

import { Badge } from "@/components/ui/badge";
import {
  ProjectStatus,
  TaskStatus,
  RequestStatus,
  SubmissionStatus,
  PROJECT_STATUS_LABELS,
  TASK_STATUS_LABELS,
  REQUEST_STATUS_LABELS,
  SUBMISSION_STATUS_LABELS,
} from "@/types";

type StatusType = ProjectStatus | TaskStatus | RequestStatus | SubmissionStatus;

interface StatusBadgeProps {
  status: StatusType;
  type: "project" | "task" | "request" | "submission";
}

const statusColors: Record<StatusType, "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"> = {
  open: "info",
  assigned: "warning",
  in_progress: "default",
  completed: "success",
  cancelled: "destructive",
  todo: "secondary",
  review: "warning",
  pending: "warning",
  accepted: "success",
  rejected: "destructive",
  withdrawn: "secondary",
  revision_requested: "warning",
};

const labelMap = {
  project: PROJECT_STATUS_LABELS,
  task: TASK_STATUS_LABELS,
  request: REQUEST_STATUS_LABELS,
  submission: SUBMISSION_STATUS_LABELS,
};

export function StatusBadge({ status, type }: StatusBadgeProps) {
  const labels = labelMap[type] as Record<string, string>;
  const label = labels[status] || status;
  const variant = statusColors[status] || "secondary";

  return <Badge variant={variant}>{label}</Badge>;
}
