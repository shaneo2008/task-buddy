import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Progress } from "@/components/ui/progress";
import { useAnimal } from "@/contexts/AnimalContext";

interface Task {
  id: string;
  title: string;
  description: string;
  emoji: string;
  duration: number; // in seconds
}

// Reordered: PJs → Brush teeth → Potty → Pick book. 1 minute each.
const tasks: Task[] = [
  {
    id: "pajamas",
    title: "Put On Your Cozy Pajamas!",
    description: "Get into your comfy PJs for bedtime!",
    emoji: "👕",
    duration: 60,
  },
  {
    id: "brush",
    title: "Time to Brush Your Teeth!",
    description: "Brush for 1 minute to keep your teeth sparkly!",
    emoji: "🪥",
    duration: 60,
  },
  {
    id: "potty",
    title: "Go Potty!",
    description: "One last trip to the bathroom before bed!",
    emoji: "🚽",
    duration: 60,
  },
  {
    id: "book",
    title: "Pick a Book!",
    description: "Choose a story for tonight's adventure!",
    emoji: "📚",
    duration: 60,
  },
];

function TaskProgressDots({
  total,
  current,
}: {
  total: number;
  current: number;
}) {
  return (
    <div className="flex justify-center gap-2 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            i < current
              ? "bg-secondary scale-110"
              : i === current
                ? "bg-primary scale-125"
                : "bg-border"
          }`}
        />
      ))}
    </div>
  );
}

function TaskScreen({
  task,
  taskIndex,
  totalTasks,
  animalIllustration,
  animalName,
  onComplete,
}: {
  task: Task;
  taskIndex: number;
  totalTasks: number;
  animalIllustration: string;
  animalName: string;
  onComplete: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(task.duration);
  const [isRunning, setIsRunning] = useState(true);

  // Reset timer when task changes
  useEffect(() => {
    setTimeLeft(task.duration);
    setIsRunning(true);
  }, [task.id, task.duration]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((task.duration - timeLeft) / task.duration) * 100;

  return (
    <div className="max-w-md mx-auto px-4 py-8 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Task Progress Dots */}
        <TaskProgressDots total={totalTasks} current={taskIndex} />

        {/* Progress Bar */}
        <Progress value={progress} className="mb-6 h-3 rounded-full" />

        {/* Animal buddy cheering */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <img
              src={animalIllustration}
              alt={animalName}
              className="w-16 h-16 rounded-full border-3 border-primary/30 shadow-lg object-contain bg-white"
            />
            {timeLeft > 0 && (
              <div className="absolute -top-6 -right-4 bg-sunny text-foreground text-xs font-bold px-2 py-1 rounded-full animate-bounce shadow-md">
                Go!
              </div>
            )}
          </div>
        </div>

        {/* Task Emoji */}
        <div className="text-center mb-4">
          <span className="text-7xl">{task.emoji}</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-2">
          {task.title}
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg text-muted-foreground text-center mb-6">
          {task.description}
        </p>

        {/* Timer */}
        <div className="text-center mb-6">
          <div
            className={`inline-flex items-center justify-center w-28 h-28 rounded-full border-[6px] transition-colors duration-500 ${
              timeLeft === 0
                ? "border-secondary/50 bg-secondary/10"
                : "border-primary/30 bg-primary/5"
            }`}
          >
            <span
              className={`text-3xl font-bold transition-colors duration-500 ${
                timeLeft === 0 ? "text-secondary" : "text-primary"
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Complete Button */}
        <Button
          onClick={onComplete}
          disabled={timeLeft > 0}
          size="lg"
          className={`w-full font-semibold shadow-lg text-lg py-6 transition-all duration-300 ${
            timeLeft === 0
              ? "bg-secondary text-secondary-foreground hover:bg-secondary/90 animate-bounceIn"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {timeLeft > 0
            ? `${animalName} is waiting... ${formatTime(timeLeft)}`
            : `I Did It! Feed ${animalName}! 🎉`}
        </Button>
      </div>
    </div>
  );
}

function CelebrationScreen({
  animalIllustration,
  animalName,
  taskNumber,
  totalTasks,
  onContinue,
}: {
  animalIllustration: string;
  animalName: string;
  taskNumber: number;
  totalTasks: number;
  onContinue: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/20 to-background flex flex-col items-center justify-center px-4 animate-fadeIn">
      {/* Animal with animation */}
      <div className="w-40 h-40 sm:w-48 sm:h-48 mb-6 animate-bounce">
        <img
          src={animalIllustration}
          alt={animalName}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Floating hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-3xl animate-float"
            style={{
              left: `${10 + i * 15}%`,
              top: "50%",
              animationDelay: `${i * 0.3}s`,
            }}
          >
            {i % 2 === 0 ? "❤️" : "⭐"}
          </div>
        ))}
      </div>

      {/* Success Message */}
      <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-2 animate-bounceIn text-center">
        Amazing Job! 🎉
      </h2>
      <p className="text-lg sm:text-xl text-foreground mb-2">
        {animalName} is so happy! Yum yum!
      </p>
      <p className="text-base sm:text-lg text-muted-foreground mb-8">
        {taskNumber}/{totalTasks} tasks complete!
      </p>

      <Button
        onClick={onContinue}
        size="lg"
        className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg text-lg px-8 py-6"
      >
        {taskNumber < totalTasks ? "Next Task! ✨" : "Story Time! 📖"}
      </Button>
    </div>
  );
}

function StoryReadyScreen({
  animalIllustration,
  animalName,
}: {
  animalIllustration: string;
  animalName: string;
}) {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/20 to-background flex flex-col items-center justify-center px-4 animate-fadeIn">
      <div className="w-40 h-40 sm:w-48 sm:h-48 mb-6 animate-bounce">
        <img
          src={animalIllustration}
          alt={animalName}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Stars celebration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-float"
            style={{
              left: `${5 + i * 12}%`,
              top: `${30 + (i % 3) * 15}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          >
            ⭐
          </div>
        ))}
      </div>

      <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 text-center">
        You're All Ready for Bed!
      </h2>
      <p className="text-lg sm:text-xl text-muted-foreground mb-2 text-center">
        {animalName} is full and happy!
      </p>
      <p className="text-base text-muted-foreground mb-8 text-center">
        Your story is ready! Let's listen!
      </p>
      <Button
        onClick={() => setLocation("/")}
        size="lg"
        className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg text-lg px-8 py-6"
      >
        📖 Listen to Story
      </Button>
    </div>
  );
}

export default function BedtimeRoutine() {
  const { selectedAnimal } = useAnimal();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"task" | "celebrate" | "complete">("task");
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  // Redirect if no animal selected
  useEffect(() => {
    if (!selectedAnimal) {
      setLocation("/create");
    }
  }, [selectedAnimal, setLocation]);

  if (!selectedAnimal) {
    return null;
  }

  const handleTaskComplete = () => {
    setStep("celebrate");
  };

  const handleCelebrationContinue = () => {
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex((prev) => prev + 1);
      setStep("task");
    } else {
      setStep("complete");
    }
  };

  if (step === "task") {
    return (
      <TaskScreen
        task={tasks[currentTaskIndex]}
        taskIndex={currentTaskIndex}
        totalTasks={tasks.length}
        animalIllustration={selectedAnimal.illustration}
        animalName={selectedAnimal.name}
        onComplete={handleTaskComplete}
      />
    );
  }

  if (step === "celebrate") {
    return (
      <CelebrationScreen
        animalIllustration={selectedAnimal.illustration}
        animalName={selectedAnimal.name}
        taskNumber={currentTaskIndex + 1}
        totalTasks={tasks.length}
        onContinue={handleCelebrationContinue}
      />
    );
  }

  return (
    <StoryReadyScreen
      animalIllustration={selectedAnimal.illustration}
      animalName={selectedAnimal.name}
    />
  );
}
