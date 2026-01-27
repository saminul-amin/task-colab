"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { ROLES } from "@/lib/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Users,
  FileText,
  PlusCircle,
  Search,
  Settings,
  TrendingUp,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Link from "next/link";

const roleQuickActions = {
  [ROLES.ADMIN]: [
    { href: "/admin/users", icon: Users, label: "Manage Users", description: "View and manage all users" },
    { href: "/admin/projects", icon: Briefcase, label: "All Projects", description: "Oversee all projects" },
    { href: "/admin/reports", icon: FileText, label: "Reports", description: "View system reports" },
    { href: "/admin/settings", icon: Settings, label: "Settings", description: "Configure system settings" },
  ],
  [ROLES.BUYER]: [
    { href: "/projects/create", icon: PlusCircle, label: "Create Project", description: "Post a new project" },
    { href: "/projects/my-projects", icon: Briefcase, label: "My Projects", description: "View your projects" },
    { href: "/messages", icon: FileText, label: "Messages", description: "View conversations" },
    { href: "/profile", icon: Settings, label: "Profile", description: "Edit your profile" },
  ],
  [ROLES.PROBLEM_SOLVER]: [
    { href: "/projects/available", icon: Search, label: "Find Projects", description: "Browse available work" },
    { href: "/projects/my-work", icon: Briefcase, label: "My Work", description: "View your assignments" },
    { href: "/messages", icon: FileText, label: "Messages", description: "View conversations" },
    { href: "/profile", icon: Settings, label: "Profile", description: "Edit your profile" },
  ],
};

const roleStats = {
  [ROLES.ADMIN]: [
    { label: "Total Users", value: "0", icon: Users, color: "text-blue-600" },
    { label: "Active Projects", value: "0", icon: Briefcase, color: "text-green-600" },
    { label: "Completed", value: "0", icon: CheckCircle2, color: "text-purple-600" },
    { label: "Revenue", value: "$0", icon: TrendingUp, color: "text-orange-600" },
  ],
  [ROLES.BUYER]: [
    { label: "Active Projects", value: "0", icon: Briefcase, color: "text-blue-600" },
    { label: "In Progress", value: "0", icon: Clock, color: "text-yellow-600" },
    { label: "Completed", value: "0", icon: CheckCircle2, color: "text-green-600" },
    { label: "Total Spent", value: "$0", icon: TrendingUp, color: "text-purple-600" },
  ],
  [ROLES.PROBLEM_SOLVER]: [
    { label: "Active Tasks", value: "0", icon: Briefcase, color: "text-blue-600" },
    { label: "Pending", value: "0", icon: Clock, color: "text-yellow-600" },
    { label: "Completed", value: "0", icon: CheckCircle2, color: "text-green-600" },
    { label: "Earnings", value: "$0", icon: TrendingUp, color: "text-purple-600" },
  ],
};

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const quickActions = roleQuickActions[user.role] || roleQuickActions[ROLES.BUYER];
  const stats = roleStats[user.role] || roleStats[ROLES.BUYER];

  const getRoleWelcomeMessage = () => {
    switch (user.role) {
      case ROLES.ADMIN:
        return "Manage and oversee the entire platform";
      case ROLES.BUYER:
        return "Create projects and find talented problem solvers";
      case ROLES.PROBLEM_SOLVER:
        return "Find exciting projects and showcase your skills";
      default:
        return "Welcome to your dashboard";
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user.name.split(" ")[0]}!
        </h1>
        <p className="mt-1 text-muted-foreground">{getRoleWelcomeMessage()}</p>
        <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-primary/10 text-primary capitalize">
          {user.role.replace("_", " ")}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                <CardHeader className="pb-2">
                  <action.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{action.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{action.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity - Placeholder */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No recent activity to display</p>
            <Button asChild className="mt-4">
              <Link href={user.role === ROLES.BUYER ? "/projects/create" : "/projects/available"}>
                {user.role === ROLES.BUYER ? "Create Your First Project" : "Browse Available Projects"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
