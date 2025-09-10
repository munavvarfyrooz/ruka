import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Phone, Mail, Bot, Clock, Shield, Languages, Bell, Check, Loader2, Sparkles, Heart, Zap, Star, TrendingUp, Users, BarChart3, Building2, User } from "lucide-react";
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
    <div className="min-h-screen flex flex-col items-center justify-center px-3 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-16 relative overflow-hidden">
      {/* Professional Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full blur-3xl opacity-10 animate-float" style={{ animationDuration: "10s" }}></div>
        <div className="absolute bottom-32 right-16 w-48 h-48 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-full blur-3xl opacity-10 animate-float" style={{ animationDuration: "12s", animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-br from-blue-700 to-indigo-700 rounded-full blur-2xl opacity-10 animate-float" style={{ animationDuration: "8s", animationDelay: "4s" }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-gradient-to-br from-slate-600 to-blue-600 rounded-full blur-3xl opacity-10 animate-float" style={{ animationDuration: "14s", animationDelay: "1s" }}></div>
      </div>
      
      
      {/* Ruka Logo/Brand Header */}
      <div className="absolute top-4 sm:top-6 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-3 animate-reveal-up opacity-0" style={{ animationDelay: "0s", animationFillMode: "both" }}>
            {/* Minimal Professional Logo */}
            <div className="text-xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
              R.
            </div>
            <div>
              <span className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white">
                Ruka
              </span>
              <span className="text-xs block text-gray-600 dark:text-gray-400 font-medium">
                AI Calling Assistant
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4 animate-reveal-up opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "both" }}>
            <div className="hidden sm:flex items-center space-x-2 md:space-x-3 text-xs text-gray-600 dark:text-gray-400">
              <span className="hidden md:flex items-center space-x-1 transition-smooth hover:text-blue-600">
                <Users className="h-3 w-3" />
                <span>Enterprise Ready</span>
              </span>
              <span className="hidden md:inline">•</span>
              <span className="flex items-center space-x-1 transition-smooth hover:text-blue-600">
                <Shield className="h-3 w-3" />
                <span>SOC 2</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-4 sm:space-y-8 pt-16 sm:pt-24">
        {/* Hero Section */}
        <div className="space-y-3 sm:space-y-6">
          {/* Business Badge with urgency */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-lg shadow-sm border border-green-200 dark:border-green-800 animate-reveal-scale opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Live Now: Ruka Managing 47 Active Sales Calls</span>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">• 2.3M+ calls completed</span>
          </div>
          
          <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight tracking-tight px-2 sm:px-0">
            <span className="block text-gray-900 dark:text-white mb-2 animate-reveal-up opacity-0" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>Meet Ruka</span>
            <span className="relative inline-block animate-reveal-up opacity-0" style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
              <span className="gradient-text">
                Your AI Calling Agent
              </span>
            </span>
          </h1>
          
          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 font-medium max-w-3xl mx-auto leading-relaxed px-2 sm:px-4 animate-reveal-up opacity-0" style={{ animationDelay: "0.5s", animationFillMode: "both" }}>
            Stop losing leads after hours. Ruka works 24/7 with the expertise of your top performer - qualifying prospects, professionally handling objections, and booking quality meetings while your team focuses on high-value deals.
            <span className="block mt-3 text-xs sm:text-base lg:text-lg text-gray-700 dark:text-gray-400 flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-4 animate-reveal-up opacity-0" style={{ animationDelay: "0.6s", animationFillMode: "both" }}>
              <span className="flex items-center space-x-1 transition-smooth hover:text-blue-600">
                <Check className="h-4 w-4 text-green-600" />
                <span>$2.4M Revenue Generated</span>
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center space-x-1 transition-smooth hover:text-blue-600">
                <Check className="h-4 w-4 text-green-600" />
                <span>73% Lead-to-Meeting Rate</span>
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center space-x-1 transition-smooth hover:text-blue-600">
                <Check className="h-4 w-4 text-green-600" />
                <span>$0.12 per Call</span>
              </span>
            </span>
          </p>
        </div>

        {/* CTA Section */}
        <div className="animate-reveal-up hover-lift opacity-0" style={{ animationDelay: "0.7s", animationFillMode: "both" }}>
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 sm:p-8 rounded-2xl shadow-2xl max-w-md mx-2 sm:mx-auto border-0 relative overflow-hidden transition-smooth">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/10 rounded-full blur-xl"></div>
            
            <div className="text-center space-y-4 sm:space-y-6 relative z-10">
              {/* Business Icon */}
              <div className="relative inline-block">
                <div className="bg-white/10 backdrop-blur-sm w-14 h-14 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto ring-2 ring-white/20">
                  <Phone className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white flex items-center justify-center">
                  <Check className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                </div>
              </div>
              
              {/* Call to Action Text with testimonial */}
              <div className="space-y-2 sm:space-y-3">
                <div className="inline-flex items-center space-x-2 bg-yellow-400/20 px-3 py-1 rounded-full animate-pulse">
                  <Star className="h-3 w-3 text-yellow-300" />
                  <p className="text-xs font-semibold text-yellow-100 uppercase tracking-wider">Limited Spots This Month</p>
                </div>
                <p className="text-white text-lg sm:text-2xl font-bold px-2">
                  Watch Ruka Convert a Lead in 60 Seconds
                </p>
                <p className="text-white/90 text-sm px-2 italic">
                  "Ruka booked 127 qualified meetings in our first week" - TechCorp CEO
                </p>
              </div>
              
              {/* Call Button with stronger CTA */}
              <Button 
                onClick={() => setIsCallDialogOpen(true)}
                className="w-full bg-white text-blue-700 font-bold py-4 sm:py-5 px-6 sm:px-8 rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-xl text-base sm:text-lg group relative overflow-hidden"
                data-testid="button-call-agent"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent animate-shimmer"></span>
                <Phone className="mr-2 h-5 w-5 animate-pulse" />
                <span className="relative">Experience Ruka Live - Demo Call</span>
              </Button>
              
              <div className="flex items-center justify-center space-x-3 text-white/80 text-xs">
                <span className="flex items-center space-x-1">
                  <Shield className="h-3 w-3" />
                  <span>No Credit Card</span>
                </span>
                <span className="text-white/40">•</span>
                <span className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>Instant Demo</span>
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* ROI Value Proposition */}
        <div className="animate-reveal-up opacity-0 max-w-2xl mx-2 sm:mx-auto mb-4 sm:mb-8" style={{ animationDelay: "0.85s", animationFillMode: "both" }}>
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-4 sm:p-6 rounded-xl border border-green-200 dark:border-green-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="text-center sm:text-left">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Your Monthly ROI with Ruka:</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">Save $47,000/month</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Based on 3 SDR salaries + benefits</p>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="text-center">
                  <p className="font-bold text-gray-900 dark:text-white">Before</p>
                  <p className="text-red-600">$50,000/mo</p>
                </div>
                <span className="text-2xl">→</span>
                <div className="text-center">
                  <p className="font-bold text-gray-900 dark:text-white">After</p>
                  <p className="text-green-600">$3,000/mo</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Email Section */}
        <div className="animate-reveal-up hover-lift max-w-md mx-2 sm:mx-auto opacity-0" style={{ animationDelay: "0.9s", animationFillMode: "both" }}>
          <Card className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 relative overflow-hidden hover:border-blue-300 dark:hover:border-blue-600 transition-smooth">
            {/* Top gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            
            <div className="text-center space-y-2 sm:space-y-3 mb-4">
              <div className="flex items-center justify-center space-x-2">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                <p className="text-gray-700 dark:text-gray-300 font-semibold text-sm sm:text-base">
                  Stay Informed
                </p>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 px-2">
                Get enterprise insights and product updates
              </p>
            </div>
            
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full px-4 py-3 rounded-xl pr-10 ${
                    !isEmailValid 
                      ? "border-red-500 focus:ring-red-500" 
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200`}
                  data-testid="input-email"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                {!isEmailValid && (
                  <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
                )}
              </div>
              
              <Button
                type="submit"
                disabled={emailSubscriptionMutation.isPending || !email.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                data-testid="button-email-submit"
              >
                {emailSubscriptionMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    <span className="hidden xs:inline">Subscribing...</span>
                    <span className="xs:hidden">Loading...</span>
                  </>
                ) : emailSubscriptionMutation.isSuccess ? (
                  <>
                    <Check className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden xs:inline">You're In! Check Your Email</span>
                    <span className="xs:hidden">Success!</span>
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Get Early Access + 30% Off</span>
                    <span className="sm:hidden">Get 30% Off</span>
                  </>
                )}
              </Button>
            </form>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
              🔥 Join 2,847 sales leaders getting exclusive AI insights weekly
            </p>
          </Card>
        </div>

        {/* Feature Highlights with Outcomes */}
        <div className="pt-4 sm:pt-8 pb-6 sm:pb-12 px-2 sm:px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover-lift hover:border-blue-300 dark:hover:border-blue-600 transition-smooth animate-reveal-up opacity-0" style={{ animationDelay: "1.1s", animationFillMode: "both" }}>
              <div className="flex flex-col items-center space-y-1.5 sm:space-y-2">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-2 sm:p-3 rounded-xl">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-gray-100 text-center">3x More Qualified Leads</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 text-center">Ruka screens 1000s daily</span>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover-lift hover:border-blue-300 dark:hover:border-blue-600 transition-smooth animate-reveal-up opacity-0" style={{ animationDelay: "1.2s", animationFillMode: "both" }}>
              <div className="flex flex-col items-center space-y-1.5 sm:space-y-2">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-2 sm:p-3 rounded-xl">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-gray-100 text-center">Calendar Fills Itself</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 text-center">Zero manual booking</span>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover-lift hover:border-blue-300 dark:hover:border-blue-600 transition-smooth animate-reveal-up opacity-0" style={{ animationDelay: "1.3s", animationFillMode: "both" }}>
              <div className="flex flex-col items-center space-y-1.5 sm:space-y-2">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-2 sm:p-3 rounded-xl">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-gray-100 text-center">Syncs With Your CRM</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 text-center">HubSpot, Salesforce, etc</span>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover-lift hover:border-blue-300 dark:hover:border-blue-600 transition-smooth animate-reveal-up opacity-0" style={{ animationDelay: "1.4s", animationFillMode: "both" }}>
              <div className="flex flex-col items-center space-y-1.5 sm:space-y-2">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 p-2 sm:p-3 rounded-xl">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-gray-100 text-center">87% Show Rate</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 text-center">Ruka nurtures every lead</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Social Proof Section */}
        <div className="pt-4 sm:pt-6 pb-8 sm:pb-12 px-4 animate-reveal-up opacity-0" style={{ animationDelay: "1.5s", animationFillMode: "both" }}>
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Trusted by Industry Leaders</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">2.3M+</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Calls Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">73%</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Conversion Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-purple-600">$0.12</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Cost Per Call</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-orange-600">4.9/5</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Customer Rating</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                  "Ruka replaced 3 SDRs and increased our qualified pipeline by 400% in 30 days"
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">- Sarah Chen, VP Sales at TechCorp</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="relative mt-6 sm:mt-8 pt-6 sm:pt-8 text-center z-10 border-t border-gray-200/50 dark:border-gray-700/50 px-4">
          <div className="space-y-2">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              © 2025 Ruka Business Solutions<span className="hidden sm:inline"> • Your AI Sales Partner</span>
            </p>
            <a 
              href="https://ruka.live" 
              className="inline-flex items-center justify-center space-x-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              <Building2 className="h-3 w-3" />
              <span>ruka.live</span>
            </a>
          </div>
        </div>
      </div>

      {/* Call Request Dialog */}
      <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen}>
        <DialogContent className="w-[90%] max-w-lg mx-auto border-0 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden p-0 max-h-[90vh] overflow-y-auto">
          {/* Premium gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950 opacity-50" />
          
          <div className="relative z-10">
            {/* Header with modern design - no blue line */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 sm:px-8 sm:py-6">
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
                  <div className="bg-white/20 backdrop-blur-sm p-2 sm:p-2.5 rounded-xl">
                    <Phone className="h-6 w-6 text-white animate-pulse" />
                  </div>
                  Your AI Sales Rep is Ready
                </DialogTitle>
                <DialogDescription className="text-blue-50 text-sm sm:text-base">
                  Watch Ruka close a deal in real-time - 60 second demo
                </DialogDescription>
              </DialogHeader>
            </div>
            
            {/* Form section with better spacing */}
            <form onSubmit={handleCallFormSubmit} className="p-6 sm:p-8 space-y-4 sm:space-y-6">
              {/* Name input field */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  Your Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={callFormData.name}
                  onChange={(e) => handleCallFormChange("name", e.target.value)}
                  className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                  data-testid="input-name"
                />
              </div>
              
              {/* Phone input with better styling */}
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="custom-phone-input">
                  <PhoneInput
                    id="phone"
                    placeholder="Enter your phone number"
                    value={callFormData.phoneNumber}
                    onChange={(value) => handleCallFormChange("phoneNumber", value || "")}
                    defaultCountry="IN"
                    international
                    countryCallingCodeEditable={false}
                    className="phone-input-modern"
                    data-testid="input-phone"
                  />
                </div>
                {phoneError && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-2" data-testid="text-phone-error">
                    <span className="text-xs">⚠</span> {phoneError}
                  </p>
                )}
              </div>
              
              {/* Trust badges */}
              <div className="flex items-center justify-center gap-3 sm:gap-6 py-2 sm:py-3 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Instant Callback</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5" />
                  <span>AI Powered</span>
                </div>
              </div>

              {/* Submit button with premium styling */}
              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                disabled={callRequestMutation.isPending}
                data-testid="button-submit-call"
              >
                {callRequestMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Ruka is Dialing Your Number...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Start My 60-Second Demo
                  </>
                )}
              </Button>
              
              {/* Footer text with urgency */}
              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                ⚡ Only 3 demo slots remaining today • No credit card required
              </p>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
