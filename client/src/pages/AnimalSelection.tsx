import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ALL_ANIMALS, useAnimal, type Animal } from "@/contexts/AnimalContext";

function AnimalCard({
  animal,
  selected,
  onSelect,
}: {
  animal: Animal;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`
        relative bg-white rounded-2xl p-4 sm:p-6
        flex flex-col items-center
        transition-all duration-300
        ${
          selected
            ? "border-4 border-primary shadow-xl scale-105"
            : "border-2 border-border hover:border-primary/50 hover:shadow-lg"
        }
        active:scale-95
      `}
    >
      {/* Animal Illustration */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 mb-3 animate-bounceIn">
        <img
          src={animal.illustration}
          alt={animal.name}
          className="w-full h-full object-contain rounded-xl"
        />
      </div>

      {/* Name */}
      <h3 className="font-semibold text-base sm:text-lg text-foreground mb-1">
        {animal.name}
      </h3>

      {/* Personality */}
      <p className="text-xs sm:text-sm text-muted-foreground text-center">
        {animal.personality}
      </p>

      {/* Selected Indicator */}
      {selected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-bounceIn">
          <span className="text-white text-sm">✓</span>
        </div>
      )}
    </button>
  );
}

export default function AnimalSelection() {
  const { selectedAnimal, setSelectedAnimal } = useAnimal();
  const [, setLocation] = useLocation();

  const handleContinue = () => {
    if (selectedAnimal) {
      setLocation("/routine");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/10 to-background pb-24">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center animate-fadeIn">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Choose Your Bedtime Buddy!
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Pick an animal friend to help you get ready for bed!
          </p>
        </div>

        {/* Animal Grid */}
        <div className="grid grid-cols-3 gap-4 sm:gap-5 mb-8">
          {ALL_ANIMALS.map((animal, index) => (
            <div
              key={animal.id}
              style={{ animationDelay: `${index * 80}ms` }}
              className="animate-fadeIn"
            >
              <AnimalCard
                animal={animal}
                selected={selectedAnimal?.id === animal.id}
                onSelect={() => setSelectedAnimal(animal)}
              />
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={!selectedAnimal}
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg disabled:opacity-50 text-lg py-6"
        >
          {selectedAnimal
            ? `Let's Go with ${selectedAnimal.name}! ✨`
            : "Pick a buddy first!"}
        </Button>
      </div>
    </div>
  );
}
