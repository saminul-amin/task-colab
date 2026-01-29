"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { projectService } from "@/services/project.service";
import { Project, PROJECT_CATEGORY_LABELS, ProjectCategory } from "@/types";
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
  Eye,
  Briefcase,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function PublicProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await projectService.getOpenProjects({}, { limit: 50 });
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
      (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState message={error} onRetry={fetchProjects} />
      </div>
    );
  }

  return (
    <FadeIn>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Browse Open Projects</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Discover exciting projects from buyers looking for talented problem solvers.
            Sign up to apply and start working on projects that match your skills.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="outline" size="lg">
                How It Works
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-50">
              <SelectValue placeholder="Category" />
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

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredProjects.length} open project{filteredProjects.length !== 1 ? "s" : ""}
        </p>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="h-16 w-16 text-muted-foreground/50 mb-4" />}
            title="No projects found"
            description={
              searchTerm || categoryFilter !== "all"
                ? "Try adjusting your filters"
                : "Check back later for new projects"
            }
          />
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const daysLeft = getDaysUntilDeadline(project.timeline.deadline);
              return (
                <StaggerItem key={project._id}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg line-clamp-2">
                            {project.title}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {PROJECT_CATEGORY_LABELS[project.category as ProjectCategory]}
                            </Badge>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {project.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="h-4 w-4 shrink-0" />
                          <span className="truncate">{formatBudget(project.budget)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4 shrink-0" />
                          <span className="truncate">{formatDate(project.timeline.deadline)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4 shrink-0" />
                          <span className={daysLeft <= 7 ? "text-orange-600 font-medium" : ""}>
                            {daysLeft > 0 ? `${daysLeft} days left` : "Deadline passed"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Eye className="h-4 w-4 shrink-0" />
                          <span>{project.applicantsCount || 0} applicants</span>
                        </div>
                      </div>

                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      <Link href="/register">
                        <Button className="w-full" variant="outline">
                          Sign up to Apply
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-muted/50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Join Task Colab today and connect with talented problem solvers or find your next project.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg">Create Account</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
