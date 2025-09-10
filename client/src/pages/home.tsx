import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
// import { RukaAvatar } from "@/components/RukaAvatar";
import { Phone, Shield, Check, Loader2, Sparkles, Heart, Zap, TrendingUp, ArrowRight, Rocket, Brain, MessageCircle, Calendar, ShoppingBag, GraduationCap, Coffee, Mic } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
    "an agent that books appointments for my salon",
    "a friendly voice to check on my mom daily",
    "a sales agent that qualifies leads 24/7",
    "a receptionist for my medical practice",
    "a tutor that helps students practice languages"
  ];

  // const [rukaMood, setRukaMood] = useState<"happy" | "thinking" | "excited" | "winking" | "speaking">("happy");
  // const [rukaMessage, setRukaMessage] = useState("Hi! I'm Ruka 💜");

  useEffect(() => {
    const interval = setInterval(() => {
      setPromptPlaceholder((prev) => (prev + 1) % promptExamples.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   // Update Ruka's mood based on user input
  //   if (currentPrompt.length > 0) {
  //     setRukaMood("thinking");
  //     setRukaMessage("That sounds interesting...");
  //   } else {
  //     setRukaMood("happy");
  //     setRukaMessage("Tell me what you need!");
  //   }
  // }, [currentPrompt]);

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
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated gradient background - Ruka theme */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-pink-900/30"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-[100px] animate-spin-slow"></div>
      </div>

      {/* Call Ruka for Help Button - Fixed Position Bottom Right */}
      <div className="fixed bottom-4 right-4 z-50 safe-area-inset-bottom">
        <Button
          onClick={() => setIsCallDialogOpen(true)}
          variant="outline"
          className="bg-black/80 backdrop-blur-xl border border-purple-500/30 hover:border-purple-500/50 text-purple-300 hover:text-purple-200 px-3 py-2 rounded-full font-medium text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-1 sm:gap-2"
        >
          <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="hidden xs:inline">Call Ruka for Help</span>
        </Button>
      </div>

      {/* Navigation with Ruka branding */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-2 sm:p-4 safe-area-inset-top">
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl px-3 sm:px-6 py-2 sm:py-3 shadow-2xl max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img 
                src="/ruka-logo-minimal.svg" 
                alt="Ruka Logo" 
                className="w-7 h-7 sm:w-10 sm:h-10 drop-shadow-lg"
              />
              <span className="font-bold text-sm sm:text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Ruka</span>
            </div>
            <Button
              onClick={() => setIsCallDialogOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-1 sm:gap-2"
            >
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline sm:inline">Experience Ruka</span>
              <span className="xs:hidden">Try</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Ruka Character */}
      <section className="relative z-10 px-3 sm:px-4 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Ruka Avatar */}
          <div className="flex justify-center mb-6 sm:mb-8 animate-fade-in">
            <div className="relative">
              {/* Glow effect behind avatar */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-2xl sm:blur-3xl animate-pulse"></div>
              <picture>
                <source srcSet="/ruka-avatar-hq.webp" type="image/webp" />
                <source srcSet="/ruka-avatar-hq.png" type="image/png" />
                <img 
                  src="/ruka-avatar-hq.png" 
                  alt="Ruka - Your AI Assistant"
                  className="relative z-10 w-32 h-32 xs:w-36 xs:h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 object-cover rounded-full border-2 sm:border-4 border-purple-500/20 shadow-2xl animate-float"
                  loading="eager"
                  width="400"
                  height="600"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    (e.target as HTMLImageElement).src = "/ruka-avatar-placeholder.svg";
                  }}
                  style={{
                    animation: "float 3s ease-in-out infinite",
                  }}
                />
              </picture>
            </div>
          </div>

          {/* Main heading with powerful taglines */}
          <div className="text-center space-y-3 sm:space-y-4">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl font-black leading-tight">
              <span className="block text-white mb-1 sm:mb-2">Your 24/7 Voice</span>
              <span className="block text-xl xs:text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Powered by Ruka
              </span>
            </h1>
            
            <div className="space-y-2 pt-2 sm:pt-4">
              <p className="text-lg xs:text-xl sm:text-2xl text-gray-300 font-semibold">
                Describe it. Deploy it. Done.
              </p>
              <p className="text-xs xs:text-sm sm:text-base text-gray-400 max-w-xl mx-auto px-4 sm:px-0">
                Create AI agents that answer phone calls, book appointments, qualify leads, and handle customer support - all in your brand's voice.
              </p>
            </div>
          </div>

          {/* Interactive Prompt Box with Ruka Theme */}
          <div className="mt-8 sm:mt-10 max-w-3xl mx-auto">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
              
              <div className="relative bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Mic className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400 flex-shrink-0" />
                  <label className="text-xs sm:text-sm font-medium text-purple-300">
                    Step 1: Describe your dream voice agent
                  </label>
                </div>
                
                <Textarea
                  placeholder={`Try: "${promptExamples[promptPlaceholder]}"`}
                  className="w-full min-h-[100px] sm:min-h-[140px] text-sm sm:text-base md:text-lg bg-white/5 border-white/10 text-white placeholder-gray-400 focus:bg-white/10 focus:border-purple-500 rounded-xl sm:rounded-2xl resize-none transition-all"
                  value={currentPrompt}
                  onChange={(e) => setCurrentPrompt(e.target.value)}
                />
                
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
                      <span className="hidden xs:inline">Instant setup</span>
                      <span className="xs:hidden">Instant</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                      <span className="hidden xs:inline">Enterprise secure</span>
                      <span className="xs:hidden">Secure</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => {
                      setTimeout(() => setLocation('/agent-builder'), 500);
                    }}
                    className="group w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-105 transition-all duration-300"
                    disabled={!currentPrompt.trim()}
                  >
                    <Sparkles className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
                    Create My Agent
                    <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Transparent Pricing Model */}
          <div className="mt-6 sm:mt-10 flex justify-center px-4">
            <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg sm:rounded-xl p-3 sm:p-4 w-full sm:w-auto max-w-lg">
              <div className="flex flex-col xs:flex-row items-center justify-center gap-2 xs:gap-3 sm:gap-4">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-gray-200 whitespace-nowrap">No Setup Fees</span>
                </div>
                <div className="hidden xs:block h-4 w-px bg-gray-600"></div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-gray-200 whitespace-nowrap">No Hidden Costs</span>
                </div>
                <div className="hidden xs:block h-4 w-px bg-gray-600"></div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-gray-200 whitespace-nowrap">Pay As You Go</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Examples with Ruka style */}
          <div className="mt-6 sm:mt-8 px-4 sm:px-0">
            <p className="text-center text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">Or try one of these popular templates:</p>
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
              {[
                { label: "📅 Appointment Scheduler", prompt: "an agent that books appointments and sends reminders" },
                { label: "📞 Sales Qualifier", prompt: "a sales agent that qualifies leads 24/7" },
                { label: "👩‍⚕️ Medical Receptionist", prompt: "a receptionist for my medical practice" },
                { label: "❤️ Family Check-ins", prompt: "a caring voice to check on elderly parents daily" }
              ].map((example) => (
                <button
                  key={example.label}
                  onClick={() => {
                    setCurrentPrompt(example.prompt);
                  }}
                  className="group px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 text-gray-300 hover:text-white rounded-full text-xs sm:text-sm transition-all duration-300 hover:scale-105"
                >
                  {example.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section with Ruka Theme */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Your Voice, Any Role
            </h2>
            <p className="text-lg text-gray-300">
              From sales to support. Available 24/7. Never tired, never off.
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
              <div key={i} className="group cursor-pointer" onClick={() => {
                setCurrentPrompt(useCase.example);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}>
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 overflow-hidden">
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative flex items-start space-x-4">
                    <div className={`${useCase.color} bg-opacity-20 backdrop-blur-sm p-3 rounded-xl border border-white/10 group-hover:scale-110 transition-transform duration-300`}>
                      <useCase.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-purple-400 uppercase tracking-wider mb-1">
                        {useCase.category}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                        {useCase.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-3">
                        {useCase.description}
                      </p>
                      <button className="text-sm text-purple-400 hover:text-purple-300 font-medium flex items-center group-hover:gap-2 transition-all">
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
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Three Steps to Your AI Agent
            </h2>
            <p className="text-lg text-gray-400">
              No technical knowledge required
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Tell Me Your Dream",
                description: "Describe what you need in your own words. I speak human!",
                icon: MessageCircle,
                color: "from-purple-500 to-purple-600"
              },
              {
                step: "2",
                title: "I'll Build It For You",
                description: "Using my AI brain, I create your perfect voice agent in seconds",
                icon: Sparkles,
                color: "from-pink-500 to-pink-600"
              },
              {
                step: "3",
                title: "Go Live Instantly",
                description: "Your agent starts working immediately. No setup, no waiting.",
                icon: Rocket,
                color: "from-purple-500 to-pink-500"
              }
            ].map((item, i) => (
              <div key={i} className="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300">
                <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
                <div className="hidden sm:block">
                  <item.icon className="h-8 w-8 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
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
      <section className="relative z-10 py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20"></div>
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Build Your Agent?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
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

      {/* Core Capabilities - Professional */}
      <section className="relative z-10 py-20 px-4 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Enterprise-Grade Voice AI Platform
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Deploy intelligent voice agents that scale with your business needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-lg p-8 hover:border-gray-700 transition-colors">
              <div className="w-14 h-14 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                <Rocket className="h-7 w-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Instant Deployment</h3>
              <p className="text-gray-400 leading-relaxed">
                Go from concept to live agent in under a minute. No technical setup, no complex configurations.
              </p>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-lg p-8 hover:border-gray-700 transition-colors">
              <div className="w-14 h-14 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6">
                <Brain className="h-7 w-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Advanced AI Models</h3>
              <p className="text-gray-400 leading-relaxed">
                State-of-the-art language models ensure natural, context-aware conversations every time.
              </p>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-lg p-8 hover:border-gray-700 transition-colors">
              <div className="w-14 h-14 bg-green-500/10 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Enterprise Security</h3>
              <p className="text-gray-400 leading-relaxed">
                Bank-level encryption, data isolation, and compliance with global privacy standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="relative z-10 pt-16 pb-8 px-4 bg-black/50 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/ruka-logo-minimal.svg" 
                  alt="Ruka" 
                  className="w-10 h-10"
                />
                <div>
                  <span className="font-bold text-xl text-white">Ruka</span>
                  <p className="text-xs text-gray-500">Voice AI Platform</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 max-w-xs">
                Creating intelligent voice agents that understand, engage, and deliver results for businesses worldwide.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Use Cases</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="mailto:hi@ruka.live" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partners</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-500">
              © 2024 Ruka Technologies, Inc. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-500 mt-4 md:mt-0">
              <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Call Request Dialog - Clean and Simple */}
      <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Experience Ruka
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
                defaultCountry="IN"
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