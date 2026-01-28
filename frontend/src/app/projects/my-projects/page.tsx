"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { projectService } from "@/services/project.service";
import { Project, PROJECT_STATUS_LABELS, PROJECT_CATEGORY_LABELS } from "@/types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLoader } from "@/components/shared/loading-spinner";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/animated-containers";
import {
  Search,
  Plus,
  Calendar,
  DollarSign,
  Users,
  Eye,
  Edit,
} from "lucide-react";

export default function MyProjectsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== ROLES.BUYER)) {
      router.push("/dashboard");
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user?.role === ROLES.BUYER) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await projectService.getMyProjects({}, { limit: 100 });
      if (response.success && response.data) {
        setProjects(response.data);
      } else {
        setError(response.message || "Failed to fetch projects");
      }
    } catch {
      setError("An error occurred while fetching projects");
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredProjects = () => {
    return projects.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "active" && ["open", "assigned", "in_progress"].includes(p.status)) ||
        (activeTab === "completed" && p.status === "completed");
      return matchesSearch && matchesStatus && matchesTab;
    });
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

  if (authLoading || (isAuthenticated && user?.role !== ROLES.BUYER)) {
    return <PageLoader />;
  }

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="container py-8">
        <ErrorState message={error} onRetry={fetchProjects} />
      </div>
    );
  }

  const filteredProjects = getFilteredProjects();
  const activeCount = projects.filter((p) =>
    ["open", "assigned", "in_progress"].includes(p.status)
  ).length;
  const completedCount = projects.filter((p) => p.status === "completed").length;

  return (
    <FadeIn>
      <div className="container py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Projects</h1>
            <p className="text-muted-foreground mt-2">
              Manage and track your created projects
            </p>
          </div>
          <Link href="/projects/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-bold">{projects.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{activeCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{completedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="all">All ({projects.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({activeCount})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedCount})</TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-62.5"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-37.5">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value={activeTab}>
            {filteredProjects.length === 0 ? (
              <EmptyState
                title="No projects found"
                description={
                  projects.length === 0
                    ? "You haven't created any projects yet. Start by creating your first project."
                    : "No projects match your current filters."
                }
                actionLabel={projects.length === 0 ? "Create Project" : undefined}
                actionHref={projects.length === 0 ? "/projects/create" : undefined}
              />
            ) : (
              <StaggerContainer className="grid gap-4">
                {filteredProjects.map((project) => (
                  <StaggerItem key={project._id}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{project.title}</CardTitle>
                            <CardDescription className="mt-1">
                              {PROJECT_CATEGORY_LABELS[project.category]}
                            </CardDescription>
                          </div>
                          <StatusBadge status={project.status} type="project" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            {formatBudget(project.budget)}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {formatDate(project.timeline.deadline)}
                          </div>
                          {project.status === "open" && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              {project.applicantsCount} applicants
                            </div>
                          )}
                          <div className="ml-auto flex gap-2">
                            {project.status === "open" && (
                              <Link href={`/projects/${project._id}/edit`}>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Button>
                              </Link>
                            )}
                            <Link href={`/projects/${project._id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View
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
        </Tabs>
      </div>
    </FadeIn>
  );
}
