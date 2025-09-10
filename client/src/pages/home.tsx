import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Phone, Mail, Bot, Clock, Shield, Languages, Bell, Check, Loader2, Sparkles, Heart, Zap, Star, TrendingUp, Users, BarChart3, Building2, User, ArrowRight, Globe, Headphones, Award, ChevronRight, PlayCircle, Rocket, Brain, Target, DollarSign, Wand2 } from "lucide-react";
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
  const { toast } = useToast();
  const [, setLocation] = useLocation();

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
      {/* Animated gradient background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/30 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-[100px] animate-spin-slow"></div>
      </div>

      {/* Mobile-optimized navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-4 safe-top animate-slide-down">
        <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xl max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img 
              src="/ruka-logo-minimal.svg" 
              alt="Ruka Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-lg hover:scale-110 transition-transform duration-300"
            />
            <span className="font-bold text-base sm:text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Ruka</span>
          </div>
          <div className="hidden lg:flex items-center space-x-6 text-sm">
            <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-purple-400 transition-colors">Pricing</a>
            <a href="#about" className="hover:text-purple-400 transition-colors">About</a>
            <a href="mailto:hi@ruka.live" className="hover:text-purple-400 transition-colors flex items-center gap-1">
              <Mail className="h-4 w-4" />
              hi@ruka.live
            </a>
          </div>
          <Button 
            onClick={() => setIsCallDialogOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 rounded-full px-3 sm:px-6 py-2 text-xs sm:text-sm shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all">
            <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" strokeWidth={2.5} fill="none" />
            <span className="hidden xs:inline">Call Now</span>
            <span className="xs:hidden">Call</span>
          </Button>
        </div>
      </nav>

      {/* Hero Section - Mobile optimized */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-32 sm:pt-36 pb-12 sm:py-20">
        <div className="max-w-7xl mx-auto text-center space-y-6 sm:space-y-8">
          {/* Animated badge - Mobile optimized */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm px-3 sm:px-6 py-2 sm:py-3 rounded-full border border-purple-500/30 animate-float">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm font-medium">AI-Powered Sales Revolution</span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
          </div>

          {/* Main heading - Mobile responsive */}
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-tight sm:leading-none">
              <span className="block text-white mb-2 sm:mb-4 animate-slide-up">The Future of</span>
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto] animate-slide-up" style={{ animationDelay: "0.1s" }}>
                Sales Automation
              </span>
              <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-400 mt-4 sm:mt-6 font-light animate-slide-up" style={{ animationDelay: "0.2s" }}>
                is calling
              </span>
            </h1>

            <p className="text-base sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in px-2" style={{ animationDelay: "0.3s" }}>
              Meet Ruka — Your AI agent that never sleeps, never stops, and 
              <span className="text-purple-400 font-semibold"> converts 73% better</span> than human SDRs
            </p>
            
            {/* Contact Email */}
            <div className="flex items-center justify-center gap-2 text-lg text-gray-300 animate-fade-in" style={{ animationDelay: "0.35s" }}>
              <Mail className="h-5 w-5 text-purple-400" />
              <a href="mailto:hi@ruka.live" className="hover:text-purple-400 transition-colors">
                hi@ruka.live
              </a>
            </div>
          </div>

          {/* Interactive CTA section - Mobile optimized */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-6 sm:pt-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button 
              onClick={() => setIsCallDialogOpen(true)}
              className="group relative w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl font-bold text-base sm:text-lg shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              <span className="relative flex items-center justify-center">
                <div className="relative mr-2 sm:mr-3">
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-md animate-pulse"></div>
                  <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-white animate-bounce relative z-10 drop-shadow-lg" strokeWidth={3} fill="none" />
                </div>
                Experience Ruka Live
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <Button 
              onClick={() => setIsCallDialogOpen(true)}
              variant="outline" 
              className="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 bg-white/10 backdrop-blur-xl border-white/30 hover:bg-white/20 text-white rounded-2xl font-bold text-base sm:text-lg hover:scale-105 transition-all duration-300"
            >
              <Headphones className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 drop-shadow-lg" strokeWidth={2.5} />
              <span className="hidden sm:inline">Listen to Ruka in Action</span>
              <span className="sm:hidden">Hear Demo</span>
            </Button>
          </div>

          {/* Create Your Own Agent Button - New Feature */}
          <div className="pt-6 animate-fade-in" style={{ animationDelay: "0.45s" }}>
            <Button
              onClick={() => setLocation('/create')}
              className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-2xl font-semibold text-sm sm:text-base shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transform hover:scale-105 transition-all duration-300"
            >
              <span className="absolute -top-2 -right-2 px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full animate-pulse">
                NEW
              </span>
              <span className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 sm:h-5 sm:w-5" />
                Create Your Own Agent
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </div>

          {/* Floating metrics - Mobile optimized with solid icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-8 sm:pt-12 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: "0.5s" }}>
            {[
              { icon: Phone, value: "2.3M+", label: "Calls Made", color: "from-purple-500 to-pink-500" },
              { icon: TrendingUp, value: "73%", label: "Conversion", color: "from-green-500 to-emerald-500" },
              { icon: DollarSign, value: "$0.12", label: "Per Call", color: "from-blue-500 to-cyan-500" },
              { icon: Star, value: "4.9/5", label: "Rating", color: "from-yellow-500 to-orange-500" }
            ].map((metric, i) => (
              <div key={i} className="group hover:scale-105 transition-transform duration-300">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/10 hover:border-white/20 transition-all relative overflow-hidden">
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    {/* Icon with premium 3D effect and animation */}
                    <div className="relative mb-2 sm:mb-3">
                      {/* Animated glow pulse */}
                      <div className={`absolute inset-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${metric.color} rounded-lg sm:rounded-xl blur-xl opacity-60 group-hover:opacity-100 animate-pulse`}></div>
                      {/* Main icon container with 3D effect */}
                      <div className={`relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${metric.color} rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-2xl`}>
                        {/* Inner gradient for depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/30 rounded-lg sm:rounded-xl"></div>
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent rounded-lg sm:rounded-xl opacity-70"></div>
                        <metric.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white relative z-10 drop-shadow-lg" strokeWidth={3} fill="currentColor" />
                      </div>
                    </div>
                    <div className="text-xl sm:text-3xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{metric.value}</div>
                    <div className="text-xs sm:text-sm text-gray-400 mt-1">{metric.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creative feature cards section - Mobile optimized */}
      <section className="relative z-10 py-12 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-16 space-y-2 sm:space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Superpowers Included
            </h2>
            <p className="text-base sm:text-xl text-gray-400">Everything you need to 10x your sales</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                icon: Brain,
                title: "AI Brain",
                description: "Learns from every call, gets smarter every day",
                gradient: "from-purple-600 to-pink-600"
              },
              {
                icon: Target,
                title: "Perfect Targeting",
                description: "Qualifies leads with surgical precision",
                gradient: "from-green-600 to-emerald-600"
              },
              {
                icon: Rocket,
                title: "Instant Scale",
                description: "Handle 10,000 calls simultaneously",
                gradient: "from-blue-600 to-cyan-600"
              },
              {
                icon: Globe,
                title: "Global Reach",
                description: "Speaks 50+ languages fluently",
                gradient: "from-orange-600 to-red-600"
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "SOC2, GDPR, HIPAA compliant",
                gradient: "from-indigo-600 to-purple-600"
              },
              {
                icon: Award,
                title: "Best in Class",
                description: "Industry-leading performance metrics",
                gradient: "from-yellow-600 to-orange-600"
              }
            ].map((feature, i) => (
              <div key={i} className="group animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="relative h-full bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:border-white/20 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative mb-4 sm:mb-6">
                    {/* Premium icon with 3D effect and animations */}
                    <div className={`absolute -inset-1 bg-gradient-to-br ${feature.gradient} rounded-xl sm:rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 animate-pulse`}></div>
                    {/* Rotating glow ring */}
                    <div className={`absolute inset-0 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.gradient} rounded-xl sm:rounded-2xl opacity-30 group-hover:opacity-50 animate-spin-slow`}></div>
                    {/* Main icon container with premium styling */}
                    <div className={`relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-2xl border border-white/20`}>
                      {/* Multi-layer gradient for depth */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/40 rounded-xl sm:rounded-2xl"></div>
                      {/* Animated shine sweep */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:animate-shine"></div>
                      {/* Premium icon styling */}
                      <feature.icon className="h-7 w-7 sm:h-9 sm:w-9 text-white relative z-10 drop-shadow-2xl group-hover:scale-110 transition-transform" strokeWidth={3} fill="none" />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 group-hover:text-purple-400 transition-colors">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator with glassmorphism - Mobile optimized */}
      <section className="relative z-10 py-12 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 animate-pulse"></div>
            <div className="relative z-10 text-center space-y-4 sm:space-y-6">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Your Monthly Savings
              </h3>
              <div className="text-4xl sm:text-6xl md:text-7xl font-black text-white">
                $47,000
              </div>
              <p className="text-sm sm:text-lg text-gray-400">
                Based on replacing 3 SDRs with Ruka
              </p>
              <div className="flex justify-center items-center space-x-4 sm:space-x-8 pt-4 sm:pt-6">
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">Before</p>
                  <p className="text-xl sm:text-3xl font-bold text-red-400">$50,000/mo</p>
                </div>
                <ArrowRight className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400 animate-pulse" />
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm">After</p>
                  <p className="text-xl sm:text-3xl font-bold text-green-400">$3,000/mo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Email subscription with creative design */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative bg-black/50 backdrop-blur-xl border border-white/20 rounded-3xl p-12">
              <div className="text-center space-y-6">
                <div className="relative inline-block mb-4">
                  {/* Premium animated glow */}
                  <div className="absolute -inset-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-2xl opacity-50 animate-pulse"></div>
                  <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl opacity-30 animate-spin-slow"></div>
                  {/* Premium icon container with 3D effect */}
                  <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl border border-white/30 hover:scale-110 transition-transform duration-300">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/30 rounded-2xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent rounded-2xl"></div>
                    <Mail className="h-10 w-10 text-white relative z-10 drop-shadow-2xl" strokeWidth={3} fill="none" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold">Join the Revolution</h3>
                <p className="text-gray-400">Get exclusive insights from 2,847 sales leaders</p>
                
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={handleEmailChange}
                      className={`w-full px-6 py-4 bg-white/10 backdrop-blur-xl border ${
                        !isEmailValid ? "border-red-500" : "border-white/30"
                      } rounded-2xl text-white placeholder-gray-400 focus:bg-white/20 focus:border-purple-500 transition-all`}
                      required
                    />
                    {!isEmailValid && (
                      <p className="text-red-400 text-sm mt-2">Please enter a valid email</p>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={emailSubscriptionMutation.isPending}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
                  >
                    {emailSubscriptionMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5 drop-shadow-lg animate-pulse" strokeWidth={3} fill="currentColor" />
                        Get Early Access
                      </>
                    )}
                  </Button>
                </form>
                
                <p className="text-sm text-gray-500">
                  🔥 Limited spots available this month
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof with modern design */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <div className="flex items-start space-x-4">
                <img 
                  src="https://ui-avatars.com/api/?name=Sarah+Chen&background=gradient&color=fff&size=80" 
                  alt="Sarah Chen"
                  className="w-16 h-16 rounded-2xl"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-gray-300 italic mb-4">
                    "Ruka replaced 3 SDRs and increased our qualified pipeline by 400% in just 30 days. 
                    The ROI is absolutely insane."
                  </p>
                  <div>
                    <p className="font-bold text-white">Sarah Chen</p>
                    <p className="text-sm text-gray-400">VP Sales, TechCorp</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <div className="flex items-start space-x-4">
                <img 
                  src="https://ui-avatars.com/api/?name=Michael+Torres&background=gradient&color=fff&size=80" 
                  alt="Michael Torres"
                  className="w-16 h-16 rounded-2xl"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-gray-300 italic mb-4">
                    "We booked 127 qualified meetings in our first week. Ruka doesn't just call — 
                    it understands our product better than most of our team."
                  </p>
                  <div>
                    <p className="font-bold text-white">Michael Torres</p>
                    <p className="text-sm text-gray-400">CEO, StartupCo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Get in Touch
            </h3>
            <p className="text-gray-400 mb-6">
              Ready to revolutionize your sales? Contact us today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a href="mailto:hi@ruka.live" className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl hover:bg-white/20 transition-all group">
                <Mail className="h-5 w-5 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-white font-semibold">hi@ruka.live</span>
              </a>
              <Button 
                onClick={() => setIsCallDialogOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl font-semibold">
                <Phone className="h-5 w-5" />
                Schedule a Demo Call
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <img 
              src="/ruka-logo-minimal.svg" 
              alt="Ruka Logo" 
              className="w-10 h-10"
            />
            <span className="font-bold text-lg">Ruka</span>
          </div>
          <p className="text-sm text-gray-400">
            © 2025 Ruka. Revolutionizing sales, one call at a time.
          </p>
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <a href="mailto:hi@ruka.live" className="hover:text-purple-400 transition-colors flex items-center gap-1">
              <Mail className="h-4 w-4" />
              hi@ruka.live
            </a>
            <a href="#" className="hover:text-purple-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Terms</a>
            <a href="https://ruka.live" className="hover:text-purple-400 transition-colors">ruka.live</a>
          </div>
        </div>
      </footer>

      {/* Call Request Dialog - Modern design */}
      <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen}>
        <DialogContent className="w-[90%] max-w-lg mx-auto border-0 bg-black/90 backdrop-blur-xl shadow-2xl overflow-hidden p-0 max-h-[90vh] overflow-y-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50" />
          
          <div className="relative z-10">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-white/40 rounded-xl blur-xl animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/40 shadow-2xl">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/20 rounded-xl"></div>
                      <Phone className="h-6 w-6 text-white animate-pulse relative z-10 drop-shadow-lg" strokeWidth={3} fill="none" />
                    </div>
                  </div>
                  Ready to Experience Magic?
                </DialogTitle>
                <DialogDescription className="text-purple-100">
                  Watch Ruka close a deal in 60 seconds
                </DialogDescription>
              </DialogHeader>
            </div>
            
            <form onSubmit={handleCallFormSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-400 drop-shadow-md" strokeWidth={3} fill="none" />
                  Your Name <span className="text-pink-400">*</span>
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={callFormData.name}
                  onChange={(e) => handleCallFormChange("name", e.target.value)}
                  className="h-12 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:bg-white/20 focus:border-purple-500 transition-all"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-purple-400 drop-shadow-md" strokeWidth={3} fill="none" />
                  Phone Number <span className="text-pink-400">*</span>
                </label>
                <div className="custom-phone-input-dark">
                  <PhoneInput
                    id="phone"
                    placeholder="Enter your phone number"
                    value={callFormData.phoneNumber}
                    onChange={(value) => handleCallFormChange("phoneNumber", value || "")}
                    defaultCountry="IN"
                    international
                    countryCallingCodeEditable={false}
                    className="phone-input-dark"
                  />
                </div>
                {phoneError && (
                  <p className="text-sm text-pink-400 flex items-center gap-1 mt-2">
                    <span>⚠</span> {phoneError}
                  </p>
                )}
              </div>
              
              <div className="flex items-center justify-center gap-6 py-3 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5 text-green-400" strokeWidth={3} fill="none" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-blue-400" strokeWidth={3} fill="none" />
                  <span>Instant</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-yellow-400" strokeWidth={3} fill="currentColor" />
                  <span>AI Powered</span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
                disabled={callRequestMutation.isPending}
              >
                {callRequestMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Connecting to Ruka...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-5 w-5 animate-bounce" strokeWidth={3} fill="none" />
                    Start My Demo Call
                  </>
                )}
              </Button>
              
              <p className="text-center text-xs text-gray-500">
                ⚡ Limited demo slots • No credit card required
              </p>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}