import { filterConfig } from "../config/filterConfig.js";
import {
  containsBlockedWord,
  containsBlockedPattern
} from "../utils/textUtils.js";

export function filterMiddleware(req, res, next) {
  const query = req.query.q || "";

  const hasBlockedWord = containsBlockedWord(
    query,
    filterConfig.blockedWords,
    filterConfig.caseSensitive
  );

  const hasBlockedPattern = containsBlockedPattern(
    query,
    filterConfig.blockedPatterns
  );

  if (hasBlockedWord || hasBlockedPattern) {
    return res.status(403).json({
      success: false,
      message: "Please do not attempt to search for this term again.",
      quote:"“Integrity is doing the right thing, even when no one is watching.” — C.S. Lewis"
    });
  }

  next();
}