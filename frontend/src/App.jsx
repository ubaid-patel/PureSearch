import { useState, useEffect, useRef, useMemo } from "react";
import { Routes, Route, useNavigate, useSearchParams } from "react-router-dom";
import { Moon, Sun, Command, Sparkles, Globe, Palette, ChevronDown, SlidersHorizontal, GripVertical } from "lucide-react";
import SearchBar from "./components/SearchBar";
import Results from "./components/Results";
import { searchQuery } from "./services/api";

export const ENV = import.meta.env.VITE_MODE || "live"; 

export const PROGRAMMATIC_PRIORITIES = [
  { engine: "brave", priority: 2 },
  { engine: "google", priority: 1 },
  { engine: "duckduckgo", priority: 4 },
  { engine: "bing", priority: 3 },
  { engine: "wikipedia", priority: 5 }
];

const FONT_OPTIONS = [
  { id: "font-sans", label: "Modern" },
  { id: "font-serif", label: "Classic" },
  { id: "font-mono", label: "Tech" },
];

export const glassStyle = "bg-white/40 dark:bg-[#121212]/50 backdrop-blur-xl border border-white/60 dark:border-zinc-800/60 shadow-xl";

export default function App() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [activeFont, setActiveFont] = useState(FONT_OPTIONS[2].id);
  
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  
  const [enginePriorities, setEnginePriorities] = useState(
    [...PROGRAMMATIC_PRIORITIES].sort((a, b) => a.priority - b.priority)
  );

  const fontMenuRef = useRef(null);
  const filterMenuRef = useRef(null);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (fontMenuRef.current && !fontMenuRef.current.contains(event.target)) setIsFontMenuOpen(false);
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) setIsFilterMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Theme effect
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  // Drag and Drop Logic
  const handleDragStart = (index) => dragItem.current = index;
  const handleDragEnter = (index) => dragOverItem.current = index;
  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    if (dragItem.current === null || dragOverItem.current === null) return;
    
    const copyListItems = [...enginePriorities];
    const dragItemContent = copyListItems[dragItem.current];
    
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    
    dragItem.current = null;
    dragOverItem.current = null;

    const updatedPriorities = copyListItems.map((item, index) => ({
      ...item,
      priority: index + 1
    }));
    setEnginePriorities(updatedPriorities);
  };

  // Universal route trigger
  const handleSearchTrigger = (q) => {
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className={`h-screen w-full overflow-hidden transition-colors duration-500 ${activeFont} bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 flex flex-col items-center relative selection:bg-indigo-500/30`}>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.4); border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(82, 82, 91, 0.6); }
      `}</style>

      {/* Persistent Background Effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-500/20 dark:bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed top-[20%] right-[-10%] w-[35rem] h-[35rem] bg-emerald-500/20 dark:bg-teal-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[20%] w-[45rem] h-[45rem] bg-purple-500/20 dark:bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Persistent Header */}
      <header className="flex-none w-full max-w-5xl p-6 flex justify-between items-center z-40 relative">
        <button onClick={() => navigate("/")} className={`${glassStyle} px-4 py-2.5 rounded-xl flex items-center gap-2.5 text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white transition-all hover:scale-105 active:scale-95 cursor-pointer`}>
          <Command size={16} />
          <span className="text-sm font-semibold tracking-wide hidden sm:block">PureSearch</span>
        </button>

        <div className="flex items-center gap-3">
          <div ref={filterMenuRef} className="relative">
             <button 
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              className={`${glassStyle} flex items-center gap-2 rounded-xl px-3 py-2.5 hover:bg-white/60 dark:hover:bg-zinc-800/80 transition-all cursor-pointer`}
              title="Engine Priorities"
            >
              <SlidersHorizontal size={16} className="text-zinc-500 dark:text-zinc-400" />
            </button>

            {isFilterMenuOpen && (
              <div className={`absolute top-full right-0 mt-2 w-48 p-2 rounded-2xl flex flex-col gap-1 ${glassStyle} animate-in fade-in slide-in-from-top-2 duration-200 shadow-2xl z-50`}>
                <div className="px-3 pt-1 pb-2 border-b border-zinc-200/50 dark:border-zinc-700/50 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Drag to reorder priority</span>
                </div>
                {enginePriorities.map((ep, index) => (
                  <div 
                    key={ep.engine} 
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={() => handleDragEnter(index)}
                    onDragEnd={handleDrop}
                    onDragOver={handleDragOver}
                    className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-grab active:cursor-grabbing group"
                  >
                     <GripVertical size={14} className="text-zinc-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                     <span className="text-sm font-medium capitalize text-zinc-700 dark:text-zinc-200 select-none">
                       {ep.engine}
                     </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div ref={fontMenuRef} className="relative hidden sm:block">
            <button onClick={() => setIsFontMenuOpen(!isFontMenuOpen)} className={`${glassStyle} flex items-center gap-2 rounded-xl px-4 py-2.5 hover:bg-white/60 dark:hover:bg-zinc-800/80 transition-all cursor-pointer`}>
              <Palette size={14} className="text-zinc-500 dark:text-zinc-400" />
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">{FONT_OPTIONS.find(f => f.id === activeFont)?.label}</span>
              <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-200 ${isFontMenuOpen ? "rotate-180" : ""}`} />
            </button>
            {isFontMenuOpen && (
              <div className={`absolute top-full right-0 mt-2 w-40 p-1.5 rounded-2xl flex flex-col gap-0.5 ${glassStyle} animate-in fade-in slide-in-from-top-2 duration-200 shadow-2xl z-50`}>
                {FONT_OPTIONS.map((font) => (
                  <button key={font.id} onClick={() => { setActiveFont(font.id); setIsFontMenuOpen(false); }} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${activeFont === font.id ? "bg-indigo-50 dark:bg-zinc-800/80 text-indigo-600 dark:text-indigo-400" : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"}`}>{font.label}</button>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className={`${glassStyle} p-2.5 rounded-xl text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all hover:scale-105 active:scale-95 cursor-pointer`}>
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar w-full flex flex-col items-center z-10 relative pb-10">
        {/* ROUTER LOGIC HERE */}
        <Routes>
          <Route path="/" element={<HomeView onSearch={handleSearchTrigger} />} />
          <Route 
            path="/search" 
            element={
              <SearchResultsView 
                enginePriorities={enginePriorities} 
                setEnginePriorities={setEnginePriorities}
                onSearch={handleSearchTrigger} 
              />
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

// 🏠 COMPONENT: Home Page
function HomeView({ onSearch }) {
  const [localSearch, setLocalSearch] = useState("");

  return (
    <div className="w-full max-w-3xl px-4 mt-[10vh] animate-in fade-in zoom-in duration-700">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="mb-3 relative flex items-center justify-center group">
          <div className={`${glassStyle} p-5 rounded-3xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
            <Globe size={48} className="text-indigo-600 dark:text-indigo-400" strokeWidth={1.5} />
            <Sparkles size={20} className="absolute -top-2 -right-2 text-yellow-500 animate-pulse" />
          </div>
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-zinc-800 to-zinc-500 dark:from-white dark:to-zinc-500 mb-2 pb-2">
          PureSearch
        </h1>
      </div>

      <div className="w-full relative z-30">
        <SearchBar query={localSearch} setQuery={setLocalSearch} onSearch={onSearch} loading={false} showSuggestions={true}/>
      </div>
    </div>
  );
}

// 🔍 COMPONENT: Results Page
function SearchResultsView({ enginePriorities, setEnginePriorities, onSearch }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [localSearch, setLocalSearch] = useState(query);

  // Sync the search bar text if the URL changes (e.g., user hits back button)
  useEffect(() => {
    setLocalSearch(query);
  }, [query]);

  // Detect and append new engines from results
  useEffect(() => {
    if (!results || results.length === 0) return;
    const existingEngines = enginePriorities.map(ep => ep.engine.toLowerCase());
    const newEngines = new Set();
    
    results.forEach(r => {
      r.engines?.forEach(e => {
        if (!existingEngines.includes(e.toLowerCase())) newEngines.add(e.toLowerCase());
      });
    });

    if (newEngines.size > 0) {
      const additions = Array.from(newEngines).map((e, idx) => ({ 
        engine: e, 
        priority: enginePriorities.length + idx + 1
      }));
      setEnginePriorities(prev => [...prev, ...additions]);
    }
  }, [results, enginePriorities, setEnginePriorities]);

  // Perform search automatically when the URL query parameter changes
  useEffect(() => {
    if (!query) return;
    
    const fetchResults = async () => {
      setError("");
      setLoading(true);
      setResults([]);

      try {
        if (ENV === "test") { 
          await new Promise((res) => setTimeout(res, 800));
          const testEngines = ["brave", "google", "duckduckgo", "bing", "wikipedia"];
          setResults(Array.from({ length: 50 }).map((_, i) => ({
              title: `${query} — Search Result (Original Rank: ${i + 1})`,
              url: "https://puresearch.dev",
              content: `Engine: ${testEngines[i % testEngines.length]}.`,
              engines: [testEngines[i % testEngines.length]],
              parsed_url: ["https", "puresearch.dev"]
            })));
        } else {
          const data = await searchQuery(query);
          setResults(data.results || []);
        }
      } catch (err) {
        if (err.response && err.response.status === 403) {
          const { message, quote } = err.response.data;
          setError(`${message} ${quote}`);
        } else {
          setError("Failed to fetch results.");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  // Hybrid Sorting Logic
  const sortedResults = useMemo(() => {
    if (!results || results.length === 0) return [];

    const engineCounts = {};
    const priorityGroup = [];
    const organicGroup = [];

    results.forEach((item, originalIndex) => {
      const primaryEngine = (item.engines && item.engines.length > 0) 
        ? item.engines[0].toLowerCase() 
        : "unknown";

      if (!engineCounts[primaryEngine]) engineCounts[primaryEngine] = 0;

      if (engineCounts[primaryEngine] < 5) {
        engineCounts[primaryEngine]++;
        priorityGroup.push({ item, originalIndex });
      } else {
        organicGroup.push({ item, originalIndex });
      }
    });

    const getScore = (engines) => {
      if (!engines || !Array.isArray(engines) || engines.length === 0) return 999;
      const scores = engines.map(eng => {
        const config = enginePriorities.find(ep => ep.engine.toLowerCase() === eng.toLowerCase());
        return config ? config.priority : 999;
      });
      return Math.min(...scores);
    };

    priorityGroup.sort((a, b) => {
      const scoreA = getScore(a.item.engines);
      const scoreB = getScore(b.item.engines);
      if (scoreA !== scoreB) return scoreA - scoreB; 
      return a.originalIndex - b.originalIndex;
    });

    return [
      ...priorityGroup.map(obj => obj.item),
      ...organicGroup.map(obj => obj.item)
    ];
      
  }, [results, enginePriorities]);

  return (
    <div className="w-full max-w-3xl px-4 mt-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="w-full relative z-30 mb-8">
        <SearchBar query={localSearch} setQuery={setLocalSearch} onSearch={onSearch} loading={loading} showSuggestions={false}/>
      </div>

      {error && (
        <div className="text-red-500 text-center py-4 bg-red-500/10 rounded-xl mb-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="w-full flex justify-center py-10">
           <div className={`${glassStyle} px-6 py-4 rounded-full flex items-center gap-3`}>
             <div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-700 border-t-indigo-500 dark:border-t-indigo-400 rounded-full animate-spin"></div>
             <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Searching the web...</span>
           </div>
        </div>
      )}

      {!loading && <Results results={sortedResults} loading={loading} />}
    </div>
  );
}