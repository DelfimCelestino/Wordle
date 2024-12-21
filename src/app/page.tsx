"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { questions } from "../../data/questions";
import { GameState } from "../../types/game";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useShuffledQuestions } from "@/hooks/useShuffledQuestions";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const INITIAL_STATE: GameState = {
  currentQuestionIndex: 0,
  attempts: 0,
  maxAttempts: 3,
  score: 0,
  gameStatus: "playing",
  guessedWord: [],
};

export default function WordGame() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [showGiveUpDialog, setShowGiveUpDialog] = useState(false);
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);

  const shuffledQuestions = useShuffledQuestions();
  const currentQuestion =
    shuffledQuestions[gameState.currentQuestionIndex] || questions[0];
  const currentWord = currentQuestion?.word || "";

  useEffect(() => {
    if (shuffledQuestions.length > 0) {
      const currentQuestion = shuffledQuestions[gameState.currentQuestionIndex];
      setGameState((prev) => ({
        ...prev,
        guessedWord: Array(currentQuestion.word.length).fill(""),
      }));
    }
  }, [shuffledQuestions, gameState.currentQuestionIndex]);

  const handleLetterClick = (letter: string) => {
    if (gameState.gameStatus !== "playing") return;

    const newGuessedWord = [...gameState.guessedWord];
    const emptyIndex = newGuessedWord.findIndex((pos) => pos === "");

    if (emptyIndex !== -1) {
      newGuessedWord[emptyIndex] = letter;
    }

    const isComplete = newGuessedWord.every((letter) => letter !== "");

    if (isComplete) {
      const currentQuestion = shuffledQuestions[gameState.currentQuestionIndex];
      const isCorrect = newGuessedWord.join("") === currentQuestion.word;
      if (isCorrect) {
        handleWin();
      } else {
        const newAttempts = gameState.attempts + 1;
        if (newAttempts >= gameState.maxAttempts) {
          handleLoss();
        } else {
          setGameState((prev) => ({
            ...prev,
            guessedWord: Array(currentQuestion.word.length).fill(""),
            attempts: newAttempts,
          }));
        }
      }
    } else {
      setGameState((prev) => ({
        ...prev,
        guessedWord: newGuessedWord,
      }));
    }
  };

  const resetGame = () => {
    setGameState(INITIAL_STATE);
    setShowGameOverDialog(false);
  };

  const nextQuestion = () => {
    if (gameState.currentQuestionIndex < shuffledQuestions.length - 1) {
      setGameState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        attempts: 0,
        gameStatus: "playing",
        guessedWord: [],
      }));
      setShowGameOverDialog(false);
    } else {
      resetGame();
    }
  };

  const handleGuessedLetterClick = (index: number) => {
    if (gameState.gameStatus !== "playing") return;

    const newGuessedWord = [...gameState.guessedWord];
    const letterToRemove = newGuessedWord[index];

    if (letterToRemove) {
      newGuessedWord[index] = "";

      setGameState((prev) => ({
        ...prev,
        guessedWord: newGuessedWord,
      }));
    }
  };

  const handleWin = () => {
    setGameState((prev) => ({
      ...prev,
      score: prev.score + 100,
      gameStatus: "won",
    }));
    setShowGameOverDialog(true);
  };

  const handleLoss = () => {
    setGameState((prev) => ({
      ...prev,
      gameStatus: "lost",
    }));
    setShowGameOverDialog(true);
  };

  const handleGiveUp = () => {
    setGameState((prev) => ({
      ...prev,
      gameStatus: "lost",
    }));
    setShowGameOverDialog(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-4 space-y-6">
      <Card className="w-full max-w-lg bg-white/50 backdrop-blur-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-indigo-500"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </div>
            <h2 className="text-sm sm:text-xl font-semibold text-indigo-500">
              Como Jogar
            </h2>
          </div>
          <div className="space-y-2 text-slate-600 text-xs">
            <p className="flex items-center gap-2">
              <span className="text-indigo-500 font-medium">1.</span>
              Tente adivinhar a palavra usando as letras disponíveis
            </p>
            <p className="flex items-center gap-2">
              <span className="text-indigo-500 font-medium">2.</span>
              Clique em uma letra para adicioná-la à palavra
            </p>
            <p className="flex items-center gap-2">
              <span className="text-indigo-500 font-medium">3.</span>
              Clique em uma letra preenchida para removê-la
            </p>
            <p className="flex items-center gap-2">
              <span className="text-indigo-500 font-medium">4.</span>
              Você tem {gameState.maxAttempts} tentativas para acertar cada
              palavra
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-lg border-t-4 border-indigo-500 shadow-lg">
        <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Title */}
          <div className="flex justify-center gap-1">
            {["A", "D", "I", "V", "I", "N", "H", "E"].map((letter, i) => (
              <div
                key={i}
                className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded font-bold text-xs sm:text-base text-white transform hover:scale-110 transition-transform
                  ${
                    i === 1
                      ? "bg-orange-400"
                      : i === 7
                      ? "bg-green-400"
                      : "bg-indigo-500"
                  }`}
              >
                {letter}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center p-2 sm:p-3 bg-slate-50 rounded-lg text-xs sm:text-base">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-orange-500 font-bold">
                  {gameState.attempts}
                </span>
              </div>
              <span className="text-slate-600">
                de {gameState.maxAttempts} tentativas
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-600">Score:</span>
              <div className="px-2 sm:px-3 py-1 bg-green-100 rounded-full">
                <span className="text-green-600 font-bold">
                  {gameState.score}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 p-3 sm:p-4 rounded-lg space-y-2 border border-indigo-100">
            <div className="flex gap-2 items-center">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-500">💡</span>
              </div>
              <h2 className="font-semibold text-xs sm:text-base text-indigo-500">
                Dica
              </h2>
            </div>
            <p className="text-slate-600 pl-7 sm:pl-8 text-xs sm:text-base">
              {currentQuestion.hint}
            </p>
          </div>

          <div className="flex justify-center gap-1 sm:gap-2 flex-wrap max-w-[90%] mx-auto">
            {Array(currentWord.length)
              .fill("")
              .map((_, i) => (
                <div
                  key={i}
                  onClick={() => handleGuessedLetterClick(i)}
                  className={`w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-lg font-bold rounded-lg transform transition-all duration-200
                    ${
                      !gameState.guessedWord[i]
                        ? "bg-slate-100"
                        : gameState.guessedWord.join("") === currentWord
                        ? "bg-green-100 text-green-600 scale-105"
                        : gameState.guessedWord.every((l) => l !== "")
                        ? "bg-red-100 text-red-600"
                        : "bg-orange-100 text-orange-600 cursor-pointer hover:bg-orange-200 hover:scale-105"
                    }
                    ${currentWord.length > 8 ? "text-xs sm:text-base" : ""}
                    ${currentWord.length > 12 ? "w-6 h-6 sm:w-8 sm:h-8" : ""}
                  `}
                >
                  {gameState.guessedWord[i] || ""}
                </div>
              ))}
          </div>

          <div className="grid grid-cols-9 gap-1 sm:gap-2 p-2 sm:p-4 bg-slate-50 rounded-lg">
            {LETTERS.map((letter) => (
              <Button
                key={letter}
                variant="outline"
                className={`w-6 h-6 sm:w-8 sm:h-8 p-0 text-xs sm:text-base hover:bg-indigo-50 hover:text-indigo-600 transition-colors`}
                onClick={() => handleLetterClick(letter)}
                disabled={gameState.gameStatus !== "playing"}
              >
                {letter}
              </Button>
            ))}
          </div>

          <div className="flex justify-between pt-2">
            <Button
              variant="destructive"
              onClick={() => setShowGiveUpDialog(true)}
              disabled={gameState.gameStatus !== "playing"}
              className="text-xs sm:text-base hover:scale-105 transition-transform"
            >
              Desistir
            </Button>
            <Button
              variant="outline"
              onClick={resetGame}
              className="text-xs sm:text-base hover:bg-indigo-50 hover:text-indigo-600 hover:scale-105 transition-transform"
            >
              Reiniciar
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showGiveUpDialog} onOpenChange={setShowGiveUpDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja realmente desistir?</AlertDialogTitle>
            <AlertDialogDescription>
              Você perderá o progresso atual do jogo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleGiveUp}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Game Over Dialog */}
      <AlertDialog
        open={showGameOverDialog}
        onOpenChange={setShowGameOverDialog}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle
              className={`text-2xl text-center mb-2 ${
                gameState.gameStatus === "won"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {gameState.gameStatus === "won" ? (
                <div className="flex items-center justify-center gap-2">
                  <span>🎉 Parabéns! 🎉</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>😔 Fim de Jogo</span>
                </div>
              )}
            </AlertDialogTitle>
            <div className="text-center space-y-4 text-sm text-muted-foreground">
              <div className="py-4 px-6 rounded-lg bg-slate-50">
                <div className="text-lg mb-2">
                  {gameState.gameStatus === "won"
                    ? "Você acertou a palavra:"
                    : "A palavra correta era:"}
                </div>
                <div className="text-2xl font-bold text-indigo-600">
                  {currentWord}
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 py-2">
                <span className="text-xl">🏆</span>
                <span className="text-lg">
                  Score:{" "}
                  <span className="font-bold text-green-600">
                    {gameState.score}
                  </span>
                </span>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-2 mt-4">
            {gameState.currentQuestionIndex < shuffledQuestions.length - 1 &&
            gameState.gameStatus === "won" ? (
              <AlertDialogAction
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-8"
                onClick={nextQuestion}
              >
                <div className="flex items-center gap-2">
                  <span>Próxima Palavra</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              </AlertDialogAction>
            ) : (
              <AlertDialogAction
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8"
                onClick={resetGame}
              >
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                  <span>Jogar Novamente</span>
                </div>
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Made with love */}
      <div className="text-xs sm:text-sm text-slate-500 flex items-center gap-1">
        Made with <span className="text-red-500">❤️</span> by{" "}
        <a
          href="https://github.com/delfimcelestino"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-500 hover:text-indigo-600 transition-colors"
        >
          Delfim Celestino
        </a>
      </div>
    </div>
  );
}
