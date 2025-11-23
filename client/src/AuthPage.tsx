import React, { useState } from 'react';
import { 
  Terminal, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Code2, 
  Github, 
  AlertCircle 
} from 'lucide-react';

// --- Assets & Styles ---
const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
    
    :root {
      --font-sans: 'Inter', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }
    
    .font-display { font-family: var(--font-sans); }
    .font-mono { font-family: var(--font-mono); }
  `}</style>
);

// --- Icons ---
const GoogleIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.35 11.1H12V15.13H17.4C17.15 16.38 16.45 17.5 15.35 18.2L15.33 18.28L18.23 20.53L18.43 20.55C20.25 18.88 21.35 16.38 21.35 13.35C21.35 12.55 21.25 11.8 21.08 11.1H21.35Z" />
    <path d="M12 21C14.63 21 16.85 20.13 18.43 18.68L15.35 16.33C14.48 16.93 13.35 17.3 12 17.3C9.45 17.3 7.28 15.58 6.5 13.25L6.42 13.26L3.4 15.6L3.38 15.68C4.95 18.8 8.2 21 12 21Z" />
    <path d="M6.5 13.25C6.3 12.65 6.2 12.03 6.2 11.38C6.2 10.73 6.3 10.1 6.5 9.5L6.49 9.4L3.48 7.07L3.38 7.15C2.65 8.6 2.23 10.25 2.23 12C2.23 13.75 2.65 15.4 3.38 16.85L6.5 13.25Z" />
    <path d="M12 5.44999C13.88 5.44999 15.13 6.25999 15.85 6.93999L18.53 4.31999C16.83 2.72999 14.63 1.74999 12 1.74999C8.2 1.74999 4.95 3.94999 3.38 7.07999L6.5 9.49999C7.28 7.16999 9.45 5.44999 12 5.44999Z" />
  </svg>
);

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  // Handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log(`Authenticated as ${email}`);
    }, 1500);
  };

  return (
    // Full viewport height lock
    <div className="h-screen bg-[#EEE8DF] text-[#2C365A] font-sans flex flex-col md:flex-row overflow-hidden selection:bg-[#C4BCB0] selection:text-[#2C365A]">
      <FontStyles />
      
      {/* --- LEFT PANEL --- */}
      <div className="w-full md:w-1/2 h-full p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#C4BCB0] relative overflow-hidden bg-[#EEE8DF] z-10">
        
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(#2C365A 1px, transparent 1px), linear-gradient(90deg, #2C365A 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }}>
        </div>

        <div className="z-10 relative">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-[#2C365A] flex items-center justify-center rounded-sm shadow-sm">
              <Terminal size={24} color="#EEE8DF" />
            </div>
            <span className="font-mono font-bold tracking-tighter text-2xl">NAISKOS.DEV</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.9] mb-6 font-display uppercase">
            Unified<br/>
            Workflow<br/>
            Intelligence.
          </h1>
          
          <div className="max-w-md border-l-2 border-[#C4BCB0] pl-4">
            <p className="font-mono text-base md:text-lg opacity-80 leading-relaxed">
              Connect Jira, Slack, and GitHub into a single context graph. 
              Accelerate TDD cycles with AI-driven repository analysis.
            </p>
          </div>
        </div>

        <div className="z-10 mt-12 md:mt-0 hidden md:block">
           <div className="border border-[#C4BCB0] bg-[#EEE8DF]/50 backdrop-blur-sm p-6 max-w-md shadow-sm">
             <div className="flex justify-between items-center mb-3 border-b border-[#C4BCB0] pb-2">
                <span className="font-mono text-sm uppercase tracking-widest font-bold">System Status</span>
                <span className="flex items-center gap-1 font-mono text-xs text-[#2C365A] font-bold">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  OPERATIONAL
                </span>
             </div>
             <div className="space-y-2 font-mono text-xs">
               <div className="flex justify-between border-b border-dashed border-[#C4BCB0]/50 pb-1">
                 <span className="opacity-70">Context Graph</span>
                 <span className="font-bold">v4.2.0 [LOADED]</span>
               </div>
               <div className="flex justify-between border-b border-dashed border-[#C4BCB0]/50 pb-1">
                 <span className="opacity-70">Sandbox Environment</span>
                 <span className="font-bold">READY</span>
               </div>
               <div className="flex justify-between">
                 <span className="opacity-70">API Gateways</span>
                 <span className="font-bold">CONNECTED</span>
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* --- RIGHT PANEL (Scrollable) --- */}
      <div className="w-full md:w-1/2 h-full overflow-y-auto bg-[#EEE8DF] relative">
        
        <div className="absolute inset-0 opacity-5 pointer-events-none fixed" 
             style={{ 
               backgroundImage: 'linear-gradient(#2C365A 1px, transparent 1px), linear-gradient(90deg, #2C365A 1px, transparent 1px)', 
               backgroundSize: '40px 40px' 
             }}>
        </div>

        <div className="min-h-full flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md z-10">
            
            <div className="bg-[#EEE8DF] border-2 border-[#2C365A] shadow-[8px_8px_0px_0px_rgba(44,54,90,0.1)] relative">
              
              <div className="flex border-b-2 border-[#2C365A]">
                <button 
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-4 font-mono text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-200 ${isLogin ? 'bg-[#2C365A] text-[#EEE8DF]' : 'hover:bg-[#C4BCB0]/20 text-[#2C365A]'}`}
                >
                  Access / Login
                </button>
                <button 
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-4 font-mono text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-200 ${!isLogin ? 'bg-[#2C365A] text-[#EEE8DF]' : 'hover:bg-[#C4BCB0]/20 text-[#2C365A]'}`}
                >
                  Initialize / Sign Up
                </button>
              </div>

              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {!isLogin && (
                    <div className="space-y-2 group">
                      <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-[#2C365A]/80 group-focus-within:text-[#2C365A]">
                        Developer ID (Username)
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3.5 w-4 h-4 text-[#2C365A] opacity-40 group-focus-within:opacity-100 transition-opacity" />
                        <input 
                          type="text" 
                          className="w-full bg-transparent border border-[#C4BCB0] py-3 pl-10 pr-3 focus:border-[#2C365A] focus:border-2 focus:ring-0 outline-none transition-all placeholder-[#2C365A]/30 font-mono text-sm text-[#2C365A]"
                          placeholder="e.g. dev_01"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 group">
                    <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-[#2C365A]/80 group-focus-within:text-[#2C365A]">
                      Corporate Email
                    </label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3 top-3.5 w-4 h-4 text-[#2C365A] opacity-40 group-focus-within:opacity-100 transition-opacity" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent border border-[#C4BCB0] py-3 pl-10 pr-3 focus:border-[#2C365A] focus:border-2 focus:ring-0 outline-none transition-all placeholder-[#2C365A]/30 font-mono text-sm text-[#2C365A]"
                        placeholder="user@company.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <div className="flex justify-between">
                      <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-[#2C365A]/80 group-focus-within:text-[#2C365A]">
                        Passcode
                      </label>
                      {isLogin && <a href="#" className="font-mono text-[10px] underline opacity-60 hover:opacity-100 transition-opacity">Reset?</a>}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 w-4 h-4 text-[#2C365A] opacity-40 group-focus-within:opacity-100 transition-opacity" />
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-transparent border border-[#C4BCB0] py-3 pl-10 pr-3 focus:border-[#2C365A] focus:border-2 focus:ring-0 outline-none transition-all placeholder-[#2C365A]/30 font-mono text-sm text-[#2C365A]"
                        placeholder="••••••••••••"
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-[#2C365A] text-[#EEE8DF] py-4 px-4 font-mono font-bold uppercase tracking-widest text-sm hover:shadow-[4px_4px_0px_0px_#C4BCB0] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                  >
                    {isLoading ? (
                      <span className="animate-pulse">Authenticating...</span>
                    ) : (
                      <>
                        {isLogin ? 'Establish Connection' : 'Register Terminal'}
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
                
                <div className="mt-8 pt-6 border-t border-[#C4BCB0] flex flex-col items-center gap-4">
                  <span className="font-mono text-[10px] opacity-60 uppercase tracking-widest">Or Connect via SSO</span>
                  <div className="flex gap-3 w-full">
                      <button className="flex-1 flex items-center justify-center gap-2 p-2.5 border border-[#C4BCB0] hover:border-[#2C365A] hover:bg-[#C4BCB0]/10 transition-all rounded-sm group active:bg-[#C4BCB0]/20">
                        <GoogleIcon size={18} />
                        <span className="font-mono text-xs font-bold group-hover:text-[#2C365A]">Google</span>
                      </button>
                      
                      <button className="flex-1 flex items-center justify-center gap-2 p-2.5 border border-[#C4BCB0] hover:border-[#2C365A] hover:bg-[#C4BCB0]/10 transition-all rounded-sm group active:bg-[#C4BCB0]/20">
                        <Github size={18} />
                        <span className="font-mono text-xs font-bold group-hover:text-[#2C365A]">GitHub</span>
                      </button>
                  </div>
                  
                  <div className="w-full flex justify-center pt-2">
                    <button className="flex items-center gap-2 p-2 opacity-50 hover:opacity-100 transition-opacity">
                        <Code2 size={14} />
                        <span className="font-mono text-[10px] border-b border-transparent hover:border-[#2C365A]">Enterprise SSO</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="absolute -top-[2px] -left-[2px] w-3 h-3 border-l-2 border-t-2 border-[#2C365A]"></div>
              <div className="absolute -top-[2px] -right-[2px] w-3 h-3 border-r-2 border-t-2 border-[#2C365A]"></div>
              <div className="absolute -bottom-[2px] -left-[2px] w-3 h-3 border-l-2 border-b-2 border-[#2C365A]"></div>
              <div className="absolute -bottom-[2px] -right-[2px] w-3 h-3 border-r-2 border-b-2 border-[#2C365A]"></div>
              
            </div>

            <div className="mt-6 flex items-start gap-3 text-[#2C365A] opacity-50 px-2">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <p className="font-mono text-[10px] leading-tight">
                By accessing this system, you consent to the Context Graph analyzing your activity across integrated services for workflow optimization purposes. Unauthorized access is prohibited.
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;