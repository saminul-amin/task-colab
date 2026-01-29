"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/animated-containers";
import { 
  Target, 
  Users, 
  Lightbulb, 
  Heart, 
  Globe, 
  Award,
  ArrowRight,
  Linkedin,
  Twitter
} from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description: "We're committed to creating meaningful connections between talented professionals and businesses with real challenges to solve.",
    },
    {
      icon: Users,
      title: "Community First",
      description: "Our platform thrives because of our community. We prioritize building tools that empower both buyers and problem solvers.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We constantly evolve our platform based on user feedback and emerging technologies to deliver the best experience.",
    },
    {
      icon: Heart,
      title: "Integrity",
      description: "Transparency and fairness are at the core of everything we do. We believe in honest work and fair compensation.",
    },
  ];

  const stats = [
    { value: "500+", label: "Projects Delivered" },
    { value: "200+", label: "Active Solvers" },
    { value: "50+", label: "Countries Reached" },
    { value: "98%", label: "Satisfaction Rate" },
  ];

  const team = [
    {
      name: "Alex Thompson",
      role: "CEO & Co-Founder",
      bio: "Former engineering lead at a Fortune 500 company with 15+ years of experience in building scalable platforms.",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Sarah Mitchell",
      role: "CTO & Co-Founder",
      bio: "Full-stack developer and system architect passionate about creating tools that make collaboration seamless.",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Michael Chen",
      role: "Head of Product",
      bio: "Product strategist with a background in UX design, focused on building user-centric experiences.",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Emily Davis",
      role: "Head of Operations",
      bio: "Operations expert who ensures smooth platform functioning and exceptional customer support.",
      linkedin: "#",
      twitter: "#",
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-linear-to-b from-card to-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                About Task Colab
              </h1>
              <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">
                We&apos;re building the future of project collaboration—connecting talented problem 
                solvers with businesses that need their expertise.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Task Colab was born from a simple observation: finding the right talent for 
                    technical projects shouldn&apos;t be complicated. Traditional freelance platforms 
                    often lack the project management tools needed for complex work.
                  </p>
                  <p>
                    Founded in 2024, we set out to create a platform that combines the flexibility 
                    of freelancing with the structure of professional project management. Our goal 
                    is to make collaboration seamless, transparent, and rewarding for everyone involved.
                  </p>
                  <p>
                    Today, Task Colab serves hundreds of businesses and skilled professionals 
                    worldwide, helping them achieve their goals through meaningful collaboration.
                  </p>
                </div>
              </div>
            </FadeIn>
            <FadeIn>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <Card key={index} className="text-center">
                    <CardContent className="pt-6">
                      <p className="text-3xl font-bold text-primary">{stat.value}</p>
                      <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <Globe className="h-12 w-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-xl text-muted-foreground">
                To democratize access to talent and opportunity by creating a platform where 
                great work happens—regardless of geography, background, or company size.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">Our Values</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <Card className="h-full flex flex-col">
                  <CardContent className="pt-6 flex flex-col flex-1 text-center">
                    <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm flex-1">{value.description}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">Meet Our Team</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                The people behind Task Colab
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <StaggerItem key={member.name}>
                <Card className="h-full flex flex-col">
                  <CardContent className="pt-6 flex flex-col flex-1 text-center">
                    <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-primary">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-sm text-primary mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm flex-1">{member.bio}</p>
                    <div className="flex justify-center gap-3 mt-4">
                      <a href={member.linkedin} className="text-muted-foreground hover:text-primary transition-colors">
                        <Linkedin className="h-5 w-5" />
                      </a>
                      <a href={member.twitter} className="text-muted-foreground hover:text-primary transition-colors">
                        <Twitter className="h-5 w-5" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Awards/Recognition Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center">
              <Award className="h-12 w-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-foreground mb-6">Recognition</h2>
              <div className="flex flex-wrap justify-center gap-8 text-muted-foreground">
                <div className="text-center">
                  <p className="font-semibold">Product Hunt</p>
                  <p className="text-sm">#1 Product of the Day</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">TechCrunch</p>
                  <p className="text-sm">Startup to Watch 2025</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">G2 Crowd</p>
                  <p className="text-sm">High Performer 2025</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Join Our Journey
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Whether you&apos;re looking to hire talent or find exciting projects, 
                we&apos;d love to have you as part of our community.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/register">
                  <Button size="lg">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
