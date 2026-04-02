import { useState, useEffect, useRef } from "react";
import { Search, Loader2, ArrowRight, ShieldAlert, AlertOctagon } from "lucide-react";
import { searchQuery } from "../services/api";
import { ENV, glassStyle } from "../App";

// 🔥 Added showSuggestions prop here, defaulting to true
export default function SearchBar({ query, setQuery, onSearch, loading, showSuggestions = true }) {
  const [liveSuggestions, setLiveSuggestions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  // Track server-provided blocked info
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedData, setBlockedData] = useState({ message: "", quote: "" });

  const wrapperRef = useRef(null);
  const skipNextFetch = useRef(false);
  const typedQueryRef = useRef("");

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // 🔥 If showSuggestions is false, we completely skip fetching to save network calls
    if (skipNextFetch.current || !showSuggestions) {
      skipNextFetch.current = false;
      return;
    }

    setSelectedIndex(-1);
    setIsBlocked(false);

    if (!query.trim() || query.length < 2) {
      setLiveSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setIsTyping(true);
    setShowDropdown(true);

    const delayDebounceFn = setTimeout(async () => {
      try {
        if (ENV === "test") {
          setLiveSuggestions([
            `${query.toLowerCase()} documentation`,
            `${query.toLowerCase()} github`,
          ]);
        } else {
          const data = await searchQuery(query);
          setLiveSuggestions(data.suggestions || []);
          setIsBlocked(false);
        }
      } catch (err) {
        if (err.response && err.response.status === 403) {
          setIsBlocked(true);
          setBlockedData({
            message: err.response.data.message,
            quote: err.response.data.quote
          });
          setLiveSuggestions([]);
        } else {
          console.error("Suggestion API error:", err);
          setLiveSuggestions([]);
        }
      } finally {
        setIsTyping(false);
      }
    }, 350);

    return () => clearTimeout(delayDebounceFn);
  }, [query, showSuggestions]); // Added showSuggestions to dependency array

  // Form Submission Logic
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isBlocked) {
      skipNextFetch.current = true;
      setShowDropdown(false);
      onSearch(query);
    }
  };

  // Keyboard navigation helpers
  const handleKeyDown = (e) => {
    if (!showSuggestions || !showDropdown || (liveSuggestions.length === 0 && !isBlocked)) return;
    
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = selectedIndex < liveSuggestions.length - 1 ? selectedIndex + 1 : selectedIndex;
      setSelectedIndex(nextIndex);
      skipNextFetch.current = true;
      if (liveSuggestions[nextIndex]) setQuery(liveSuggestions[nextIndex]);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const nextIndex = selectedIndex > -1 ? selectedIndex - 1 : -1;
      setSelectedIndex(nextIndex);
      skipNextFetch.current = true;
      setQuery(nextIndex === -1 ? typedQueryRef.current : liveSuggestions[nextIndex]);
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0) {
        e.preventDefault();
        const suggestion = liveSuggestions[selectedIndex];
        skipNextFetch.current = true;
        setQuery(suggestion);
        setShowDropdown(false);
        onSearch(suggestion);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      skipNextFetch.current = true;
      setQuery(typedQueryRef.current);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full group z-50 mb-10">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>

      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search size={20} className={`${isBlocked ? 'text-red-500' : 'text-zinc-400'} transition-colors`} />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => { typedQueryRef.current = e.target.value; setQuery(e.target.value); }}
          // 🔥 Only open dropdown on focus if showSuggestions is true
          onFocus={() => showSuggestions && (liveSuggestions.length > 0 || isTyping || isBlocked) && setShowDropdown(true)}
          onKeyDown={handleKeyDown} 
          placeholder="Search documentation, APIs, and guides..."
          className={`${glassStyle} w-full py-5 pl-14 pr-14 rounded-2xl focus:outline-none focus:ring-2 
            ${isBlocked ? 'focus:ring-red-500/30 border-red-500/50 animate-shake' : 'focus:ring-indigo-500/30'} 
            transition-all text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 font-medium text-lg`}
          disabled={loading}
          autoComplete="off" 
        />
        
        {isTyping && showSuggestions && (
          <div className="absolute inset-y-0 right-4 flex items-center">
            <Loader2 size={18} className="animate-spin text-zinc-400" />
          </div>
        )}
      </form>

      {/* 🔥 The dropdown is strictly gated behind showSuggestions */}
      {showSuggestions && showDropdown && (isTyping || liveSuggestions.length > 0 || isBlocked) && (
        <div className={`absolute top-full left-0 w-full mt-3 p-2 rounded-2xl bg-white/40 dark:bg-[#121212]/50 backdrop-blur-xl border border-white/60 dark:border-zinc-800/60 shadow-2xl ring-1 ring-black/5 dark:ring-white/5 animate-in fade-in slide-in-from-top-2 duration-200 z-50 max-h-[370px] md:max-h-[250px] overflow-y-auto custom-scrollbar`}>
          <div className="relative">
            {isBlocked ? (
              <div className="flex flex-col gap-4 p-4 animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                  <AlertOctagon size={24} strokeWidth={2.5} />
                  <span className="text-lg font-bold tracking-tight">Access Prohibited</span>
                </div>
                
                <div className="p-4 bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-1">
                    {blockedData.message}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
                    Search attempts are logged for safety compliance.
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-200/50 dark:border-zinc-800/50">
                  <p className="text-[11px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-bold mb-2">Perspective</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed italic">
                    {blockedData.quote}
                  </p>
                  <p className="mt-4 text-[10px] text-center font-bold text-red-500/60 uppercase tracking-tighter">
                    Do not search this term again
                  </p>
                </div>
              </div>
            ) : isTyping ? (
              <div className="flex flex-col gap-1 py-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-full px-4 py-3.5 rounded-xl flex items-center gap-3">
                     <Search size={14} className="text-zinc-300 dark:text-zinc-600" />
                     <div className="h-2.5 bg-zinc-200 dark:bg-zinc-700/50 rounded-full animate-pulse w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              liveSuggestions.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => { skipNextFetch.current = true; setQuery(sug); setShowDropdown(false); onSearch(sug); }}
                  onMouseEnter={() => setSelectedIndex(idx)} 
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-colors group/item cursor-pointer ${
                    selectedIndex === idx 
                      ? "bg-indigo-50 dark:bg-zinc-800/80 text-indigo-600 dark:text-indigo-400" 
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-white/50 dark:hover:bg-zinc-800/50 hover:text-indigo-600 dark:hover:text-indigo-400"
                  }`}
                >
                  <span className="font-medium truncate">{sug}</span>
                  <ArrowRight size={14} className={`transition-all ${selectedIndex === idx ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`} />
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}