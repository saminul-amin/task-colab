"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { ROLES } from "@/lib/constants";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/animated-containers";
import { Briefcase, Users, CheckCircle2, ArrowRight, Shield, Zap, Clock } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  const getDashboardLink = () => {
    if (!isAuthenticated || !user) return "/login";
    switch (user.role) {
      case ROLES.ADMIN:
        return "/admin/users";
      case ROLES.BUYER:
        return "/projects/my-projects";
      case ROLES.PROBLEM_SOLVER:
        return "/projects/available";
      default:
        return "/dashboard";
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-linear-to-b from-card to-background">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                Connect. Create. <span className="text-primary">Collaborate.</span>
              </h1>
              <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
                A powerful marketplace where buyers post projects and problem solvers deliver excellence. 
                Track progress, manage tasks, and achieve results together.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                {isAuthenticated ? (
                  <Link href={getDashboardLink()}>
                    <Button size="lg" className="w-full sm:w-auto">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/register">
                      <Button size="lg" className="w-full sm:w-auto">
                        Get Started Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button variant="outline" size="lg" className="w-full sm:w-auto">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">100+</p>
              <p className="text-muted-foreground">Active Projects</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">50+</p>
              <p className="text-muted-foreground">Problem Solvers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">95%</p>
              <p className="text-muted-foreground">Success Rate</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">24/7</p>
              <p className="text-muted-foreground">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground">
                How Task Colab Works
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                A simple, streamlined workflow from project creation to completion
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid gap-8 md:grid-cols-3">
            <StaggerItem>
              <Card className="relative h-full hover:shadow-lg transition-shadow">
                <div className="absolute -top-4 left-6 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  1
                </div>
                <CardHeader className="pt-8">
                  <Briefcase className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Post a Project</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Buyers create detailed projects with requirements, budget, and deadlines. 
                    Define clear expectations for success.
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="relative h-full hover:shadow-lg transition-shadow">
                <div className="absolute -top-4 left-6 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  2
                </div>
                <CardHeader className="pt-8">
                  <Users className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Get Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Skilled problem solvers browse and apply to projects. Review applications 
                    and choose the best fit for your needs.
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="relative h-full hover:shadow-lg transition-shadow">
                <div className="absolute -top-4 left-6 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  3
                </div>
                <CardHeader className="pt-8">
                  <CheckCircle2 className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Track & Deliver</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Break work into tasks, submit deliverables, and get feedback. 
                    Complete projects with full transparency.
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground">
                Built for Collaboration
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need to manage projects effectively
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <StaggerItem>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <Shield className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Role-Based Access</h3>
                  <p className="text-muted-foreground text-sm">
                    Clear separation between Admins, Buyers, and Problem Solvers with tailored interfaces.
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <Zap className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Task Management</h3>
                  <p className="text-muted-foreground text-sm">
                    Break projects into tasks, track progress, and manage submissions efficiently.
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <Clock className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Real-time Tracking</h3>
                  <p className="text-muted-foreground text-sm">
                    Monitor project status, deadlines, and deliverables at every step.
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="py-12 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Start?
                </h2>
                <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                  Join Task Colab today and experience seamless project collaboration.
                </p>
                {!isAuthenticated && (
                  <Link href="/register">
                    <Button size="lg" variant="secondary">
                      Create Your Account
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
