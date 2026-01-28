"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { projectService } from "@/services/project.service";
import { userService } from "@/services/user.service";
import { Project, User } from "@/types";
import { ROLES } from "@/lib/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageLoader } from "@/components/shared/loading-spinner";
import { ErrorState } from "@/components/shared/error-state";
import { FadeIn } from "@/components/shared/animated-containers";
import {
  Users,
  Briefcase,
  CheckCircle2,
  Clock,
  TrendingUp,
  DollarSign,
  UserCheck,
  FileText,
  BarChart3,
  PieChart,
} from "lucide-react";

interface ReportStats {
  users: {
    total: number;
    buyers: number;
    problemSolvers: number;
    admins: number;
    activeUsers: number;
    blockedUsers: number;
  };
  projects: {
    total: number;
    open: number;
    assigned: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    totalBudget: number;
    avgBudget: number;
  };
}

export default function AdminReportsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== ROLES.ADMIN)) {
      router.push("/dashboard");
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user?.role === ROLES.ADMIN) {
      fetchReportData();
    }
  }, [user]);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [projectsRes, usersRes] = await Promise.all([
        projectService.getAllProjects({}, { limit: 1000 }),
        userService.getAllUsers({ limit: 1000 }),
      ]);

      const projects: Project[] = projectsRes.success && projectsRes.data ? projectsRes.data : [];
      const users: User[] = usersRes.success && usersRes.data ? usersRes.data : [];

      // Calculate user stats
      const userStats = {
        total: users.length,
        buyers: users.filter((u) => u.role === "buyer").length,
        problemSolvers: users.filter((u) => u.role === "problem_solver").length,
        admins: users.filter((u) => u.role === "admin").length,
        activeUsers: users.filter((u) => u.status === "active").length,
        blockedUsers: users.filter((u) => u.status === "blocked").length,
      };

      // Calculate project stats
      const totalBudget = projects.reduce((sum, p) => sum + (p.budget.min + p.budget.max) / 2, 0);
      const projectStats = {
        total: projects.length,
        open: projects.filter((p) => p.status === "open").length,
        assigned: projects.filter((p) => p.status === "assigned").length,
        inProgress: projects.filter((p) => p.status === "in_progress").length,
        completed: projects.filter((p) => p.status === "completed").length,
        cancelled: projects.filter((p) => p.status === "cancelled").length,
        totalBudget,
        avgBudget: projects.length > 0 ? totalBudget / projects.length : 0,
      };

      setStats({
        users: userStats,
        projects: projectStats,
      });
    } catch {
      setError("An error occurred while fetching report data");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (authLoading || (isAuthenticated && user?.role !== ROLES.ADMIN)) {
    return <PageLoader />;
  }

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState message={error} onRetry={fetchReportData} />
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <FadeIn>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Overview of platform statistics and metrics
          </p>
        </div>

        {/* User Statistics Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">User Statistics</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{stats.users.total}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Buyers</p>
                    <p className="text-2xl font-bold">{stats.users.buyers}</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Problem Solvers</p>
                    <p className="text-2xl font-bold">{stats.users.problemSolvers}</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Admins</p>
                    <p className="text-2xl font-bold">{stats.users.admins}</p>
                  </div>
                  <Users className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-green-600">{stats.users.activeUsers}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Blocked</p>
                    <p className="text-2xl font-bold text-red-600">{stats.users.blockedUsers}</p>
                  </div>
                  <Users className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Project Statistics Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Project Statistics</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Projects</p>
                    <p className="text-2xl font-bold">{stats.projects.total}</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                    <p className="text-2xl font-bold">
                      {stats.projects.total > 0
                        ? Math.round((stats.projects.completed / stats.projects.total) * 100)
                        : 0}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Budget</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.projects.totalBudget)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Budget</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.projects.avgBudget)}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Status Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Open</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.projects.open}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Assigned</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.projects.assigned}</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.projects.inProgress}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{stats.projects.completed}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Cancelled</p>
                    <p className="text-2xl font-bold text-red-600">{stats.projects.cancelled}</p>
                  </div>
                  <FileText className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Visual Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                User Distribution
              </CardTitle>
              <CardDescription>Breakdown of users by role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-sm">Buyers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{stats.users.buyers}</span>
                    <span className="text-sm text-muted-foreground">
                      ({stats.users.total > 0 ? Math.round((stats.users.buyers / stats.users.total) * 100) : 0}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${stats.users.total > 0 ? (stats.users.buyers / stats.users.total) * 100 : 0}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-purple-500" />
                    <span className="text-sm">Problem Solvers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{stats.users.problemSolvers}</span>
                    <span className="text-sm text-muted-foreground">
                      ({stats.users.total > 0 ? Math.round((stats.users.problemSolvers / stats.users.total) * 100) : 0}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${stats.users.total > 0 ? (stats.users.problemSolvers / stats.users.total) * 100 : 0}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="text-sm">Admins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{stats.users.admins}</span>
                    <span className="text-sm text-muted-foreground">
                      ({stats.users.total > 0 ? Math.round((stats.users.admins / stats.users.total) * 100) : 0}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${stats.users.total > 0 ? (stats.users.admins / stats.users.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Project Status
              </CardTitle>
              <CardDescription>Breakdown of projects by status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-sm">Open</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{stats.projects.open}</span>
                    <span className="text-sm text-muted-foreground">
                      ({stats.projects.total > 0 ? Math.round((stats.projects.open / stats.projects.total) * 100) : 0}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${stats.projects.total > 0 ? (stats.projects.open / stats.projects.total) * 100 : 0}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-orange-500" />
                    <span className="text-sm">In Progress</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{stats.projects.inProgress}</span>
                    <span className="text-sm text-muted-foreground">
                      ({stats.projects.total > 0 ? Math.round((stats.projects.inProgress / stats.projects.total) * 100) : 0}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${stats.projects.total > 0 ? (stats.projects.inProgress / stats.projects.total) * 100 : 0}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-sm">Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{stats.projects.completed}</span>
                    <span className="text-sm text-muted-foreground">
                      ({stats.projects.total > 0 ? Math.round((stats.projects.completed / stats.projects.total) * 100) : 0}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${stats.projects.total > 0 ? (stats.projects.completed / stats.projects.total) * 100 : 0}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="text-sm">Cancelled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{stats.projects.cancelled}</span>
                    <span className="text-sm text-muted-foreground">
                      ({stats.projects.total > 0 ? Math.round((stats.projects.cancelled / stats.projects.total) * 100) : 0}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${stats.projects.total > 0 ? (stats.projects.cancelled / stats.projects.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </FadeIn>
  );
}
