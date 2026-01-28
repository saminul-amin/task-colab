"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { userService } from "@/services/user.service";
import { User } from "@/types";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageLoader } from "@/components/shared/loading-spinner";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/animated-containers";
import {
  Search,
  MoreVertical,
  UserCog,
  Shield,
  ShieldOff,
  Loader2,
  Users,
} from "lucide-react";

export default function AdminUsersPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== ROLES.ADMIN)) {
      router.push("/dashboard");
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user?.role === ROLES.ADMIN) {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userService.getAllUsers({ limit: 100 });
      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        setError(response.message || "Failed to fetch users");
      }
    } catch {
      setError("An error occurred while fetching users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;

    try {
      setIsUpdating(true);
      const response = await userService.updateUserRole(selectedUser._id, {
        role: newRole as "admin" | "buyer" | "problem_solver",
      });
      if (response.success) {
        setUsers(users.map((u) => (u._id === selectedUser._id ? { ...u, role: newRole as User["role"] } : u)));
        setIsRoleDialogOpen(false);
        setSelectedUser(null);
        setNewRole("");
      }
    } catch {
      setError("Failed to update user role");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusToggle = async (targetUser: User) => {
    try {
      const newStatus = targetUser.status === "active" ? "blocked" : "active";
      const response = await userService.updateUserStatus(targetUser._id, {
        status: newStatus,
      });
      if (response.success) {
        setUsers(users.map((u) => (u._id === targetUser._id ? { ...u, status: newStatus } : u)));
      }
    } catch {
      setError("Failed to update user status");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case ROLES.ADMIN:
        return "destructive";
      case ROLES.BUYER:
        return "default";
      case ROLES.PROBLEM_SOLVER:
        return "secondary";
      default:
        return "outline";
    }
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
        <ErrorState message={error} onRetry={fetchUsers} />
      </div>
    );
  }

  return (
    <FadeIn>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Manage Users</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all users in the system
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-45">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value={ROLES.ADMIN}>Admin</SelectItem>
                  <SelectItem value={ROLES.BUYER}>Buyer</SelectItem>
                  <SelectItem value={ROLES.PROBLEM_SOLVER}>Problem Solver</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Admins</p>
                  <p className="text-2xl font-bold">
                    {users.filter((u) => u.role === ROLES.ADMIN).length}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Buyers</p>
                  <p className="text-2xl font-bold">
                    {users.filter((u) => u.role === ROLES.BUYER).length}
                  </p>
                </div>
                <UserCog className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Problem Solvers</p>
                  <p className="text-2xl font-bold">
                    {users.filter((u) => u.role === ROLES.PROBLEM_SOLVER).length}
                  </p>
                </div>
                <UserCog className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        {filteredUsers.length === 0 ? (
          <EmptyState
            title="No users found"
            description="No users match your current filters."
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
              <CardDescription>
                Manage user roles and account status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StaggerContainer className="divide-y">
                {filteredUsers.map((targetUser) => (
                  <StaggerItem key={targetUser._id}>
                    <div className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                          {targetUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{targetUser.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {targetUser.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={getRoleBadgeVariant(targetUser.role)}>
                          {targetUser.role.replace("_", " ")}
                        </Badge>
                        <Badge
                          variant={targetUser.status === "active" ? "success" : "destructive"}
                        >
                          {targetUser.status}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(targetUser);
                                setNewRole(targetUser.role);
                                setIsRoleDialogOpen(true);
                              }}
                            >
                              <UserCog className="h-4 w-4 mr-2" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleStatusToggle(targetUser)}
                              className={targetUser.status === "active" ? "text-red-600" : "text-green-600"}
                            >
                              {targetUser.status === "active" ? (
                                <>
                                  <ShieldOff className="h-4 w-4 mr-2" />
                                  Block User
                                </>
                              ) : (
                                <>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Activate User
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </CardContent>
          </Card>
        )}

        {/* Role Change Dialog */}
        <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change User Role</DialogTitle>
              <DialogDescription>
                Update the role for {selectedUser?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ROLES.ADMIN}>Admin</SelectItem>
                  <SelectItem value={ROLES.BUYER}>Buyer</SelectItem>
                  <SelectItem value={ROLES.PROBLEM_SOLVER}>Problem Solver</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsRoleDialogOpen(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button onClick={handleRoleChange} disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Role"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </FadeIn>
  );
}
