import dotenv from 'dotenv';
dotenv.config();

// Accessing environment variables
const rawWords = process.env.BLOCKED_WORDS || "";
const rawPatterns = process.env.BLOCKED_PATTERNS || "";

export const filterConfig = {
  // Split the string by commas and trim spaces
  blockedWords: rawWords 
    ? rawWords.split(',').map(word => word.trim()) 
    : [],

  // Convert each pattern string into a case-insensitive RegExp object
  blockedPatterns: rawPatterns 
    ? rawPatterns.split(',').map(pattern => new RegExp(pattern.trim(), 'i')) 
    : [],

  replacementStrategy: "deny", // future: "sanitize", "warn"

  caseSensitive: false
};