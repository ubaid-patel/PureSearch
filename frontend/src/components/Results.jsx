import ResultCard from "./ResultCard";

export default function Results({ results, loading }) {
  if (loading || results.length === 0) return null;

  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1 px-2">
        Found {results.length} results
      </p>
      
      {results.map((result, idx) => (
        <ResultCard key={idx} result={result} />
      ))}
    </div>
  );
}