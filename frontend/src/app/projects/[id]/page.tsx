"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { projectService } from "@/services/project.service";
import { requestService } from "@/services/request.service";
import { taskService } from "@/services/task.service";
import { submissionService } from "@/services/submission.service";
import { useToast } from "@/hooks/use-toast";
import {
  Project,
  Request,
  Task,
  Submission,
  User,
  PROJECT_CATEGORY_LABELS,
  PROJECT_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  TASK_PRIORITY_LABELS,
  TaskStatus,
  TaskPriority,
} from "@/types";
import { ROLES } from "@/lib/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLoader } from "@/components/shared/loading-spinner";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/animated-containers";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  FileText,
  Users,
  Plus,
  Loader2,
  Upload,
  Download,
  Send,
  UserCheck,
  XCircle,
  ListTodo,
  PlayCircle,
  Eye as EyeIcon,
} from "lucide-react";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = use(params);
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [project, setProject] = useState<Project | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [coverLetter, setCoverLetter] = useState("");
  const [proposedBudget, setProposedBudget] = useState("");
  const [proposedTimeline, setProposedTimeline] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState<TaskPriority>("medium");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskEstimatedHours, setTaskEstimatedHours] = useState("");
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submissionDescription, setSubmissionDescription] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && id) {
      fetchProjectData();
    }
  }, [isAuthenticated, id]);

  const fetchProjectData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const projectRes = await projectService.getProjectById(id);
      if (!projectRes.success || !projectRes.data) {
        setError(projectRes.message || "Project not found");
        return;
      }
      setProject(projectRes.data);

      if (user?.role === ROLES.BUYER || user?.role === ROLES.ADMIN) {
        const requestsRes = await requestService.getProjectRequests(id);
        if (requestsRes.success && requestsRes.data) {
          setRequests(requestsRes.data);
        }
      }

      if (projectRes.data.status !== "open") {
        const tasksRes = await taskService.getProjectTasks(id);
        if (tasksRes.success && tasksRes.data) {
          setTasks(tasksRes.data);
        }

        const submissionsRes = await submissionService.getProjectSubmissions(id);
        if (submissionsRes.success && submissionsRes.data) {
          setSubmissions(submissionsRes.data);
        }
      }
    } catch {
      setError("An error occurred while fetching project data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    if (!coverLetter.trim()) return;

    try {
      setIsSubmitting(true);
      const response = await requestService.createRequest({
        projectId: id,
        coverLetter: coverLetter.trim(),
        proposedBudget: proposedBudget ? parseFloat(proposedBudget) : undefined,
        proposedTimeline: proposedTimeline ? parseInt(proposedTimeline) : undefined,
      });

      if (response.success) {
        toast({
          title: "Application Submitted",
          description: "Your application has been submitted successfully.",
          variant: "success",
        });
        setIsApplyDialogOpen(false);
        setCoverLetter("");
        setProposedBudget("");
        setProposedTimeline("");

        router.push("/projects/my-work");
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to submit application.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const response = await requestService.acceptRequest(requestId);
      if (response.success) {
        toast({
          title: "Request Accepted",
          description: "The problem solver has been assigned to this project.",
          variant: "success",
        });
        fetchProjectData();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to accept request.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const response = await requestService.rejectRequest(requestId);
      if (response.success) {
        toast({
          title: "Request Rejected",
          description: "The application has been rejected.",
        });
        setRequests(requests.map((r) =>
          r._id === requestId ? { ...r, status: "rejected" } : r
        ));
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to reject request.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateTask = async () => {
    if (!taskTitle.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a task title.",
        variant: "destructive",
      });
      return;
    }
    if (taskTitle.trim().length < 3) {
      toast({
        title: "Title Too Short",
        description: "Task title must be at least 3 characters.",
        variant: "destructive",
      });
      return;
    }
    if (!taskDescription.trim() || taskDescription.trim().length < 10) {
      toast({
        title: "Description Required",
        description: "Please enter a description (at least 10 characters).",
        variant: "destructive",
      });
      return;
    }
    if (!taskDueDate) {
      toast({
        title: "Due Date Required",
        description: "Please select a due date for the task.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await taskService.createTask({
        projectId: id,
        title: taskTitle.trim(),
        description: taskDescription.trim(),
        priority: taskPriority,
        timeline: {
          dueDate: new Date(taskDueDate).toISOString(),
        },
        estimatedHours: taskEstimatedHours ? parseInt(taskEstimatedHours) : undefined,
      });

      if (response.success && response.data) {
        toast({
          title: "Task Created",
          description: "The task has been created successfully.",
          variant: "success",
        });
        setTasks([...tasks, response.data]);
        setIsTaskDialogOpen(false);
        setTaskTitle("");
        setTaskDescription("");
        setTaskPriority("medium");
        setTaskDueDate("");
        setTaskEstimatedHours("");
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create task.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: TaskStatus) => {
    try {
      const response = await taskService.updateTaskStatus(taskId, status);
      if (response.success) {
        setTasks(tasks.map((t) => (t._id === taskId ? { ...t, status } : t)));
        toast({
          title: "Task Updated",
          description: `Task status changed to ${TASK_STATUS_LABELS[status]}.`,
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update task status.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitWork = async () => {
    if (!selectedTask || !submissionFile) return;

    // Client-side validation with user-friendly messages
    const description = submissionDescription.trim();
    
    if (!description) {
      toast({
        title: "Description Required",
        description: "Please add a description of what you're submitting.",
        variant: "destructive",
      });
      return;
    }
    
    if (description.length < 10) {
      toast({
        title: "Description Too Short",
        description: "Please provide a more detailed description (at least 10 characters).",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await submissionService.createSubmission(
        selectedTask._id,
        submissionFile,
        description
      );

      if (response.success && response.data) {
        toast({
          title: "Work Submitted",
          description: "Your submission has been uploaded for review.",
          variant: "success",
        });
        setSubmissions([...submissions, response.data]);
        setIsSubmitDialogOpen(false);
        setSelectedTask(null);
        setSubmissionFile(null);
        setSubmissionDescription("");

        // Backend already updates task status to "review" when submission is created
        // Just update local state to reflect the change
        setTasks(tasks.map((t) => (t._id === selectedTask._id ? { ...t, status: "review" } : t)));
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to submit work.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewSubmission = async (
    submissionId: string,
    status: "accepted" | "rejected" | "revision_requested",
    feedback?: string
  ) => {
    try {
      const response = await submissionService.reviewSubmission(submissionId, {
        status,
        feedback,
      });

      if (response.success) {
        const statusMessages = {
          accepted: "Submission has been accepted.",
          rejected: "Submission has been rejected.",
          revision_requested: "Revision has been requested.",
        };
        toast({
          title: "Review Submitted",
          description: statusMessages[status],
          variant: status === "accepted" ? "success" : "default",
        });
        setSubmissions(submissions.map((s) =>
          s._id === submissionId ? { ...s, status, feedback } : s
        ));

        // Backend already updates task status when reviewing submissions
        // We just need to update the local state to reflect the change
        const submission = submissions.find((s) => s._id === submissionId);
        if (submission) {
          const taskId = typeof submission.task === "object" ? submission.task._id : submission.task;
          if (status === "accepted") {
            // Task is set to "completed" by backend
            setTasks(tasks.map((t) => (t._id === taskId ? { ...t, status: "completed" } : t)));
          } else if (status === "rejected" || status === "revision_requested") {
            // Task is set back to "in_progress" by backend
            setTasks(tasks.map((t) => (t._id === taskId ? { ...t, status: "in_progress" } : t)));
          }
        }
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to submit review.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStartProject = async () => {
    if (!project) return;
    try {
      const response = await projectService.updateProjectStatus(id, "in_progress");
      if (response.success) {
        toast({
          title: "Project Started",
          description: "The project is now in progress.",
          variant: "success",
        });
        setProject({ ...project, status: "in_progress" });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to start project.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCompleteProject = async () => {
    if (!project) return;
    try {
      const response = await projectService.updateProjectStatus(id, "completed");
      if (response.success) {
        toast({
          title: "Project Completed",
          description: "Congratulations! The project has been marked as completed.",
          variant: "success",
        });
        setProject({ ...project, status: "completed" });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to complete project.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatBudget = (budget: Project["budget"]) => {
    return `${budget.currency}${budget.min.toLocaleString()} - ${budget.currency}${budget.max.toLocaleString()}`;
  };

  const isProjectOwner = user && project && (
    (typeof project.buyer === "object" && project.buyer._id === user._id) ||
    (typeof project.buyer === "string" && project.buyer === user._id)
  );

  const isAssignedSolver = user && project && (
    (typeof project.assignedTo === "object" && project.assignedTo?._id === user._id) ||
    (typeof project.assignedTo === "string" && project.assignedTo === user._id)
  );

  const completedTasksCount = tasks.filter((t) => t.status === "completed").length;
  const progressPercentage = tasks.length > 0 ? (completedTasksCount / tasks.length) * 100 : 0;

  if (authLoading || isLoading) {
    return <PageLoader />;
  }

  if (error || !project) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState message={error || "Project not found"} onRetry={fetchProjectData} />
      </div>
    );
  }

  return (
    <FadeIn>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Project Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-2xl">{project.title}</CardTitle>
                  <StatusBadge status={project.status} type="project" />
                </div>
                <CardDescription className="flex flex-wrap items-center gap-4 text-sm">
                  <span>{PROJECT_CATEGORY_LABELS[project.category]}</span>
                  <span>•</span>
                  <Badge variant="outline">{PROJECT_PRIORITY_LABELS[project.priority]} Priority</Badge>
                </CardDescription>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {/* Problem Solver Apply Button */}
                {user?.role === ROLES.PROBLEM_SOLVER && project.status === "open" && (
                  <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Send className="h-4 w-4 mr-2" />
                        Apply to Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Apply to Project</DialogTitle>
                        <DialogDescription>
                          Submit your application to work on this project
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Cover Letter *</Label>
                          <Textarea
                            placeholder="Explain why you're the right fit for this project..."
                            rows={5}
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Proposed Budget ($)</Label>
                            <Input
                              type="number"
                              placeholder="Your rate"
                              value={proposedBudget}
                              onChange={(e) => setProposedBudget(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Timeline (days)</Label>
                            <Input
                              type="number"
                              placeholder="Estimated days"
                              value={proposedTimeline}
                              onChange={(e) => setProposedTimeline(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsApplyDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleApply} disabled={isSubmitting || !coverLetter.trim()}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            "Submit Application"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                {/* Problem Solver: Start Project */}
                {isAssignedSolver && project.status === "assigned" && (
                  <Button onClick={handleStartProject}>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Start Working
                  </Button>
                )}

                {/* Buyer: Complete Project */}
                {isProjectOwner && project.status === "in_progress" && completedTasksCount === tasks.length && tasks.length > 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="default">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Complete Project?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to mark this project as completed? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCompleteProject}>
                          Complete Project
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Project Progress (for assigned projects) */}
            {project.status !== "open" && tasks.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {completedTasksCount} of {tasks.length} tasks completed
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            )}

            {/* Key Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-medium">{formatBudget(project.budget)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Deadline</p>
                  <p className="font-medium">{formatDate(project.timeline.deadline)}</p>
                </div>
              </div>
              {project.timeline.estimatedDuration && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{project.timeline.estimatedDuration} days</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Applicants</p>
                  <p className="font-medium">{project.applicantsCount}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {(isProjectOwner || user?.role === ROLES.ADMIN) && project.status === "open" && (
              <TabsTrigger value="requests">Requests ({requests.length})</TabsTrigger>
            )}
            {project.status !== "open" && (
              <>
                <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
                <TabsTrigger value="submissions">Submissions ({submissions.length})</TabsTrigger>
              </>
            )}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{project.description}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2">
                      {project.requirements.map((req, i) => (
                        <li key={i} className="text-muted-foreground">{req}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Tags */}
                {project.tags.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Assigned Solver Info */}
                {project.assignedTo && typeof project.assignedTo === "object" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Assigned To</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                          {(project.assignedTo as User).name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{(project.assignedTo as User).name}</p>
                          <p className="text-sm text-muted-foreground">{(project.assignedTo as User).email}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Requests Tab (Buyer Only) */}
          <TabsContent value="requests">
            {requests.length === 0 ? (
              <EmptyState
                icon={<FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />}
                title="No applications yet"
                description="Problem solvers haven't applied to this project yet."
              />
            ) : (
              <StaggerContainer className="grid gap-4">
                {requests.map((request) => {
                  const solver = request.problemSolver as User;
                  return (
                    <StaggerItem key={request._id}>
                      <Card>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                                {solver?.name?.charAt(0).toUpperCase() || "?"}
                              </div>
                              <div>
                                <CardTitle className="text-lg">{solver?.name || "Unknown"}</CardTitle>
                                <CardDescription>{solver?.email}</CardDescription>
                              </div>
                            </div>
                            <StatusBadge status={request.status} type="request" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4">{request.coverLetter}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            {request.proposedBudget && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                Proposed: ${request.proposedBudget.toLocaleString()}
                              </div>
                            )}
                            {request.proposedTimeline && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                {request.proposedTimeline} days
                              </div>
                            )}
                            {request.status === "pending" && isProjectOwner && (
                              <div className="ml-auto flex gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => handleRejectRequest(request._id)}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                                <Button onClick={() => handleAcceptRequest(request._id)}>
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Accept
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            )}
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Project Tasks</h3>
              {isAssignedSolver && project.status === "in_progress" && (
                <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Task</DialogTitle>
                      <DialogDescription>
                        Add a new task or sub-module to this project
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Title *</Label>
                        <Input
                          placeholder="Task title (at least 3 characters)"
                          value={taskTitle}
                          onChange={(e) => setTaskTitle(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description *</Label>
                        <Textarea
                          placeholder="Describe the task in detail (at least 10 characters)..."
                          rows={3}
                          value={taskDescription}
                          onChange={(e) => setTaskDescription(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Priority</Label>
                          <Select value={taskPriority} onValueChange={(v) => setTaskPriority(v as TaskPriority)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(TASK_PRIORITY_LABELS).map(([value, label]) => (
                                <SelectItem key={value} value={value}>{label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Due Date *</Label>
                          <Input
                            type="date"
                            value={taskDueDate}
                            onChange={(e) => setTaskDueDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Estimated Hours</Label>
                        <Input
                          type="number"
                          placeholder="e.g., 8"
                          value={taskEstimatedHours}
                          onChange={(e) => setTaskEstimatedHours(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateTask} disabled={isSubmitting || !taskTitle.trim() || !taskDueDate}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create Task"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {tasks.length === 0 ? (
              <EmptyState
                icon={<ListTodo className="h-16 w-16 text-muted-foreground/50 mb-4" />}
                title="No tasks yet"
                description={
                  isAssignedSolver
                    ? "Start by creating tasks to organize your work."
                    : "The problem solver hasn't created any tasks yet."
                }
              />
            ) : (
              <StaggerContainer className="grid gap-4">
                {tasks.map((task) => (
                  <StaggerItem key={task._id}>
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{task.title}</CardTitle>
                            <CardDescription>
                              Due: {formatDate(task.timeline.dueDate)}
                              {task.estimatedHours && ` • ${task.estimatedHours}h estimated`}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{TASK_PRIORITY_LABELS[task.priority]}</Badge>
                            <StatusBadge status={task.status} type="task" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          {/* Status Actions */}
                          {isAssignedSolver && project.status === "in_progress" && (
                            <div className="flex gap-2">
                              {task.status === "todo" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateTaskStatus(task._id, "in_progress")}
                                >
                                  Start Task
                                </Button>
                              )}
                              {task.status === "in_progress" && (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedTask(task);
                                    setIsSubmitDialogOpen(true);
                                  }}
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  Submit Work
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}

            {/* Submit Work Dialog */}
            <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit Work</DialogTitle>
                  <DialogDescription>
                    Upload your completed work for: {selectedTask?.title}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>ZIP File *</Label>
                    <Input
                      type="file"
                      accept=".zip"
                      onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)}
                    />
                    <p className="text-xs text-muted-foreground">Only ZIP files are allowed (max 50MB)</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Textarea
                      placeholder="Describe what's included in your submission (e.g., files included, key features, any notes for the reviewer)..."
                      rows={3}
                      value={submissionDescription}
                      onChange={(e) => setSubmissionDescription(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Minimum 10 characters required</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitWork} disabled={isSubmitting || !submissionFile}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Submit
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions">
            {submissions.length === 0 ? (
              <EmptyState
                icon={<FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />}
                title="No submissions yet"
                description="No work has been submitted for review yet."
              />
            ) : (
              <StaggerContainer className="grid gap-4">
                {submissions.map((submission) => {
                  const task = submission.task as Task;
                  const submitter = submission.submittedBy as User;

                  return (
                    <StaggerItem key={submission._id}>
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">
                                {typeof task === "object" ? task.title : "Task Submission"}
                              </CardTitle>
                              <CardDescription>
                                Submitted by {submitter?.name || "Unknown"} • Version {submission.version}
                              </CardDescription>
                            </div>
                            <StatusBadge status={submission.status} type="submission" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          {submission.description && (
                            <p className="text-sm text-muted-foreground mb-4">{submission.description}</p>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm mb-4">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <FileText className="h-4 w-4" />
                              {submission.file.name}
                            </div>
                            <span className="text-muted-foreground">
                              {(submission.file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                            <a
                              href={submissionService.getFileDownloadUrl(submission.file.url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </a>
                          </div>

                          {/* Feedback */}
                          {submission.feedback && (
                            <div className="p-3 bg-muted rounded-md mb-4">
                              <p className="text-sm font-medium mb-1">Feedback:</p>
                              <p className="text-sm text-muted-foreground">{submission.feedback}</p>
                            </div>
                          )}

                          {/* Review Actions (Buyer Only) */}
                          {isProjectOwner && submission.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                onClick={() => handleReviewSubmission(submission._id, "revision_requested", "Please make revisions")}
                              >
                                Request Revision
                              </Button>
                              <Button
                                variant="outline"
                                className="text-destructive"
                                onClick={() => handleReviewSubmission(submission._id, "rejected", "Does not meet requirements")}
                              >
                                Reject
                              </Button>
                              <Button onClick={() => handleReviewSubmission(submission._id, "accepted", "Great work!")}>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Accept
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </FadeIn>
  );
}
