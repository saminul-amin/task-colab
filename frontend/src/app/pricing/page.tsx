"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/animated-containers";
import { Check, Zap, Building2, Rocket, HelpCircle } from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      icon: Zap,
      description: "Perfect for individuals and small projects",
      price: "Free",
      period: "",
      features: [
        "Post up to 3 projects/month",
        "Access to verified problem solvers",
        "Basic task management",
        "In-app messaging",
        "Email support",
      ],
      cta: "Get Started",
      ctaVariant: "outline" as const,
      popular: false,
    },
    {
      name: "Professional",
      icon: Rocket,
      description: "For growing businesses with more needs",
      price: "$29",
      period: "/month",
      features: [
        "Unlimited projects",
        "Priority solver matching",
        "Advanced task management",
        "File versioning & history",
        "Priority support",
        "Analytics dashboard",
        "Team collaboration (up to 5)",
      ],
      cta: "Start Free Trial",
      ctaVariant: "default" as const,
      popular: true,
    },
    {
      name: "Enterprise",
      icon: Building2,
      description: "For large teams with custom requirements",
      price: "Custom",
      period: "",
      features: [
        "Everything in Professional",
        "Unlimited team members",
        "Custom integrations",
        "Dedicated account manager",
        "SLA guarantees",
        "Advanced security features",
        "Custom onboarding",
        "API access",
      ],
      cta: "Contact Sales",
      ctaVariant: "outline" as const,
      popular: false,
    },
  ];

  const faqs = [
    {
      question: "Can I switch plans later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
    },
    {
      question: "Is there a free trial for paid plans?",
      answer: "Yes, all paid plans come with a 14-day free trial. No credit card required to start.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Absolutely. You can cancel your subscription at any time with no cancellation fees.",
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
                Simple, Transparent Pricing
              </h1>
              <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose the plan that fits your needs. All plans include our core features.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <StaggerItem key={plan.name}>
                <Card className={`h-full flex flex-col relative ${plan.popular ? "border-primary border-2 shadow-lg" : ""}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <plan.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1">
                    <ul className="space-y-3 flex-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/register" className="mt-8">
                      <Button 
                        variant={plan.ctaVariant} 
                        className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90" : ""}`}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">
                All Plans Include
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Essential features available on every plan
              </p>
            </div>
          </FadeIn>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              "Secure file uploads",
              "Real-time notifications",
              "Project tracking",
              "Submission reviews",
              "In-app messaging",
              "Mobile responsive",
              "SSL encryption",
              "99.9% uptime",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12">
              <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground">
                Frequently Asked Questions
              </h2>
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
            
            <div className="text-center mt-8">
              <Link href="/faq">
                <Button variant="outline">
                  View All FAQs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of businesses and freelancers already using Task Colab.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/register">
                  <Button size="lg">
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Contact Sales
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
