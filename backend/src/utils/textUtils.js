export function normalizeText(text, caseSensitive) {
  return caseSensitive ? text : text.toLowerCase();
}

export function containsBlockedWord(text, words, caseSensitive) {
  const normalizedText = normalizeText(text, caseSensitive);

  return words.some(word => {
    const normalizedWord = normalizeText(word, caseSensitive);
    return normalizedText.includes(normalizedWord);
  });
}

export function containsBlockedPattern(text, patterns) {
  return patterns.some(pattern => pattern.test(text));
}