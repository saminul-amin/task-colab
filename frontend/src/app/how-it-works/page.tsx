"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/animated-containers";
import {
  UserPlus,
  FileText,
  Search,
  Send,
  CheckCircle2,
  DollarSign,
  Shield,
  MessageSquare,
  ArrowRight,
  Briefcase,
  ShoppingBag,
  Star,
  Zap,
} from "lucide-react";

const buyerSteps = [
  {
    icon: UserPlus,
    title: "Create an Account",
    description: "Sign up as a buyer and complete your profile to get started.",
  },
  {
    icon: FileText,
    title: "Post Your Project",
    description: "Describe your project, set a budget, deadline, and required skills.",
  },
  {
    icon: Search,
    title: "Review Applications",
    description: "Receive applications from problem solvers and review their profiles.",
  },
  {
    icon: CheckCircle2,
    title: "Assign & Collaborate",
    description: "Choose the best fit and work together through our messaging system.",
  },
  {
    icon: Star,
    title: "Review & Complete",
    description: "Review submissions, request revisions if needed, and mark as complete.",
  },
];

const problemSolverSteps = [
  {
    icon: UserPlus,
    title: "Create an Account",
    description: "Sign up as a problem solver and showcase your skills.",
  },
  {
    icon: Search,
    title: "Browse Projects",
    description: "Explore available projects that match your expertise.",
  },
  {
    icon: Send,
    title: "Submit Applications",
    description: "Apply to projects with your proposed approach and timeline.",
  },
  {
    icon: MessageSquare,
    title: "Communicate & Work",
    description: "Once assigned, collaborate with the buyer through our platform.",
  },
  {
    icon: DollarSign,
    title: "Deliver & Get Paid",
    description: "Submit your work and receive payment upon approval.",
  },
];

const features = [
  {
    icon: Shield,
    title: "Secure Platform",
    description: "Your data and transactions are protected with industry-standard security.",
  },
  {
    icon: MessageSquare,
    title: "Built-in Messaging",
    description: "Communicate seamlessly with buyers or problem solvers directly on the platform.",
  },
  {
    icon: Zap,
    title: "Fast & Easy",
    description: "Post projects in minutes and receive applications quickly.",
  },
  {
    icon: Star,
    title: "Quality Talent",
    description: "Connect with skilled professionals ready to solve your problems.",
  },
];

export default function HowItWorksPage() {
  return (
    <FadeIn>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">How Task Colab Works</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Task Colab connects buyers who need problems solved with skilled problem solvers.
            Here&apos;s how you can get started.
          </p>
        </div>

        {/* For Buyers Section */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">For Buyers</h2>
              <p className="text-muted-foreground">Post projects and hire talented problem solvers</p>
            </div>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {buyerSteps.map((step, index) => (
              <StaggerItem key={step.title}>
                <Card className="h-full relative">
                  <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <CardHeader className="pt-6">
                    <step.icon className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-base">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{step.description}</CardDescription>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* For Problem Solvers Section */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">For Problem Solvers</h2>
              <p className="text-muted-foreground">Find projects and showcase your skills</p>
            </div>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {problemSolverSteps.map((step, index) => (
              <StaggerItem key={step.title}>
                <Card className="h-full relative">
                  <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <CardHeader className="pt-6">
                    <step.icon className="h-8 w-8 text-green-600 mb-2" />
                    <CardTitle className="text-base">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{step.description}</CardDescription>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Why Choose Task Colab?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We provide the tools and environment you need for successful collaborations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center">
                <CardHeader>
                  <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-2">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">How do I get paid as a problem solver?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Once your work is approved by the buyer, payment is processed through our platform.
                  We support various payment methods to ensure you receive your earnings securely.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">How do I find the right problem solver?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Review applications, check profiles, and communicate through our messaging system.
                  You can view skills, experience, and previous work before making a decision.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">What happens if I&apos;m not satisfied with the work?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  You can request revisions from the problem solver. If issues persist,
                  our support team is available to help mediate and find a resolution.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Is there a fee to use Task Colab?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Creating an account and browsing projects is free. We charge a small service fee
                  on completed projects to maintain and improve our platform.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-muted/50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Join thousands of buyers and problem solvers on Task Colab.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button size="lg">
                Create Your Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="outline" size="lg">
                Browse Projects
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </FadeIn>
  );
}
