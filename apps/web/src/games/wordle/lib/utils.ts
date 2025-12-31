// Wordle game logic utilities

export type LetterStatus = "correct" | "present" | "absent" | "empty" | "tbd";

/**
 * Check a guess against the target word
 * Returns array of statuses for each letter
 */
export function checkGuess(guess: string, target: string): LetterStatus[] {
  const result: LetterStatus[] = new Array(target.length).fill("absent");
  const targetChars = target.split("");
  const guessChars = guess.split("");
  const usedIndices = new Set<number>();

  // First pass: find exact matches (green)
  for (let i = 0; i < guessChars.length; i++) {
    if (guessChars[i] === targetChars[i]) {
      result[i] = "correct";
      usedIndices.add(i);
    }
  }

  // Second pass: find present letters (yellow)
  for (let i = 0; i < guessChars.length; i++) {
    if (result[i] === "correct") continue;

    for (let j = 0; j < targetChars.length; j++) {
      if (usedIndices.has(j)) continue;
      if (guessChars[i] === targetChars[j]) {
        result[i] = "present";
        usedIndices.add(j);
        break;
      }
    }
  }

  return result;
}

/**
 * Get keyboard letter statuses based on all guesses
 */
export function getKeyboardStatus(
  guesses: string[],
  results: LetterStatus[][],
): Map<string, LetterStatus> {
  const status = new Map<string, LetterStatus>();

  for (let i = 0; i < guesses.length; i++) {
    const guess = guesses[i];
    const result = results[i];
    if (!guess || !result) continue;

    for (let j = 0; j < guess.length; j++) {
      const letter = guess[j];
      const letterStatus = result[j];
      const currentStatus = status.get(letter);

      // Priority: correct > present > absent
      if (letterStatus === "correct") {
        status.set(letter, "correct");
      } else if (letterStatus === "present" && currentStatus !== "correct") {
        status.set(letter, "present");
      } else if (!currentStatus) {
        status.set(letter, letterStatus);
      }
    }
  }

  return status;
}

/**
 * Generate empty grid for display
 */
export function createEmptyGrid(rows: number, cols: number): string[][] {
  return Array.from({ length: rows }, () => Array(cols).fill(""));
}
