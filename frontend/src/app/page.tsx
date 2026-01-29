"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { ROLES } from "@/lib/constants";
import { 
  FadeIn, 
  FadeInOnScroll,
  StaggerContainer, 
  StaggerItem,
  StaggerOnScroll,
  HoverLift,
  PulseOnHover
} from "@/components/shared/animated-containers";
import { motion } from "framer-motion";
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
          <StaggerOnScroll className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StaggerItem>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-3xl font-bold text-primary">500+</p>
                <p className="text-muted-foreground">Projects Completed</p>
              </motion.div>
            </StaggerItem>
            <StaggerItem>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-3xl font-bold text-primary">200+</p>
                <p className="text-muted-foreground">Verified Solvers</p>
              </motion.div>
            </StaggerItem>
            <StaggerItem>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-3xl font-bold text-primary">98%</p>
                <p className="text-muted-foreground">Success Rate</p>
              </motion.div>
            </StaggerItem>
            <StaggerItem>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-3xl font-bold text-primary">4.9★</p>
                <p className="text-muted-foreground">Average Rating</p>
              </motion.div>
            </StaggerItem>
          </StaggerOnScroll>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground">
                How Task Colab Works
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                A simple, streamlined workflow from project creation to completion
              </p>
            </div>
          </FadeInOnScroll>

          <StaggerOnScroll className="grid gap-8 md:grid-cols-3">
            <StaggerItem>
              <HoverLift>
                <Card className="relative h-full transition-shadow hover:shadow-xl">
                  <motion.div 
                    className="absolute -top-4 left-6 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    1
                  </motion.div>
                  <CardHeader className="pt-8">
                    <PulseOnHover>
                      <Briefcase className="h-10 w-10 text-primary mb-4" />
                    </PulseOnHover>
                    <CardTitle>Post a Project</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Buyers create detailed projects with requirements, budget, and deadlines. 
                      Define clear expectations for success.
                    </p>
                  </CardContent>
                </Card>
              </HoverLift>
            </StaggerItem>

            <StaggerItem>
              <HoverLift>
                <Card className="relative h-full transition-shadow hover:shadow-xl">
                  <motion.div 
                    className="absolute -top-4 left-6 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    2
                  </motion.div>
                  <CardHeader className="pt-8">
                    <PulseOnHover>
                      <Users className="h-10 w-10 text-primary mb-4" />
                    </PulseOnHover>
                    <CardTitle>Get Applications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Skilled problem solvers browse and apply to projects. Review applications 
                      and choose the best fit for your needs.
                    </p>
                  </CardContent>
                </Card>
              </HoverLift>
            </StaggerItem>

            <StaggerItem>
              <HoverLift>
                <Card className="relative h-full transition-shadow hover:shadow-xl">
                  <motion.div 
                    className="absolute -top-4 left-6 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    3
                  </motion.div>
                  <CardHeader className="pt-8">
                    <PulseOnHover>
                      <CheckCircle2 className="h-10 w-10 text-primary mb-4" />
                    </PulseOnHover>
                    <CardTitle>Track & Deliver</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Break work into tasks, submit deliverables, and get feedback. 
                      Complete projects with full transparency.
                    </p>
                  </CardContent>
                </Card>
              </HoverLift>
            </StaggerItem>
          </StaggerOnScroll>

          <FadeInOnScroll delay={0.3}>
            <div className="text-center mt-12">
              <Link href="/how-it-works">
                <Button variant="link" className="text-primary group">
                  Learn more about our process
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* For Buyers & Problem Solvers Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground">
                Built for Everyone
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Whether you&apos;re hiring talent or looking for work
              </p>
            </div>
          </FadeInOnScroll>

          <div className="grid md:grid-cols-2 gap-8">
            <FadeInOnScroll delay={0.1} className="h-full">
              <HoverLift className="h-full">
                <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 flex flex-col">
                  <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <motion.div 
                      className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"
                      whileHover={{ rotate: -10, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </motion.div>
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
                  <Link href="/register" className="mt-auto pt-6">
                    <Button className="w-full group">
                      Start Hiring
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              </HoverLift>
            </FadeInOnScroll>

            <FadeInOnScroll delay={0.2} className="h-full">
              <HoverLift className="h-full">
                <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <motion.div 
                      className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </motion.div>
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
                  <Link href="/register" className="mt-auto pt-6">
                    <Button variant="outline" className="w-full group">
                      Start Earning
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              </HoverLift>
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground">
                Powerful Features for Seamless Collaboration
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need to manage projects effectively
              </p>
            </div>
          </FadeInOnScroll>

          <StaggerOnScroll className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <StaggerItem>
              <HoverLift>
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 flex flex-col flex-1">
                    <PulseOnHover>
                      <Shield className="h-8 w-8 text-primary mb-4" />
                    </PulseOnHover>
                    <h3 className="font-semibold text-lg mb-2">Role-Based Access</h3>
                  <p className="text-muted-foreground text-sm flex-1">
                    Clear separation between Admins, Buyers, and Problem Solvers with tailored interfaces.
                  </p>
                </CardContent>
              </Card>
              </HoverLift>
            </StaggerItem>

            <StaggerItem>
              <HoverLift>
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 flex flex-col flex-1">
                    <PulseOnHover>
                      <Zap className="h-8 w-8 text-primary mb-4" />
                    </PulseOnHover>
                    <h3 className="font-semibold text-lg mb-2">Task Management</h3>
                    <p className="text-muted-foreground text-sm flex-1">
                      Break projects into manageable tasks with deadlines and track progress efficiently.
                    </p>
                  </CardContent>
                </Card>
              </HoverLift>
            </StaggerItem>

            <StaggerItem>
              <HoverLift>
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 flex flex-col flex-1">
                    <PulseOnHover>
                      <Clock className="h-8 w-8 text-primary mb-4" />
                    </PulseOnHover>
                    <h3 className="font-semibold text-lg mb-2">Real-time Tracking</h3>
                    <p className="text-muted-foreground text-sm flex-1">
                      Monitor project status, deadlines, and deliverables at every step of the journey.
                    </p>
                  </CardContent>
                </Card>
              </HoverLift>
            </StaggerItem>

            <StaggerItem>
              <HoverLift>
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 flex flex-col flex-1">
                    <PulseOnHover>
                      <MessageSquare className="h-8 w-8 text-primary mb-4" />
                    </PulseOnHover>
                    <h3 className="font-semibold text-lg mb-2">In-App Messaging</h3>
                    <p className="text-muted-foreground text-sm flex-1">
                      Communicate directly with buyers or solvers without leaving the platform.
                    </p>
                  </CardContent>
                </Card>
              </HoverLift>
            </StaggerItem>

            <StaggerItem>
              <HoverLift>
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 flex flex-col flex-1">
                    <PulseOnHover>
                      <FileCheck className="h-8 w-8 text-primary mb-4" />
                    </PulseOnHover>
                    <h3 className="font-semibold text-lg mb-2">Submission Reviews</h3>
                    <p className="text-muted-foreground text-sm flex-1">
                      Review work, provide feedback, and request revisions with version history.
                    </p>
                  </CardContent>
                </Card>
              </HoverLift>
            </StaggerItem>

            <StaggerItem>
              <HoverLift>
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 flex flex-col flex-1">
                    <PulseOnHover>
                      <CreditCard className="h-8 w-8 text-primary mb-4" />
                    </PulseOnHover>
                    <h3 className="font-semibold text-lg mb-2">Secure Payments</h3>
                    <p className="text-muted-foreground text-sm flex-1">
                      Budget tracking and secure payment processing for completed work.
                    </p>
                  </CardContent>
                </Card>
              </HoverLift>
            </StaggerItem>
          </StaggerOnScroll>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground">
                What Our Users Say
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Trusted by professionals and businesses worldwide
              </p>
            </div>
          </FadeInOnScroll>

          <StaggerOnScroll className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <StaggerItem key={index}>
                <HoverLift>
                  <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6 flex flex-col flex-1">
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * i, type: "spring" }}
                          >
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          </motion.div>
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-6 italic flex-1">
                        &ldquo;{testimonial.content}&rdquo;
                      </p>
                      <div className="flex items-center gap-3 mt-auto">
                        <motion.div 
                          className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                        >
                          <span className="text-primary font-semibold">
                            {testimonial.name.charAt(0)}
                          </span>
                        </motion.div>
                        <div>
                          <p className="font-semibold text-sm">{testimonial.name}</p>
                          <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </HoverLift>
              </StaggerItem>
            ))}
          </StaggerOnScroll>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StaggerOnScroll className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StaggerItem>
              <motion.div 
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <PulseOnHover>
                  <BadgeCheck className="h-10 w-10 text-primary mb-3" />
                </PulseOnHover>
                <p className="font-semibold">Verified Profiles</p>
                <p className="text-sm text-muted-foreground">All solvers are verified</p>
              </motion.div>
            </StaggerItem>
            <StaggerItem>
              <motion.div 
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <PulseOnHover>
                  <Shield className="h-10 w-10 text-primary mb-3" />
                </PulseOnHover>
                <p className="font-semibold">Secure Platform</p>
                <p className="text-sm text-muted-foreground">Enterprise-grade security</p>
              </motion.div>
            </StaggerItem>
            <StaggerItem>
              <motion.div 
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <PulseOnHover>
                  <CreditCard className="h-10 w-10 text-primary mb-3" />
                </PulseOnHover>
                <p className="font-semibold">Safe Payments</p>
                <p className="text-sm text-muted-foreground">Escrow protection</p>
              </motion.div>
            </StaggerItem>
            <StaggerItem>
              <motion.div 
                className="flex flex-col items-center"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <PulseOnHover>
                  <Headphones className="h-10 w-10 text-primary mb-3" />
                </PulseOnHover>
                <p className="font-semibold">24/7 Support</p>
                <p className="text-sm text-muted-foreground">Always here to help</p>
              </motion.div>
            </StaggerItem>
          </StaggerOnScroll>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInOnScroll>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Got questions? We&apos;ve got answers
              </p>
            </div>
          </FadeInOnScroll>

          <div className="max-w-3xl mx-auto">
            <StaggerOnScroll className="space-y-4">
              {faqs.map((faq, index) => (
                <StaggerItem key={index}>
                  <HoverLift>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <h3 className="font-semibold mb-2">{faq.question}</h3>
                        <p className="text-muted-foreground text-sm">{faq.answer}</p>
                      </CardContent>
                    </Card>
                  </HoverLift>
                </StaggerItem>
              ))}
            </StaggerOnScroll>
          </div>

          <FadeInOnScroll delay={0.3}>
            <div className="text-center mt-8">
              <p className="text-muted-foreground mb-4">Still have questions?</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/faq">
                  <Button variant="outline" className="group">
                    View All FAQs
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="group">
                    Contact Support
                    <MessageSquare className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  </Button>
                </Link>
              </div>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInOnScroll>
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <Card className="bg-primary text-primary-foreground overflow-hidden relative">
                <div className="absolute inset-0 bg-linear-to-r from-primary to-primary/80" />
                <CardContent className="py-16 text-center relative z-10">
                  <motion.h2 
                    className="text-3xl font-bold mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    Ready to Transform Your Workflow?
                  </motion.h2>
                  <motion.p 
                    className="text-lg opacity-90 mb-8 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    Join thousands of businesses and professionals who trust Task Colab for seamless project collaboration.
                  </motion.p>
                  <motion.div 
                    className="flex flex-col sm:flex-row justify-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {!isAuthenticated ? (
                      <>
                        <Link href="/register">
                          <Button size="lg" variant="secondary" className="group">
                            Get Started Free
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
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
                        <Button size="lg" variant="secondary" className="group">
                          Go to Dashboard
                          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    )}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </FadeInOnScroll>
        </div>
      </section>
    </main>
  );
}
