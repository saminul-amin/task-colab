"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/animated-containers";
import { 
  HelpCircle, 
  Search,
  ChevronDown,
  ChevronUp,
  Users,
  Briefcase,
  CreditCard,
  Shield,
  FileCheck,
  MessageSquare,
  ArrowRight
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  questions: FAQItem[];
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const faqCategories: FAQCategory[] = [
    {
      id: "general",
      title: "General",
      icon: HelpCircle,
      questions: [
        {
          question: "What is Task Colab?",
          answer: "Task Colab is a project collaboration marketplace that connects businesses (Buyers) with skilled professionals (Problem Solvers). Buyers can post projects with clear requirements, and Problem Solvers can apply to work on them. The platform provides tools for task management, file submissions, and seamless communication."
        },
        {
          question: "How do I get started?",
          answer: "Simply create a free account by clicking 'Get Started' or 'Register'. During registration, choose whether you want to be a Buyer (to post projects) or a Problem Solver (to work on projects). Once registered, you can immediately start posting or applying for projects."
        },
        {
          question: "Is Task Colab free to use?",
          answer: "We offer a free Starter plan that allows you to post up to 3 projects per month with access to all core features. For more advanced needs, we offer Professional and Enterprise plans with additional features like unlimited projects, priority support, and team collaboration."
        },
        {
          question: "What types of projects can I post?",
          answer: "Task Colab supports a wide range of technical projects including web development, mobile app development, API development, database design, UI/UX design, data analysis, machine learning, and DevOps. If your project involves technical work, it's likely a good fit for our platform."
        },
      ]
    },
    {
      id: "buyers",
      title: "For Buyers",
      icon: Briefcase,
      questions: [
        {
          question: "How do I post a project?",
          answer: "After logging in, navigate to 'My Projects' and click 'Create New Project'. Fill in the project details including title, description, requirements, budget range, and deadline. Be as specific as possible to attract the right Problem Solvers."
        },
        {
          question: "How do I choose the right Problem Solver?",
          answer: "When Problem Solvers apply to your project, you can review their profiles, including their skills, experience, ratings, and past work. You can also read their proposal message explaining why they're a good fit. Take your time to compare applications before accepting one."
        },
        {
          question: "Can I request revisions on submitted work?",
          answer: "Yes! When a Problem Solver submits their work, you can review it and either accept it, reject it, or request revisions with specific feedback. This ensures you get exactly what you need before marking the task as complete."
        },
        {
          question: "How do I break down my project into tasks?",
          answer: "Once you've accepted a Problem Solver, you can create tasks within your project. Each task should have a clear title, description, and due date. Breaking your project into smaller, manageable tasks helps track progress and ensures clear deliverables."
        },
        {
          question: "What if I'm not satisfied with the work?",
          answer: "You have the ability to request revisions on any submission. If issues persist, you can communicate directly with the Problem Solver through our messaging system. For unresolved disputes, our support team is available to help mediate."
        },
      ]
    },
    {
      id: "solvers",
      title: "For Problem Solvers",
      icon: Users,
      questions: [
        {
          question: "How do I find projects to work on?",
          answer: "Navigate to 'Available Projects' to browse all open projects. You can filter by category, budget range, and deadline to find projects that match your skills and availability. Click on any project to view full details and apply."
        },
        {
          question: "How do I write a winning proposal?",
          answer: "A good proposal should: 1) Show you understand the project requirements, 2) Highlight relevant experience and skills, 3) Explain your approach to solving the problem, 4) Provide a realistic timeline. Personalize each proposal rather than using generic templates."
        },
        {
          question: "How do I submit my work?",
          answer: "When working on a task, click 'Submit Work' to upload your deliverables. You'll need to upload a ZIP file containing your work and provide a description of what's included. Make sure your submission is complete and well-organized."
        },
        {
          question: "How do I get paid?",
          answer: "Payment is processed securely through the platform after the Buyer approves your submitted work. Make sure your payment information is up to date in your profile settings. Payments are typically processed within 3-5 business days."
        },
        {
          question: "How can I improve my profile?",
          answer: "Complete all profile sections including your bio, skills, and portfolio. Maintain a high rating by delivering quality work on time. The more successful projects you complete, the more attractive your profile becomes to potential Buyers."
        },
      ]
    },
    {
      id: "payments",
      title: "Payments & Pricing",
      icon: CreditCard,
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for Enterprise plans. All payments are processed securely through encrypted connections."
        },
        {
          question: "Are there any hidden fees?",
          answer: "No hidden fees. Our pricing is transparent and straightforward. The Starter plan is completely free. Paid plans are billed monthly or annually (with a discount for annual billing). Any applicable fees are clearly displayed before checkout."
        },
        {
          question: "Can I get a refund?",
          answer: "We offer a 14-day money-back guarantee for paid plans. If you're not satisfied within the first 14 days, contact our support team for a full refund. After 14 days, you can cancel anytime but refunds are not available."
        },
        {
          question: "How does the budget system work?",
          answer: "When posting a project, Buyers set a budget range (minimum and maximum). This helps Problem Solvers understand the expected compensation. The final payment is agreed upon between the Buyer and the accepted Problem Solver."
        },
      ]
    },
    {
      id: "security",
      title: "Security & Privacy",
      icon: Shield,
      questions: [
        {
          question: "Is my data secure?",
          answer: "Absolutely. We use industry-standard encryption (SSL/TLS) for all data transmission. Your personal information is stored securely and never shared with third parties without your consent. We comply with GDPR and other privacy regulations."
        },
        {
          question: "How are Problem Solvers verified?",
          answer: "All Problem Solvers go through an email verification process. Additionally, their profiles include ratings and reviews from previous work, giving Buyers confidence in who they're working with. We also monitor for suspicious activity."
        },
        {
          question: "What happens to my files after project completion?",
          answer: "Your files remain accessible in your project history for future reference. You can download them at any time. If you delete a project, associated files will be permanently removed after a 30-day grace period."
        },
        {
          question: "Can I delete my account?",
          answer: "Yes, you can delete your account at any time from your profile settings. Please note that this will permanently remove all your data, projects, and history. Make sure to download any important files before deletion."
        },
      ]
    },
    {
      id: "technical",
      title: "Technical & Support",
      icon: FileCheck,
      questions: [
        {
          question: "What file formats can I upload?",
          answer: "For project attachments, we support common document formats (PDF, DOC, DOCX), images (PNG, JPG, GIF), and compressed files (ZIP, RAR). For task submissions, we currently require ZIP files to ensure all deliverables are packaged together. Maximum file size is 50MB."
        },
        {
          question: "How do I contact support?",
          answer: "You can reach our support team through the Contact page, by emailing saminul.amin@gmail.com, or by calling +880 1326 874 247. We aim to respond to all inquiries within 24 hours during business days."
        },
        {
          question: "Is there a mobile app?",
          answer: "Currently, Task Colab is a web-based platform optimized for both desktop and mobile browsers. A dedicated mobile app is on our roadmap for future development."
        },
        {
          question: "What browsers are supported?",
          answer: "Task Colab works best on modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated to the latest version for the best experience."
        },
      ]
    },
  ];

  const toggleItem = (categoryId: string, questionIndex: number) => {
    const key = `${categoryId}-${questionIndex}`;
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isExpanded = (categoryId: string, questionIndex: number) => {
    return expandedItems[`${categoryId}-${questionIndex}`] || false;
  };

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      searchQuery === "" ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => 
    activeCategory === "all" || category.id === activeCategory
  ).filter(category => category.questions.length > 0);

  const totalQuestions = faqCategories.reduce((sum, cat) => sum + cat.questions.length, 0);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-linear-to-b from-card to-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center">
              <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Frequently Asked Questions
              </h1>
              <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
                Find answers to common questions about Task Colab
              </p>

              {/* Search Bar */}
              <div className="mt-8 max-w-xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for answers..."
                    className="pl-10 h-12 text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {totalQuestions} questions across {faqCategories.length} categories
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant={activeCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory("all")}
            >
              All Categories
            </Button>
            {faqCategories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
              >
                <category.icon className="h-4 w-4 mr-2" />
                {category.title}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {filteredCategories.length === 0 ? (
            <FadeIn>
              <div className="text-center py-12">
                <HelpCircle className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or browse all categories.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            </FadeIn>
          ) : (
            <StaggerContainer className="space-y-10">
              {filteredCategories.map((category) => (
                <StaggerItem key={category.id}>
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <category.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">{category.title}</h2>
                    </div>
                    
                    <div className="space-y-3">
                      {category.questions.map((faq, index) => (
                        <Card 
                          key={index} 
                          className={`transition-all ${isExpanded(category.id, index) ? 'shadow-md' : ''}`}
                        >
                          <button
                            className="w-full text-left"
                            onClick={() => toggleItem(category.id, index)}
                          >
                            <CardContent className="pt-6 pb-6">
                              <div className="flex items-start justify-between gap-4">
                                <h3 className="font-semibold text-foreground pr-4">
                                  {faq.question}
                                </h3>
                                {isExpanded(category.id, index) ? (
                                  <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                                )}
                              </div>
                              {isExpanded(category.id, index) && (
                                <p className="text-muted-foreground mt-4 leading-relaxed">
                                  {faq.answer}
                                </p>
                              )}
                            </CardContent>
                          </button>
                        </Card>
                      ))}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* Still Need Help Section */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Still Have Questions?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Can&apos;t find what you&apos;re looking for? Our support team is here to help.
              </p>
              <Link href="/contact">
                <Button>
                  Contact Support
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
