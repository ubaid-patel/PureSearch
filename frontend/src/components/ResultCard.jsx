import { ExternalLink } from "lucide-react";
import { glassStyle } from "../App"; // Import the shared glass style

export default function ResultCard({ result }) {
  const { title, url, content, parsed_url, engines } = result;

  const domainName = parsed_url && parsed_url.length > 1 ? parsed_url[1] : new URL(url).hostname;
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domainName}&sz=32`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block p-6 rounded-3xl group transition-all duration-300 hover:-translate-y-1 ${glassStyle} hover:border-indigo-500/40 dark:hover:border-indigo-500/40`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white/60 dark:bg-zinc-800/60 rounded-md backdrop-blur-sm shadow-sm">
            <img 
              src={faviconUrl} 
              alt="favicon" 
              className="w-4 h-4"
              onError={(e) => (e.target.style.display = 'none')} 
            />
          </div>
          <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 truncate max-w-[200px]">
            {domainName}
          </span>
        </div>
        
        {engines && engines.length > 0 && (
          <span className="px-2.5 py-1 text-[10px] uppercase tracking-widest font-mono font-bold bg-zinc-200/50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 rounded-lg backdrop-blur-sm">
            {engines[0]}
          </span>
        )}
      </div>

      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-cyan-500 dark:group-hover:from-indigo-400 dark:group-hover:to-cyan-400 transition-all mb-3 pr-6 relative">
        {title}
        <ExternalLink size={16} className="absolute right-0 top-1.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-cyan-500" />
      </h3>
      
      <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed line-clamp-2">
        {content || <span className="italic opacity-50">No description provided by the source.</span>}
      </p>
    </a>
  );
}