"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { projectService } from "@/services/project.service";
import { requestService } from "@/services/request.service";
import { Project, Request, PROJECT_CATEGORY_LABELS } from "@/types";
import { ROLES } from "@/lib/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLoader } from "@/components/shared/loading-spinner";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/animated-containers";
import {
  Calendar,
  DollarSign,
  Eye,
  Briefcase,
  Clock,
  FileText,
} from "lucide-react";

export default function MyWorkPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== ROLES.PROBLEM_SOLVER)) {
      router.push("/dashboard");
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user?.role === ROLES.PROBLEM_SOLVER) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [projectsRes, requestsRes] = await Promise.all([
        projectService.getMyProjects({}, { limit: 100 }),
        requestService.getMyRequests({}, { limit: 100 }),
      ]);

      if (projectsRes.success && projectsRes.data) {
        setProjects(projectsRes.data);
      }
      if (requestsRes.success && requestsRes.data) {
        setRequests(requestsRes.data);
      }
    } catch {
      setError("An error occurred while fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawRequest = async (requestId: string) => {
    try {
      const response = await requestService.withdrawRequest(requestId);
      if (response.success) {
        setRequests(requests.map((r) =>
          r._id === requestId ? { ...r, status: "withdrawn" } : r
        ));
      }
    } catch {
      // Handle error silently
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

  const activeProjects = projects.filter((p) =>
    ["assigned", "in_progress"].includes(p.status)
  );
  const completedProjects = projects.filter((p) => p.status === "completed");
  const pendingRequests = requests.filter((r) => r.status === "pending");

  if (authLoading || (isAuthenticated && user?.role !== ROLES.PROBLEM_SOLVER)) {
    return <PageLoader />;
  }

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState message={error} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <FadeIn>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Work</h1>
          <p className="text-muted-foreground mt-2">
            Manage your assigned projects and applications
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                  <p className="text-2xl font-bold">{activeProjects.length}</p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{completedProjects.length}</p>
                </div>
                <Briefcase className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Applications</p>
                  <p className="text-2xl font-bold">{pendingRequests.length}</p>
                </div>
                <FileText className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                  <p className="text-2xl font-bold">{requests.length}</p>
                </div>
                <FileText className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="active">Active ({activeProjects.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedProjects.length})</TabsTrigger>
            <TabsTrigger value="applications">Applications ({requests.length})</TabsTrigger>
          </TabsList>

          {/* Active Projects */}
          <TabsContent value="active">
            {activeProjects.length === 0 ? (
              <EmptyState
                icon={<Briefcase className="h-16 w-16 text-muted-foreground/50 mb-4" />}
                title="No active projects"
                description="You don't have any active projects. Browse available projects and apply!"
                actionLabel="Find Projects"
                actionHref="/projects/available"
              />
            ) : (
              <StaggerContainer className="grid gap-4">
                {activeProjects.map((project) => (
                  <StaggerItem key={project._id}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{project.title}</CardTitle>
                            <CardDescription>
                              {PROJECT_CATEGORY_LABELS[project.category]}
                            </CardDescription>
                          </div>
                          <StatusBadge status={project.status} type="project" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            {formatBudget(project.budget)}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            Due: {formatDate(project.timeline.deadline)}
                          </div>
                          <div className="ml-auto flex gap-2">
                            <Link href={`/projects/${project._id}`}>
                              <Button>
                                <Eye className="h-4 w-4 mr-2" />
                                Open Workspace
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </TabsContent>

          {/* Completed Projects */}
          <TabsContent value="completed">
            {completedProjects.length === 0 ? (
              <EmptyState
                icon={<Briefcase className="h-16 w-16 text-muted-foreground/50 mb-4" />}
                title="No completed projects"
                description="You haven't completed any projects yet."
              />
            ) : (
              <StaggerContainer className="grid gap-4">
                {completedProjects.map((project) => (
                  <StaggerItem key={project._id}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{project.title}</CardTitle>
                            <CardDescription>
                              {PROJECT_CATEGORY_LABELS[project.category]}
                            </CardDescription>
                          </div>
                          <StatusBadge status={project.status} type="project" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            {formatBudget(project.budget)}
                          </div>
                          <div className="ml-auto">
                            <Link href={`/projects/${project._id}`}>
                              <Button variant="outline">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </TabsContent>

          {/* Applications */}
          <TabsContent value="applications">
            {requests.length === 0 ? (
              <EmptyState
                icon={<FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />}
                title="No applications"
                description="You haven't applied to any projects yet."
                actionLabel="Find Projects"
                actionHref="/projects/available"
              />
            ) : (
              <StaggerContainer className="grid gap-4">
                {requests.map((request) => {
                  const project = request.project as Project;
                  return (
                    <StaggerItem key={request._id}>
                      <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">
                                {typeof project === "object" ? project.title : "Project"}
                              </CardTitle>
                              <CardDescription>
                                Applied {formatDate(request.createdAt)}
                              </CardDescription>
                            </div>
                            <StatusBadge status={request.status} type="request" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {request.coverLetter}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            {request.proposedBudget && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <DollarSign className="h-4 w-4" />
                                Proposed: ${request.proposedBudget.toLocaleString()}
                              </div>
                            )}
                            {request.proposedTimeline && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                {request.proposedTimeline} days
                              </div>
                            )}
                            <div className="ml-auto flex gap-2">
                              {request.status === "pending" && (
                                <Button
                                  variant="outline"
                                  onClick={() => handleWithdrawRequest(request._id)}
                                >
                                  Withdraw
                                </Button>
                              )}
                              {typeof project === "object" && (
                                <Link href={`/projects/${project._id}`}>
                                  <Button variant="outline">
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Project
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </div>
                          {request.status === "rejected" && request.rejectionReason && (
                            <div className="mt-4 p-3 bg-destructive/10 rounded-md">
                              <p className="text-sm text-destructive">
                                <strong>Rejection reason:</strong> {request.rejectionReason}
                              </p>
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
