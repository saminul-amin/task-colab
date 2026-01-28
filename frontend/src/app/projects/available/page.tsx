"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { projectService } from "@/services/project.service";
import { Project, PROJECT_CATEGORY_LABELS, ProjectCategory } from "@/types";
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
import { Badge } from "@/components/ui/badge";
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
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/animated-containers";
import {
  Search,
  Calendar,
  DollarSign,
  Users,
  Eye,
  Briefcase,
  Clock,
} from "lucide-react";

export default function AvailableProjectsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== ROLES.PROBLEM_SOLVER)) {
      router.push("/dashboard");
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user?.role === ROLES.PROBLEM_SOLVER) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await projectService.getOpenProjects({}, { limit: 100 });
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
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
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

  const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil(
      (new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  if (authLoading || (isAuthenticated && user?.role !== ROLES.PROBLEM_SOLVER)) {
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
          <h1 className="text-3xl font-bold">Find Projects</h1>
          <p className="text-muted-foreground mt-2">
            Browse available projects and apply to work on them
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-50">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(PROJECT_CATEGORY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats Bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Found <span className="font-semibold text-foreground">{filteredProjects.length}</span> available projects
          </p>
        </div>

        {/* Projects List */}
        {filteredProjects.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="h-16 w-16 text-muted-foreground/50 mb-4" />}
            title="No projects available"
            description={
              projects.length === 0
                ? "There are no open projects at the moment. Check back later!"
                : "No projects match your current filters."
            }
          />
        ) : (
          <StaggerContainer className="grid gap-4">
            {filteredProjects.map((project) => {
              const daysLeft = getDaysUntilDeadline(project.timeline.deadline);
              const isUrgent = daysLeft <= 7;

              return (
                <StaggerItem key={project._id}>
                  <Card className="hover:shadow-md transition-shadow group">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {project.title}
                            </CardTitle>
                            {isUrgent && (
                              <Badge variant="destructive" className="text-xs">
                                Urgent
                              </Badge>
                            )}
                          </div>
                          <CardDescription>
                            {PROJECT_CATEGORY_LABELS[project.category]}
                          </CardDescription>
                        </div>
                        <Badge variant="info">Open</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {project.description}
                      </p>

                      {/* Tags */}
                      {project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {project.tags.slice(0, 5).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.tags.length - 5} more
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-medium">{formatBudget(project.budget)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatDate(project.timeline.deadline)}
                        </div>
                        <div className={`flex items-center gap-1 ${isUrgent ? "text-destructive" : "text-muted-foreground"}`}>
                          <Clock className="h-4 w-4" />
                          {daysLeft > 0 ? `${daysLeft} days left` : "Due today"}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {project.applicantsCount} applicants
                        </div>
                        <div className="ml-auto">
                          <Link href={`/projects/${project._id}`}>
                            <Button>
                              <Eye className="h-4 w-4 mr-2" />
                              View & Apply
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}
      </div>
    </FadeIn>
  );
}
