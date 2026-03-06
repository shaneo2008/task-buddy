import { motion } from "framer-motion";
import { useRoutineStore } from "@/stores/useRoutineStore";

const CACHE_BUST = "?v=500";

const characters = [
  { id: "hoppy", name: "Hoppy", trait: "Energetic & Bouncy" },
  { id: "snoozy", name: "Snoozy", trait: "Cuddly & Calm" },
  { id: "sparky", name: "Sparky", trait: "Clever & Playful" },
  { id: "luna", name: "Luna", trait: "Peaceful & Gentle" },
  { id: "zen", name: "Zen", trait: "Calm & Wise" },
  { id: "buddy", name: "Buddy", trait: "Loyal & Friendly" },
  { id: "rex", name: "Rex", trait: "Brave & Mighty" },
  { id: "snapper", name: "Snapper", trait: "Tough & Silly" },
  { id: "finn", name: "Finn", trait: "Cool & Adventurous" },
  { id: "masha", name: "Masha", trait: "Curious & Friendly" },
  { id: "stella", name: "Stella", trait: "Shiny & Sweet" },
  { id: "flutty", name: "Flutty", trait: "Gentle & Graceful" },
];

export default function CharacterSelection() {
  const setScreen = useRoutineStore((s) => s.setScreen);
  const setSelectedCharacter = useRoutineStore((s) => s.setSelectedCharacter);

  const handleSelect = (charId: string) => {
    setSelectedCharacter(charId as import("@/stores/useRoutineStore").CharacterId);
    setScreen("setup");
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
          <span className="text-lg">✨</span>
        </div>
        <span className="font-semibold text-amber-800 text-sm">Bedtime Buddy</span>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Choose Your Buddy</h1>
        <p className="text-slate-500 text-sm">Pick a friend to help with your bedtime routine!</p>
      </div>

      {/* Character Grid */}
      <div className="grid grid-cols-3 gap-4">
        {characters.map((char) => (
          <motion.button
            key={char.id}
            onClick={() => handleSelect(char.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center p-3 bg-white rounded-2xl shadow-sm border border-amber-100 hover:shadow-md transition-shadow"
          >
            <div className="w-20 h-20 mb-2 rounded-xl overflow-hidden bg-amber-50/50">
              <img
                src={`/${char.id}-preview.png${CACHE_BUST}`}
                alt={char.name}
                className="w-full h-full object-contain"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
            <span className="font-semibold text-slate-700 text-sm">{char.name}</span>
            <span className="text-xs text-slate-400 text-center leading-tight">{char.trait}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
