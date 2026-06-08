import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { Settings } from 'lucide-react';
import { useRoutineStore } from '../store/useRoutineStore';
import PixelRexCharacter from '../components/rex/PixelRexCharacter';
import Logo from '../components/Logo';

const MotionButton = motion.button;

const characters = [
  { id: 'hoppy',   name: 'Hoppy',   trait: 'Energetic & Bouncy' },
  { id: 'rex',     name: 'Rex',     trait: 'Brave & Mighty' },
  { id: 'flutty',  name: 'Flutty',  trait: 'Gentle & Graceful' },
  { id: 'buddy',   name: 'Buddy',   trait: 'Loyal & Friendly' },
];

export default function CharacterSelection() {
  const setScreen = useRoutineStore((s) => s.setScreen);
  const setSelectedCharacter = useRoutineStore((s) => s.setSelectedCharacter);
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'center', loop: true });
  const companionCount = characters.length;

  const handleSelect = (charId) => {
    setSelectedCharacter(charId);
    setScreen('picker');
  };

  return (
    <div className="h-full min-h-0 flex flex-col px-1 py-1 text-cocoa-text overflow-hidden sm:py-2">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3 shrink-0 sm:mb-5">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-auto" size="small" />
        </div>
        <MotionButton
          onClick={() => setScreen('settings')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-2xl bg-white/60 border border-cocoa-300/15 shadow-sm flex items-center justify-center hover:bg-white/80 transition-colors backdrop-blur-sm"
        >
          <Settings className="w-5 h-5 text-peach-accent" />
        </MotionButton>
      </div>

      {/* Title */}
      <div className="text-center mb-3 px-2 shrink-0 sm:mb-6 sm:px-4">
        <div className="hidden items-center gap-2 rounded-full border border-cocoa-300/15 bg-white/50 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-cocoa-50 font-body shadow-sm backdrop-blur-md mb-2 sm:inline-flex sm:py-1.5 sm:text-[11px] sm:mb-4">
          <span>Buddy Collection</span>
          <span className="text-cocoa-text">{companionCount} companions</span>
        </div>
        <h1 className="text-[1.45rem] leading-tight font-display font-bold text-cocoa-text mb-1 sm:text-3xl sm:mb-2">Choose Your Buddy</h1>
        <p className="hidden max-w-[18rem] mx-auto text-cocoa-100 text-[13px] font-body leading-snug sm:block sm:max-w-none sm:text-sm sm:leading-normal">Swipe to find your perfect friend for tonight's routine.</p>
      </div>

      {/* Carousel with arrows */}
      <div className="relative w-full max-w-sm mx-auto mb-2 flex-1 min-h-0 sm:mb-4">
        <div className="absolute inset-8 rounded-full bg-peach-accent/15 blur-3xl pointer-events-none" />
        <div className="relative flex h-full min-h-0 w-full flex-col rounded-[32px] border-2 border-olive-accent/30 bg-gradient-to-b from-white/40 to-olive-50/10 px-1 py-2.5 sm:px-3 sm:py-5 shadow-lg backdrop-blur-md overflow-visible">
          <div className="absolute inset-x-10 top-3 h-16 rounded-full bg-olive-100/15 blur-2xl pointer-events-none" />
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-2xl bg-white/70 border border-cocoa-300/15 shadow-sm flex items-center justify-center hover:bg-white/90 transition-colors backdrop-blur-sm sm:left-0 sm:w-11 sm:h-11"
        >
          <span className="text-peach-accent font-bold text-lg leading-none">‹</span>
        </button>

        <div className="h-full min-h-0 overflow-hidden px-1 sm:px-6" ref={emblaRef}>
          <div className="flex h-full items-stretch">
            {characters.map((char) => (
              <div key={char.id} className="flex h-full flex-[0_0_72%] min-w-0 px-1 sm:flex-[0_0_90%] sm:px-2">
                <MotionButton
                  onClick={() => handleSelect(char.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative flex h-full min-h-[24rem] w-full flex-col items-center px-3 py-3 bg-[#7A4A28] backdrop-blur-md rounded-[28px] shadow-md border border-white/10 hover:border-peach-accent/40 transition-all overflow-visible sm:min-h-0 sm:p-6"
                >
                  <div className="hidden self-start mb-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-cream-200/70 font-body sm:inline-flex sm:mb-3 sm:text-[11px]">
                    Tonight's guide
                  </div>
                  <div className="relative mb-3 flex w-full flex-1 items-center justify-center rounded-[24px] bg-[#F6E5CC] border border-cocoa-300/15 overflow-visible min-h-[13.5rem] sm:mb-4 sm:min-h-0">
                    <PixelRexCharacter state="celebrating" characterId={char.id} size={170} className="shrink-0" />
                  </div>
                  <span className="font-display font-semibold text-cream-50 text-[1.45rem] mb-0.5 sm:text-2xl sm:mb-1">{char.name}</span>
                  <span className="text-[13px] text-cream-200/70 text-center font-body leading-snug sm:text-sm">{char.trait}</span>
                  <div className="mt-auto pt-3 w-full rounded-2xl border border-peach-accent bg-peach-accent px-4 py-2.5 flex items-center justify-between sm:mt-5 sm:pt-0 sm:py-3">
                    <span className="text-xs font-display font-semibold text-cocoa-text">Choose {char.name}</span>
                    <span className="text-cocoa-text text-sm">→</span>
                  </div>
                </MotionButton>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => emblaApi?.scrollNext()}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-2xl bg-white/70 border border-cocoa-300/15 shadow-sm flex items-center justify-center hover:bg-white/90 transition-colors backdrop-blur-sm sm:right-0 sm:w-11 sm:h-11"
        >
          <span className="text-peach-accent font-bold text-lg leading-none">›</span>
        </button>
        </div>
      </div>

      <div className="max-w-sm mx-auto rounded-[24px] border border-cocoa-300/15 bg-white/50 px-3 py-2 shadow-sm backdrop-blur-md text-center shrink-0 sm:px-4 sm:py-3">
        <p className="text-cocoa-100 text-[12px] font-body leading-snug sm:text-sm sm:leading-relaxed">Each buddy brings a slightly different energy. Pick the one that feels right tonight.</p>
        <p className="text-cocoa-50 text-[11px] font-body mt-1 sm:text-xs sm:mt-2">Swipe or tap the arrows to browse</p>
      </div>
    </div>
  );
}
