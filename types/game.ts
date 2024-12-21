export interface Question {
  word: string;
  hint: string;
}

export interface GameState {
  currentQuestionIndex: number;
  attempts: number;
  maxAttempts: number;
  score: number;
  gameStatus: "playing" | "won" | "lost";
  guessedWord: string[];
}
