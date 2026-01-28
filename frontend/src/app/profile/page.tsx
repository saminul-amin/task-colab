"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { authService } from "@/services/auth.service";
import { USER_ROLE_LABELS } from "@/types";
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
import { PageLoader } from "@/components/shared/loading-spinner";
import { FadeIn } from "@/components/shared/animated-containers";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Loader2,
  Edit,
  CheckCircle2,
  Save,
  X,
} from "lucide-react";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, refreshUser } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || "");
      setBio(user.bio || "");
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const response = await authService.updateProfile({
        name: name.trim(),
        phone: phone.trim() || undefined,
        bio: bio.trim() || undefined,
      });

      if (response.success) {
        setSuccessMessage("Profile updated successfully!");
        setIsEditing(false);
        refreshUser();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage(response.message || "Failed to update profile");
      }
    } catch {
      setErrorMessage("An error occurred while updating profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters");
      return;
    }

    try {
      setIsChangingPassword(true);
      setErrorMessage(null);

      const response = await authService.changePassword({
        currentPassword,
        newPassword,
      });

      if (response.success) {
        setSuccessMessage("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage(response.message || "Failed to change password");
      }
    } catch {
      setErrorMessage("An error occurred while changing password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const cancelEdit = () => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || "");
      setBio(user.bio || "");
    }
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!user) {
    return null;
  }

  return (
    <FadeIn>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
            {errorMessage}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="mt-1 text-muted-foreground">Manage your account information</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Info Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{user.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </CardDescription>
                    <Badge className="mt-2" variant="outline">
                      {USER_ROLE_LABELS[user.role]}
                    </Badge>
                  </div>
                </div>
                {!isEditing ? (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={cancelEdit}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={isSubmitting || !name.trim()}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                {isEditing ? "Update your personal details" : "Your personal details"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      placeholder="Your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea
                      placeholder="Tell us about yourself..."
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{user.name}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{user.phone || "Not provided"}</p>
                    </div>
                  </div>
                  {user.bio && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Bio</p>
                        <p className="text-sm">{user.bio}</p>
                      </div>
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Account Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account status and details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium">{USER_ROLE_LABELS[user.role]}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 flex items-center justify-center">
                  <div className={`h-3 w-3 rounded-full ${user.status === "active" ? "bg-green-500" : "bg-red-500"}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium capitalize">{user.status}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={isChangingPassword}>
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Role-specific Activity Summary */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
              <CardDescription>Your activity on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {user.role === ROLES.BUYER && (
                  <>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-primary">{user.projectsCreated || 0}</p>
                      <p className="text-sm text-muted-foreground">Projects Created</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-primary">{user.completedProjects || 0}</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </>
                )}
                {user.role === ROLES.PROBLEM_SOLVER && (
                  <>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-primary">{user.projectsAssigned || 0}</p>
                      <p className="text-sm text-muted-foreground">Projects Assigned</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-primary">{user.completedProjects || 0}</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                    {user.rating !== undefined && (
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-2xl font-bold text-primary">{user.rating.toFixed(1)}</p>
                        <p className="text-sm text-muted-foreground">Rating</p>
                      </div>
                    )}
                  </>
                )}
                {user.role === ROLES.ADMIN && (
                  <div className="col-span-4 text-center p-4 bg-muted rounded-lg">
                    <p className="text-muted-foreground">Admin accounts have access to all platform metrics via the dashboard.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </FadeIn>
  );
}
