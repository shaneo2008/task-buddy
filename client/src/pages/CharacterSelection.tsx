import { motion } from "framer-motion";
import { useRoutineStore } from "@/stores/useRoutineStore";
import PixelRexCharacter from "@/components/rex/PixelRexCharacter";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  { id: "stella", name: "Stella", trait: "Tall & Kind" },
  { id: "flutty", name: "Flutty", trait: "Gentle & Graceful" },
];

export default function CharacterSelection() {
  const setScreen = useRoutineStore((s) => s.setScreen);
  const setSelectedCharacter = useRoutineStore((s) => s.setSelectedCharacter);

  const handleSelect = (charId: string) => {
    setSelectedCharacter(charId as import("@/stores/useRoutineStore").CharacterId);
    setScreen("picker");
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
        <p className="text-slate-500 text-sm">Swipe to find your perfect friend!</p>
      </div>

      {/* Character Carousel */}
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full max-w-xs mx-auto"
      >
        <CarouselContent className="-ml-4">
          {characters.map((char) => (
            <CarouselItem key={char.id} className="pl-4 basis-full">
              <motion.button
                onClick={() => handleSelect(char.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-col items-center w-full p-6 bg-white rounded-3xl shadow-sm border border-amber-100 hover:shadow-md transition-shadow"
              >
                <div className="w-48 h-48 mb-4 flex items-center justify-center">
                  <PixelRexCharacter
                    state="celebrating"
                    characterId={char.id as import("@/stores/useRoutineStore").CharacterId}
                    size={180}
                  />
                </div>
                <span className="font-bold text-slate-700 text-xl mb-1">{char.name}</span>
                <span className="text-sm text-slate-400 text-center">{char.trait}</span>
                <div className="mt-4 px-4 py-2 bg-amber-100 rounded-full">
                  <span className="text-xs font-semibold text-amber-700">Tap to choose me! 👆</span>
                </div>
              </motion.button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4 bg-white border-amber-200 hover:bg-amber-50" />
        <CarouselNext className="-right-4 bg-white border-amber-200 hover:bg-amber-50" />
      </Carousel>

      {/* Swipe hint */}
      <div className="text-center mt-6">
        <p className="text-slate-400 text-xs">👆 Swipe left or right to browse</p>
      </div>
    </div>
  );
}
