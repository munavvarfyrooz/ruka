import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Phone, Mail, Bot, Clock, Shield, Languages, Bell, Check, Loader2, Sparkles, Heart, Zap, Star, TrendingUp, Users, BarChart3, Building2, User, ArrowRight, Globe, Headphones, Award, ChevronRight, PlayCircle, Rocket, Brain, Target, DollarSign, Wand2, MessageCircle, Calendar, ShoppingBag, GraduationCap, Briefcase, Home, Stethoscope, Coffee } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "libphonenumber-js";
import "react-phone-number-input/style.css";
import "flag-icons/css/flag-icons.min.css";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [callFormData, setCallFormData] = useState({
    name: "",
    phoneNumber: ""
  });
  const [phoneError, setPhoneError] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [promptPlaceholder, setPromptPlaceholder] = useState(0);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const promptExamples = [
    "call my customers who missed appointments and reschedule them",
    "check on my elderly parent every morning at 9am",
    "qualify leads for my solar business and book site visits",
    "take reservations for my restaurant 24/7",
    "practice Spanish conversation with my students"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPromptPlaceholder((prev) => (prev + 1) % promptExamples.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const emailSubscriptionMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("POST", "/api/email-subscription", { email });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.alreadySubscribed) {
        toast({
          title: "Already subscribed",
          description: "This email is already on our list!",
          variant: "default",
        });
      } else {
        toast({
          title: "Subscribed successfully!",
          description: "You'll receive updates about Ruka's performance insights and new capabilities.",
          variant: "default",
        });
      }
      setEmail("");
    },
    onError: (error: any) => {
      toast({
        title: "Subscription failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const callRequestMutation = useMutation({
    mutationFn: async (data: { name: string; phoneNumber: string; email: string }) => {
      const response = await apiRequest("POST", "/api/call-request", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Call request received!",
        description: "Ruka will call you shortly.",
        variant: "default",
      });
      setIsCallDialogOpen(false);
      setCallFormData({ name: "", phoneNumber: "" });
      setPhoneError("");
    },
    onError: (error: any) => {
      toast({
        title: "Request failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    
    if (!validateEmail(trimmedEmail)) {
      setIsEmailValid(false);
      return;
    }
    
    setIsEmailValid(true);
    emailSubscriptionMutation.mutate(trimmedEmail);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (!isEmailValid) {
      setIsEmailValid(true);
    }
  };

  const handleCallFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setPhoneError("");
    
    // Validate name
    if (!callFormData.name || callFormData.name.trim() === "") {
      toast({
        title: "Name required",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }
    
    // Validate phone number
    if (!callFormData.phoneNumber) {
      setPhoneError("Phone number is required");
      return;
    } else if (!isValidPhoneNumber(callFormData.phoneNumber)) {
      setPhoneError("Please enter a valid phone number");
      return;
    }
    
    // Submit with phone number and name
    callRequestMutation.mutate({
      name: callFormData.name.trim(),
      phoneNumber: callFormData.phoneNumber,
      email: "" // No email field in form
    });
  };

  const handleCallFormChange = (field: string, value: string) => {
    setCallFormData(prev => ({ ...prev, [field]: value }));
    if (field === "phoneNumber") setPhoneError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* Subtle gradient orbs for depth */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: "4s" }}></div>
      </div>

      {/* Clean navigation */}
      <nav className="relative z-50 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <span className="font-semibold text-xl">Ruka</span>
          </div>
          <Button 
            onClick={() => setIsCallDialogOpen(true)}
            variant="outline"
            className="border-gray-300 hover:border-gray-400 text-gray-700 rounded-full px-4 py-2 text-sm">
            Try Demo
          </Button>
        </div>
      </nav>

      {/* Hero Section - Clean and Minimal */}
      <section className="relative z-10 px-4 pt-12 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Main heading */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              <span className="block text-gray-900">Your AI Voice Agent</span>
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Just a Prompt Away
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Describe what you need. We'll build it. No coding, no complexity.
            </p>
          </div>

          {/* Interactive Prompt Box */}
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What do you need your agent to do?
              </label>
              <Textarea
                placeholder={`Example: "${promptExamples[promptPlaceholder]}"`}
                className="w-full min-h-[120px] text-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl resize-none transition-all"
                value={currentPrompt}
                onChange={(e) => setCurrentPrompt(e.target.value)}
              />
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Try it free • No credit card required
                </span>
                <Button
                  onClick={() => setLocation('/agent-builder')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-full font-medium"
                  disabled={!currentPrompt.trim()}
                >
                  Create My Agent
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Examples */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <span className="text-sm text-gray-500">Popular:</span>
            {[
              "Appointment booking",
              "Lead qualification",
              "Customer support",
              "Daily check-ins"
            ].map((example) => (
              <button
                key={example}
                onClick={() => setCurrentPrompt(`Create an agent that handles ${example.toLowerCase()}`)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="relative z-10 py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Can You Build?
            </h2>
            <p className="text-lg text-gray-600">
              Real agents, real results. Pick a template or start from scratch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Calendar,
                category: "Business",
                title: "Appointment Scheduler",
                description: "Books meetings, sends reminders, handles rescheduling",
                example: "I need an agent to manage my calendar and coordinate meetings",
                color: "bg-blue-500"
              },
              {
                icon: Heart,
                category: "Personal",
                title: "Family Check-ins",
                description: "Daily wellness calls to elderly parents or loved ones",
                example: "Call my mom every morning to make sure she's okay",
                color: "bg-pink-500"
              },
              {
                icon: TrendingUp,
                category: "Sales",
                title: "Lead Qualifier",
                description: "Screens prospects, books demos with qualified leads",
                example: "Qualify inbound leads and schedule calls with our sales team",
                color: "bg-green-500"
              },
              {
                icon: ShoppingBag,
                category: "E-commerce",
                title: "Order Support",
                description: "Handles returns, tracks shipments, answers questions",
                example: "Help customers with order status and return requests",
                color: "bg-purple-500"
              },
              {
                icon: GraduationCap,
                category: "Education",
                title: "Language Practice",
                description: "Conversational practice in any language",
                example: "Practice Spanish conversations with my students daily",
                color: "bg-orange-500"
              },
              {
                icon: Coffee,
                category: "Restaurant",
                title: "Reservation Agent",
                description: "Takes bookings, manages waitlists, confirms tables",
                example: "Take reservations for my restaurant 24/7",
                color: "bg-amber-500"
              }
            ].map((useCase, i) => (
              <div key={i} className="group cursor-pointer" onClick={() => setCurrentPrompt(useCase.example)}>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-purple-200 transition-all">
                  <div className="flex items-start space-x-4">
                    <div className={`${useCase.color} p-3 rounded-lg text-white flex-shrink-0`}>
                      <useCase.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                        {useCase.category}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {useCase.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {useCase.description}
                      </p>
                      <button className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center group-hover:gap-2 transition-all">
                        Use this template
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Three Steps to Your AI Agent
            </h2>
            <p className="text-lg text-gray-600">
              No technical knowledge required
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Describe Your Need",
                description: "Tell us what you want your agent to do in plain English",
                icon: MessageCircle
              },
              {
                step: "2",
                title: "We Build It",
                description: "Our AI creates a custom voice agent tailored to your requirements",
                icon: Bot
              },
              {
                step: "3",
                title: "Start Calling",
                description: "Your agent is ready to make and receive calls immediately",
                icon: Phone
              }
            ].map((item, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                <div className="hidden sm:block">
                  <item.icon className="h-8 w-8 text-gray-400" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              onClick={() => setLocation('/agent-builder')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full font-medium text-lg"
            >
              Start Building
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="relative z-10 py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ready to Build Your Agent?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands creating AI agents that work while they sleep
          </p>
          
          <div className="space-y-4">
            <Button
              onClick={() => setLocation('/agent-builder')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-medium text-lg"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <p className="text-sm text-gray-500">
              No credit card required • 5 free agents
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials - Clean and Simple */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Loved by Innovators
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "I just described what I needed and Ruka built it perfectly. My appointment no-shows dropped by 80%."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"></div>
                <div>
                  <p className="font-semibold text-gray-900">Dr. Sarah Miller</p>
                  <p className="text-sm text-gray-500">Dental Practice Owner</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Our agent qualifies leads 24/7. It's like having a sales team that never sleeps."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full"></div>
                <div>
                  <p className="font-semibold text-gray-900">Alex Chen</p>
                  <p className="text-sm text-gray-500">SaaS Founder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Ruka</span>
          </div>
          <p className="text-sm text-gray-500">
            © 2025 Ruka. AI agents for everyone.
          </p>
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <a href="mailto:hi@ruka.live" className="hover:text-gray-700 transition-colors">
              hi@ruka.live
            </a>
            <a href="#" className="hover:text-gray-700 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Terms</a>
          </div>
        </div>
      </footer>

      {/* Call Request Dialog - Clean and Simple */}
      <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Try Ruka Live
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Experience an AI agent in action. We'll call you right away.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCallFormSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Your Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={callFormData.name}
                onChange={(e) => handleCallFormChange("name", e.target.value)}
                className="w-full"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <PhoneInput
                id="phone"
                placeholder="Enter your phone number"
                value={callFormData.phoneNumber}
                onChange={(value) => handleCallFormChange("phoneNumber", value || "")}
                defaultCountry="US"
                international
                countryCallingCodeEditable={false}
                className="phone-input"
              />
              {phoneError && (
                <p className="text-sm text-red-600 mt-1">
                  {phoneError}
                </p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              disabled={callRequestMutation.isPending}
            >
              {callRequestMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Get Demo Call"
              )}
            </Button>
            
            <p className="text-center text-xs text-gray-500">
              Free demo • No spam • Cancel anytime
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}