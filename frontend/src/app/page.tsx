"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { ROLES } from "@/lib/constants";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/animated-containers";
import { 
  Briefcase, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Shield, 
  Zap, 
  Clock,
  MessageSquare,
  FileCheck,
  CreditCard,
  Star,
  BadgeCheck,
  Headphones
} from "lucide-react";

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

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Startup Founder",
      content: "Task Colab transformed how we handle outsourced development. The task breakdown feature keeps everything organized and transparent.",
      rating: 5,
    },
    {
      name: "Marcus Johnson",
      role: "Problem Solver",
      content: "As a freelance developer, this platform gives me access to quality projects with clear requirements. The review system ensures fair work.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Product Manager",
      content: "Finally, a platform that understands project management! The submission and feedback loop is exactly what we needed.",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: "How do I get started as a Buyer?",
      answer: "Sign up, create your first project with clear requirements and budget, then review applications from qualified problem solvers.",
    },
    {
      question: "How do Problem Solvers get paid?",
      answer: "Payment is handled securely through the platform after the buyer approves your submitted work.",
    },
    {
      question: "Can I request revisions on submitted work?",
      answer: "Yes! Buyers can request revisions or provide feedback on any submission before final approval.",
    },
    {
      question: "What types of projects can I post?",
      answer: "From web development to machine learning, our platform supports various tech categories including mobile apps, APIs, and data analysis.",
    },
  ];

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
                    <Link href="/projects">
                      <Button variant="outline" size="lg" className="w-full sm:w-auto">
                        Browse Projects
                      </Button>
                    </Link>
                  </>
                )}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                No credit card required • Free to sign up • Cancel anytime
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">500+</p>
              <p className="text-muted-foreground">Projects Completed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">200+</p>
              <p className="text-muted-foreground">Verified Solvers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">98%</p>
              <p className="text-muted-foreground">Success Rate</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">4.9★</p>
              <p className="text-muted-foreground">Average Rating</p>
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

          <div className="text-center mt-12">
            <Link href="/how-it-works">
              <Button variant="link" className="text-primary">
                Learn more about our process
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* For Buyers & Problem Solvers Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground">
                Built for Everyone
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Whether you&apos;re hiring talent or looking for work
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8">
            <FadeIn>
              <Card className="h-full border-2 hover:border-primary/50 transition-colors flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-2xl">For Buyers</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <p className="text-muted-foreground mb-4">
                    Get your projects done by skilled professionals with clear tracking and quality assurance.
                  </p>
                  <ul className="space-y-3 flex-1">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm">Post projects with detailed requirements</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm">Review applications from verified solvers</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm">Create tasks and track progress in real-time</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm">Review submissions and request revisions</span>
                    </li>
                  </ul>
                  <Link href="/register" className="mt-6">
                    <Button className="w-full">
                      Start Hiring
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn>
              <Card className="h-full border-2 hover:border-primary/50 transition-colors flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-2xl">For Problem Solvers</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  <p className="text-muted-foreground mb-4">
                    Find quality projects, showcase your skills, and build your reputation.
                  </p>
                  <ul className="space-y-3 flex-1">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm">Browse projects matching your skills</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm">Submit compelling proposals to buyers</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm">Work on clear tasks with defined deliverables</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm">Get feedback and build your portfolio</span>
                    </li>
                  </ul>
                  <Link href="/register" className="mt-6">
                    <Button variant="outline" className="w-full">
                      Start Earning
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground">
                Powerful Features for Seamless Collaboration
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need to manage projects effectively
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <StaggerItem>
              <Card className="h-full flex flex-col">
                <CardContent className="pt-6 flex flex-col flex-1">
                  <Shield className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Role-Based Access</h3>
                  <p className="text-muted-foreground text-sm flex-1">
                    Clear separation between Admins, Buyers, and Problem Solvers with tailored interfaces.
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="h-full flex flex-col">
                <CardContent className="pt-6 flex flex-col flex-1">
                  <Zap className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Task Management</h3>
                  <p className="text-muted-foreground text-sm flex-1">
                    Break projects into manageable tasks with deadlines and track progress efficiently.
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="h-full flex flex-col">
                <CardContent className="pt-6 flex flex-col flex-1">
                  <Clock className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Real-time Tracking</h3>
                  <p className="text-muted-foreground text-sm flex-1">
                    Monitor project status, deadlines, and deliverables at every step of the journey.
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="h-full flex flex-col">
                <CardContent className="pt-6 flex flex-col flex-1">
                  <MessageSquare className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">In-App Messaging</h3>
                  <p className="text-muted-foreground text-sm flex-1">
                    Communicate directly with buyers or solvers without leaving the platform.
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="h-full flex flex-col">
                <CardContent className="pt-6 flex flex-col flex-1">
                  <FileCheck className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Submission Reviews</h3>
                  <p className="text-muted-foreground text-sm flex-1">
                    Review work, provide feedback, and request revisions with version history.
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="h-full flex flex-col">
                <CardContent className="pt-6 flex flex-col flex-1">
                  <CreditCard className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Secure Payments</h3>
                  <p className="text-muted-foreground text-sm flex-1">
                    Budget tracking and secure payment processing for completed work.
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground">
                What Our Users Say
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Trusted by professionals and businesses worldwide
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <StaggerItem key={index}>
                <Card className="h-full flex flex-col">
                  <CardContent className="pt-6 flex flex-col flex-1">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic flex-1">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 mt-auto">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <BadgeCheck className="h-10 w-10 text-primary mb-3" />
              <p className="font-semibold">Verified Profiles</p>
              <p className="text-sm text-muted-foreground">All solvers are verified</p>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="h-10 w-10 text-primary mb-3" />
              <p className="font-semibold">Secure Platform</p>
              <p className="text-sm text-muted-foreground">Enterprise-grade security</p>
            </div>
            <div className="flex flex-col items-center">
              <CreditCard className="h-10 w-10 text-primary mb-3" />
              <p className="font-semibold">Safe Payments</p>
              <p className="text-sm text-muted-foreground">Escrow protection</p>
            </div>
            <div className="flex flex-col items-center">
              <Headphones className="h-10 w-10 text-primary mb-3" />
              <p className="font-semibold">24/7 Support</p>
              <p className="text-sm text-muted-foreground">Always here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Got questions? We&apos;ve got answers
              </p>
            </div>
          </FadeIn>

          <div className="max-w-3xl mx-auto">
            <StaggerContainer className="space-y-4">
              {faqs.map((faq, index) => (
                <StaggerItem key={index}>
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">{faq.question}</h3>
                      <p className="text-muted-foreground text-sm">{faq.answer}</p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">Still have questions?</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/faq">
                <Button variant="outline">
                  View All FAQs
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline">
                  Contact Support
                  <MessageSquare className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Card className="bg-primary text-primary-foreground overflow-hidden relative">
              <div className="absolute inset-0 bg-linear-to-r from-primary to-primary/80" />
              <CardContent className="py-16 text-center relative z-10">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Transform Your Workflow?
                </h2>
                <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                  Join thousands of businesses and professionals who trust Task Colab for seamless project collaboration.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  {!isAuthenticated ? (
                    <>
                      <Link href="/register">
                        <Button size="lg" variant="secondary">
                          Get Started Free
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                      <Link href="/how-it-works">
                        <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                          Learn More
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Link href={getDashboardLink()}>
                      <Button size="lg" variant="secondary">
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
