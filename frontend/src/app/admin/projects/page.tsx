"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { PageLoader } from "@/components/shared/loading-spinner";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/animated-containers";
import {
  Search,
  Briefcase,
  Calendar,
  DollarSign,
  Eye,
} from "lucide-react";
import Link from "next/link";

export default function AdminProjectsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== ROLES.ADMIN)) {
      router.push("/dashboard");
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user?.role === ROLES.ADMIN) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await projectService.getAllProjects({}, { limit: 100 });
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

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  if (authLoading || (isAuthenticated && user?.role !== ROLES.ADMIN)) {
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

  return (
    <FadeIn>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">All Projects</h1>
          <p className="text-muted-foreground mt-2">
            View and monitor all projects in the system
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-45">
                  <SelectValue placeholder="Filter by status" />
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
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6">
          {Object.entries(PROJECT_STATUS_LABELS).map(([status, label]) => (
            <Card key={status}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-2xl font-bold">
                      {projects.filter((p) => p.status === status).length}
                    </p>
                  </div>
                  <Briefcase className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Projects List */}
        {filteredProjects.length === 0 ? (
          <EmptyState
            title="No projects found"
            description="No projects match your current filters."
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
                      <div className="ml-auto">
                        <Link href={`/projects/${project._id}`}>
                          <Button variant="outline" size="sm">
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
      </div>
    </FadeIn>
  );
}
