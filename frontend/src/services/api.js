import axios from "axios";

const API = axios.create({  baseURL: "/api"});

export const searchQuery = async (q) => {
  const res = await API.get(`/search?q=${encodeURIComponent(q)}`);
  return res.data;
};


/**
 * Sorts search results based on engine priority while preserving the original API ranking for ties.
 * * @param {Array} results - The results array from your API (e.g., data.results)
 * @param {Array} priorities - Array of priority objects, e.g., [{ engine: "brave", priority: 1 }]
 * @returns {Array} - The stably sorted results array.
 */
export const sortResultsByEnginePriority = (results, priorities = []) => {
  if (!results || !Array.isArray(results) || results.length === 0) {
    return [];
  }

  // Helper to find the best (lowest) priority score for a result's engines
  const getPriorityScore = (engines) => {
    // If no engine is provided, give it a terrible score so it drops to the bottom
    if (!engines || engines.length === 0) return 999; 

    // Find the priority number for every engine attached to this result
    const scores = engines.map((eng) => {
      const config = priorities.find(
        (p) => p.engine.toLowerCase() === eng.toLowerCase()
      );
      return config ? config.priority : 999; // Default to 999 if engine isn't configured
    });

    // A result might have multiple engines, grab the best (lowest) priority number
    return Math.min(...scores);
  };

  // 🚀 The Explicitly Stable Sort
  return results
    .map((item, originalIndex) => ({ item, originalIndex })) // 1. Attach original index
    .sort((a, b) => {
      const scoreA = getPriorityScore(a.item.engines);
      const scoreB = getPriorityScore(b.item.engines);

      // 2. Sort by Engine Priority first (e.g., 1 comes before 5)
      if (scoreA !== scoreB) {
        return scoreA - scoreB;
      }

      // 3. If priorities are tied (e.g. both are Brave), sort by original API index!
      return a.originalIndex - b.originalIndex;
    })
    .map(({ item }) => item); // 4. Strip the index back out and return the raw item
};