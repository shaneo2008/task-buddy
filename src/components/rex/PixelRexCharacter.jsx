import { useEffect, useState } from 'react';

const SPRITE_FRAME_SIZE = 128;
const FRAME_COUNT = 16;
const FRAME_COLUMNS = 4;
const FRAME_ROWS = 4;
const ANIM_DURATION = 1.6;
const SPRITE_ASSET_BASE_PATH = '/buddy-watercolor';

const CHARACTER_SIZE_MULTIPLIERS = {
  hoppy: 1.56,
  snoozy: 1.56,
  sparky: 1.45,
  luna: 1.56,
  zen: 1.43,
  buddy: 1.44,
  rex: 1.68,
  snapper: 1.74,
  finn: 1.57,
  masha: 1.62,
  stella: 1.68,
  flutty: 1.62,
};

export default function PixelRexCharacter({ state, eatPhase = 'none', className = '', size = 120, characterId = 'rex' }) {
  const [currentAnim, setCurrentAnim] = useState('idle');
  const [isChomping, setIsChomping] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  const SPRITE_WIDTH = SPRITE_FRAME_SIZE * FRAME_COLUMNS;
  const SPRITE_HEIGHT = SPRITE_FRAME_SIZE * FRAME_ROWS;

  useEffect(() => {
    if (state !== 'eating' && isChomping) {
      setIsChomping(false);
    }
    if (state === 'celebrating') {
      setCurrentAnim('celebrate');
    } else if (state === 'eating' && (eatPhase === 'jaw-open' || eatPhase === 'chomp') && !isChomping) {
      setIsChomping(true);
      setCurrentAnim('chomp');
      const t = setTimeout(() => {
        setIsChomping(false);
        setCurrentAnim((prev) => (prev === 'chomp' ? 'idle' : prev));
      }, ANIM_DURATION * 1000);
      return () => clearTimeout(t);
    } else if (state === 'bored' || state === 'hungry') {
      setCurrentAnim('bored');
    } else if (state === 'idle') {
      setCurrentAnim('idle');
    }
  }, [state, eatPhase, isChomping]);

  useEffect(() => {
    const frameDurationMs = (ANIM_DURATION * 1000) / FRAME_COUNT;

    setCurrentFrame(0);

    if (currentAnim === 'chomp') {
      let nextFrame = 0;
      const intervalId = setInterval(() => {
        nextFrame += 1;
        if (nextFrame >= FRAME_COUNT - 1) {
          setCurrentFrame(FRAME_COUNT - 1);
          clearInterval(intervalId);
          return;
        }
        setCurrentFrame(nextFrame);
      }, frameDurationMs);

      return () => clearInterval(intervalId);
    }

    const intervalId = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % FRAME_COUNT);
    }, frameDurationMs);

    return () => clearInterval(intervalId);
  }, [currentAnim]);

  const scale = (size / SPRITE_FRAME_SIZE) * (CHARACTER_SIZE_MULTIPLIERS[characterId] || 1);
  const frameColumn = currentFrame % FRAME_COLUMNS;
  const frameRow = Math.floor(currentFrame / FRAME_COLUMNS);
  const backgroundPosition = `-${frameColumn * SPRITE_FRAME_SIZE}px -${frameRow * SPRITE_FRAME_SIZE}px`;

  const animStyles = {
    idle:      { backgroundImage: `url('${SPRITE_ASSET_BASE_PATH}/${characterId}-idle.webp')` },
    bored:     { backgroundImage: `url('${SPRITE_ASSET_BASE_PATH}/${characterId}-bored.webp')` },
    chomp:     { backgroundImage: `url('${SPRITE_ASSET_BASE_PATH}/${characterId}-chomp.webp')` },
    celebrate: { backgroundImage: `url('${SPRITE_ASSET_BASE_PATH}/${characterId}-celebrate.webp')` },
  };

  return (
    <div
      className={className}
      style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible', position: 'relative' }}
    >
      <div
        style={{
          width: SPRITE_FRAME_SIZE,
          height: SPRITE_FRAME_SIZE,
          transform: `scale(${scale})`,
          transformOrigin: 'center',
          overflow: 'visible',
          willChange: 'transform',
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${SPRITE_WIDTH}px ${SPRITE_HEIGHT}px`,
          backgroundPosition,
          ...animStyles[currentAnim],
        }}
      />
    </div>
  );
}
