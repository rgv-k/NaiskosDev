import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ArrowRight, 
  Menu, 
  Globe, 
  Server, 
  Database, 
  Layers, 
  GitBranch, 
  AlertCircle, 
  CheckCircle2,
  Github,
  Mail,
  Code,
  Terminal,
  MessageSquare,
  Moon,
  Sun,
  Cloud,
  Box,
  Cpu,
  Loader2,
  XCircle,
  CheckSquare,
  Plus,
  X
} from 'lucide-react';

// --- Assets & Styles ---
const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
    
    :root {
      --font-sans: 'Inter', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }
    
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #C4BCB0; }
    ::-webkit-scrollbar-thumb:hover { background: #2C365A; }

    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
);

// --- Types ---
interface Activity {
  id: string | number;
  type: 'issue' | 'pr' | 'alert' | 'message' | 'email';
  source: string;
  title: string;
  desc: string;
  time: string;
  link?: string;
  meta?: {
    owner?: string;
    repo?: string;
    number?: number;
  }
}

interface AppDefinition {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
}

// --- App Catalog (Available services to add) ---
const APP_CATALOG: Record<string, AppDefinition> = {
  'github': { id: 'github', name: 'GitHub', icon: <Github size={48} />, connected: false },
  'jira': { id: 'jira', name: 'Jira', icon: <Layers size={48} />, connected: false },
  'aws': { id: 'aws', name: 'AWS', icon: <Cloud size={48} />, connected: false },
  'docker': { id: 'docker', name: 'Docker', icon: <Box size={48} />, connected: false },
  'slack': { id: 'slack', name: 'Slack', icon: <MessageSquare size={48} />, connected: false },
  'vercel': { id: 'vercel', name: 'Vercel', icon: <Globe size={48} />, connected: false },
  'db': { id: 'db', name: 'Database', icon: <Database size={48} />, connected: false },
};

const quickAccess = [
  { id: 1, name: 'GitHub', icon: <Github size={24} />, shortcut: 'CMD+1' },
  { id: 2, name: 'VS Code', icon: <Code size={24} />, shortcut: 'CMD+2' },
  { id: 3, name: 'Jira', icon: <Layers size={24} />, shortcut: 'CMD+3' },
];

// --- Components ---
const AppIconCard = ({ app }: { app: AppDefinition }) => (
  <div className="min-w-[200px] h-[200px] bg-[#EEE8DF] border border-[#C4BCB0] flex items-center justify-center relative group hover:border-[#2C365A] hover:bg-[#C4BCB0]/10 transition-all cursor-pointer animate-in fade-in zoom-in duration-300">
    <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#C4BCB0] group-hover:border-[#2C365A]" />
    <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#C4BCB0] group-hover:border-[#2C365A]" />
    
    <div className="text-[#2C365A] group-hover:scale-110 transition-transform duration-300">
      {app.icon}
    </div>
    
    <div className="absolute bottom-4 flex flex-col items-center gap-1">
      <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#2C365A] opacity-0 group-hover:opacity-100 transition-opacity">
        {app.name}
      </div>
      <div className="flex items-center gap-1 text-[10px] text-green-600 font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
        ONLINE
      </div>
    </div>
  </div>
);

const AddAppCard = ({ onClick }: { onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="min-w-[200px] h-[200px] border-2 border-dashed border-[#C4BCB0] flex flex-col items-center justify-center gap-4 text-[#C4BCB0] hover:border-[#2C365A] hover:text-[#2C365A] hover:bg-[#C4BCB0]/5 transition-all cursor-pointer group"
  >
    <Plus size={48} className="opacity-50 group-hover:opacity-100 transition-opacity" />
    <span className="font-mono text-xs font-bold uppercase tracking-widest opacity-50 group-hover:opacity-100">
      Add Service
    </span>
  </div>
);

const ActivityItem = ({ item, onClose }: { item: Activity, onClose: (item: Activity) => void }) => (
  <div className="border border-[#C4BCB0] bg-[#EEE8DF] hover:border-[#2C365A] transition-all group relative overflow-hidden flex flex-col">
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2C365A] opacity-0 group-hover:opacity-100 transition-opacity" />
    
    <a 
      href={item.link || '#'} 
      target="_blank" 
      rel="noopener noreferrer"
      className="p-4 block flex-1"
    >
      <div className="flex justify-between items-start mb-1 pl-2">
        <span className="font-mono text-[10px] uppercase font-bold text-[#2C365A]/60 flex items-center gap-1">
          {item.source}
        </span>
        <span className="font-mono text-[10px] text-[#2C365A]/40">
          {item.time}
        </span>
      </div>
      <h4 className="font-sans font-bold text-sm text-[#2C365A] mb-1 pl-2 group-hover:text-[#2C365A] line-clamp-1">
        {item.title}
      </h4>
      <p className="font-mono text-[10px] text-[#2C365A]/70 pl-2 leading-relaxed truncate">
        {item.desc}
      </p>
    </a>

    {item.source === 'GitHub' && (
      <div className="h-0 group-hover:h-10 transition-all duration-300 bg-[#C4BCB0]/20 border-t border-[#C4BCB0] flex items-center justify-end px-4 gap-4 overflow-hidden">
        <button 
          onClick={(e) => {
            e.preventDefault();
            onClose(item);
          }}
          className="flex items-center gap-1 font-mono text-[10px] font-bold text-[#2C365A] hover:text-red-600 transition-colors uppercase tracking-wider"
        >
          <CheckSquare size={12} />
          Close Issue
        </button>
      </div>
    )}
  </div>
);

const QuickAccessCard = ({ tool }: { tool: any }) => (
  <div className="h-full bg-[#EEE8DF] border border-[#C4BCB0] p-4 flex flex-col justify-between hover:bg-[#2C365A] hover:text-[#EEE8DF] group transition-colors cursor-pointer">
    <div className="flex justify-between items-start">
      <div className="text-[#2C365A] group-hover:text-[#EEE8DF]">
        {tool.icon}
      </div>
      <ArrowRight size={16} className="text-[#2C365A] opacity-0 group-hover:opacity-100 group-hover:text-[#EEE8DF] -translate-x-2 group-hover:translate-x-0 transition-all" />
    </div>
    <div className="flex justify-between items-end">
      <span className="font-sans font-bold text-lg">{tool.name}</span>
      <span className="font-mono text-[10px] bg-[#C4BCB0]/20 px-1 py-0.5 rounded group-hover:bg-[#EEE8DF]/20">
        {tool.shortcut}
      </span>
    </div>
  </div>
);

const AddServiceModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (id: string) => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C365A]/20 backdrop-blur-sm">
      <div className="bg-[#EEE8DF] border-2 border-[#2C365A] w-full max-w-lg p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#2C365A] hover:rotate-90 transition-transform">
          <X size={24} />
        </button>
        
        <h2 className="font-sans font-bold text-2xl text-[#2C365A] mb-2">ADD INTEGRATION</h2>
        <p className="font-mono text-xs text-[#2C365A]/60 mb-6">Select a service to connect to your ecosystem.</p>

        <div className="grid grid-cols-2 gap-4">
          {Object.values(APP_CATALOG).map(app => (
            <button
              key={app.id}
              onClick={() => onAdd(app.id)}
              className="flex items-center gap-3 p-4 border border-[#C4BCB0] hover:bg-[#2C365A] hover:text-[#EEE8DF] transition-all group text-left"
            >
              <div className="text-[#2C365A] group-hover:text-[#EEE8DF] scale-75 origin-left">
                {app.icon}
              </div>
              <span className="font-mono font-bold uppercase text-sm">{app.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatusPage: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [myApps, setMyApps] = useState<AppDefinition[]>([]); // Only connected apps
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- API LOGIC ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const newActivities: Activity[] = [];
      const connectedAppsList: AppDefinition[] = [];
      const SERVER_URL = 'http://localhost:5000';

      try {
        // 1. Fetch GitHub
        const ghRes = await fetch(`${SERVER_URL}/api/github/prs`);
        if (ghRes.ok) {
          // Add GitHub to connected apps
          connectedAppsList.push(APP_CATALOG['github']);
          
          const ghData = await ghRes.json();
          if (ghData.items) {
            newActivities.push(...ghData.items.map((item: any) => {
              const urlParts = item.repository_url.split('/');
              const repo = urlParts[urlParts.length - 1];
              const owner = urlParts[urlParts.length - 2];
              return {
                id: `gh-${item.id}`,
                type: item.pull_request ? 'pr' : 'issue',
                source: 'GitHub',
                title: item.title,
                desc: `Repo: ${owner}/${repo} • #${item.number}`,
                time: new Date(item.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                link: item.html_url,
                meta: { owner, repo, number: item.number }
              };
            }));
          }
        }

        // 2. Fetch Jira
        const jiraRes = await fetch(`${SERVER_URL}/api/jira/issues`);
        if (jiraRes.ok) {
          // Add Jira to connected apps
          connectedAppsList.push(APP_CATALOG['jira']);

          const jiraData = await jiraRes.json();
          if (jiraData.issues) {
            newActivities.push(...jiraData.issues.map((issue: any) => ({
              id: `jira-${issue.id}`,
              type: 'issue' as const,
              source: 'Jira',
              title: `${issue.key}: ${issue.fields.summary}`,
              desc: `Priority: ${issue.fields.priority.name} • Status: ${issue.fields.status.name}`,
              time: new Date(issue.fields.updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              link: issue.self
            })));
          }
        }
      } catch (err) {
        console.error("Backend Connection Error:", err);
      }

      // If no real data, use mock for demo purposes ONLY if needed
      // Logic: If I successfully connected to 0 apps, I might show nothing or just the 'Add' button.
      // Current requirement: "only the apps we have successfully connected to".
      
      setMyApps(connectedAppsList);
      setActivities(newActivities);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleAddApp = (appId: string) => {
    // In a real app, this would trigger an OAuth flow or config form.
    // Here we simulate a successful connection.
    const appToAdd = APP_CATALOG[appId];
    if (appToAdd && !myApps.find(a => a.id === appId)) {
      setMyApps(prev => [...prev, appToAdd]);
    }
    setIsModalOpen(false);
  };

  const handleCloseItem = async (item: Activity) => {
    if (item.source !== 'GitHub' || !item.meta) return;
    setActivities(prev => prev.filter(a => a.id !== item.id));
    try {
      await fetch('http://localhost:5000/api/github/issues/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner: item.meta.owner, repo: item.meta.repo, number: item.meta.number })
      });
    } catch (err) {
      console.error(err);
      setActivities(prev => [item, ...prev]);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setScrollProgress(value);
    if (scrollContainerRef.current) {
      const maxScroll = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollLeft = (value / 100) * maxScroll;
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const percentage = (scrollLeft / maxScroll) * 100;
      setScrollProgress(percentage);
    }
  };

  const theme = isDarkMode 
    ? { bg: 'bg-[#0f1219]', text: 'text-[#EEE8DF]', border: 'border-[#2C365A]', muted: 'text-[#EEE8DF]/60' }
    : { bg: 'bg-[#EEE8DF]', text: 'text-[#2C365A]', border: 'border-[#C4BCB0]', muted: 'text-[#2C365A]/60' };

  return (
    <div className={`h-screen ${theme.bg} ${theme.text} font-sans flex flex-col overflow-hidden selection:bg-[#C4BCB0] selection:text-[#2C365A] transition-colors duration-300`}>
      <FontStyles />

      {/* --- HEADER --- */}
      <header className={`h-16 border-b ${theme.border} flex items-center justify-between px-6 z-20 relative shrink-0`}>
        <div className="flex items-center gap-4">
          <button className={`p-2 hover:bg-[#C4BCB0]/20 transition-colors rounded-sm`}>
            <Menu size={20} />
          </button>
          <div className={`h-6 w-px ${isDarkMode ? 'bg-[#2C365A]' : 'bg-[#C4BCB0]'}`} />
          <span className="font-mono font-bold tracking-tighter text-lg flex items-center gap-2">
            <div className={`w-4 h-4 ${isDarkMode ? 'bg-[#EEE8DF]' : 'bg-[#2C365A]'}`} />
            DEV.ECOSYSTEM
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            <span className={`font-mono text-xs font-bold uppercase tracking-wider ${theme.muted}`}>
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </span>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${isDarkMode ? 'bg-[#2C365A] border border-[#C4BCB0]' : 'bg-[#C4BCB0]'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-[#EEE8DF] shadow-sm transition-all duration-300 flex items-center justify-center ${isDarkMode ? 'left-[22px]' : 'left-0.5'}`}>
                {isDarkMode ? <Moon size={10} className="text-[#2C365A]" /> : <Sun size={10} className="text-[#C4BCB0]" />}
              </div>
            </div>
          </div>
          <div className={`w-8 h-8 ${isDarkMode ? 'bg-[#EEE8DF] text-[#2C365A]' : 'bg-[#2C365A] text-[#EEE8DF]'} flex items-center justify-center font-bold font-mono text-xs rounded-sm`}>
            JS
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* --- MAIN CONTENT (Center Grid) --- */}
        <main className="flex-1 flex flex-col p-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none" 
               style={{ 
                 backgroundImage: `linear-gradient(${isDarkMode ? '#C4BCB0' : '#2C365A'} 1px, transparent 1px), linear-gradient(90deg, ${isDarkMode ? '#C4BCB0' : '#2C365A'} 1px, transparent 1px)`, 
                 backgroundSize: '40px 40px' 
               }}>
          </div>

          <div className="z-10 h-full flex flex-col">
            <div className="flex-1 flex flex-col justify-center min-h-0 mb-8">
              {/* Apps Carousel */}
              <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex gap-6 overflow-x-auto no-scrollbar pb-10 px-2 items-center"
              >
                {/* 1. Only Render Connected Apps */}
                {myApps.map(app => (
                  <AppIconCard key={app.id} app={app} />
                ))}

                {/* 2. Add New App Card (Always at the end) */}
                <AddAppCard onClick={() => setIsModalOpen(true)} />
              </div>

              <div className="px-10 mt-4">
                <div className="relative h-8 flex items-center">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={scrollProgress}
                    onChange={handleSliderChange}
                    className="w-full h-1 bg-[#C4BCB0] rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#2C365A] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#EEE8DF]"
                  />
                </div>
                <div className="flex justify-between font-mono text-[10px] uppercase font-bold opacity-40">
                  <span>Start</span>
                  <span>End</span>
                </div>
              </div>
            </div>

            <div className="h-32 grid grid-cols-3 gap-6 shrink-0">
              {quickAccess.map(tool => (
                <QuickAccessCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        </main>

        {/* --- RIGHT SIDEBAR (Incoming Changes) --- */}
        <aside className={`w-80 border-l ${theme.border} ${theme.bg} flex flex-col z-20 shrink-0`}>
          <div className={`p-4 border-b ${theme.border}`}>
            <div className="relative">
              <Search className={`absolute left-3 top-3 w-4 h-4 opacity-50 ${theme.text}`} />
              <input 
                type="text" 
                placeholder="Search Updates..." 
                className={`w-full bg-transparent border ${theme.border} py-2 pl-10 pr-10 font-mono text-xs focus:border-[#2C365A] outline-none transition-colors placeholder-current opacity-70 focus:opacity-100`}
              />
              <button className={`absolute right-2 top-2 p-1 hover:bg-[#C4BCB0]/20`}>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className={`font-mono text-[10px] uppercase tracking-widest font-bold opacity-50 mb-4 ${theme.text}`}>
              Incoming Changes
            </div>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-40 opacity-50 gap-2">
                <Loader2 className="animate-spin" size={24} />
                <span className="font-mono text-[10px]">SYNCING STREAMS...</span>
              </div>
            ) : (
              activities.map(item => (
                <ActivityItem 
                  key={item.id} 
                  item={item} 
                  onClose={handleCloseItem} 
                />
              ))
            )}
            
            {!isLoading && activities.length === 0 && (
               <div className={`border border-dashed ${theme.border} p-3 opacity-30 flex justify-center items-center h-24`}>
                 <span className="font-mono text-[10px]">ALL CAUGHT UP</span>
              </div>
            )}
          </div>
        </aside>

        {/* --- ADD SERVICE MODAL --- */}
        <AddServiceModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onAdd={handleAddApp} 
        />

      </div>
    </div>
  );
};

export default StatusPage;