import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function AgentBuilder() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLocation('/')}
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <img 
                src="/ruka-logo-minimal.svg" 
                alt="Ruka Logo" 
                className="w-8 h-8"
              />
              <span className="font-bold text-lg">Ruka Agent Builder</span>
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs font-bold rounded-full border border-yellow-500/30">
                BETA
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-73px)]">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Agent Builder Coming Soon
          </h1>
          <p className="text-gray-400 text-lg">
            Create custom AI voice agents with just a prompt
          </p>
        </div>
      </div>
    </div>
  );
}