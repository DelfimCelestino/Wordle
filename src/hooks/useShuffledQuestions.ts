import { useState, useEffect } from "react";
import { questions } from "../../data/questions";
import { Question } from "../../types/game";

const shuffleArray = (array: Question[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export function useShuffledQuestions() {
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  useEffect(() => {
    setShuffledQuestions(shuffleArray(questions));
  }, []);

  return shuffledQuestions;
}
