/*
 * RexCharacter — DotLottie-powered animated dinosaur character
 *
 * Speed (via DotLottie instance):
 *   idle        → 0.8× (calm)
 *   hungry      → 1.6× (fidgety)
 *   eating      → 1.2× (energetic)
 *   celebrating → 1.4× (excited)
 *
 * NOTE: Frame-segment control (idle / mouth-open / chew ranges) is intentionally
 * disabled until the actual frame layout of the animation is confirmed in the
 * LottieFiles editor. Calling setSegment() with wrong frame numbers freezes the
 * player. Visual state feedback is handled via CSS classes + speed only.
 */

import { useEffect, useRef, useMemo, useCallback } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import type { DotLottie } from "@lottiefiles/dotlottie-react";

export type RexState = "idle" | "hungry" | "eating" | "celebrating";
export type EatPhase = "none" | "jaw-open" | "chomp" | "done";

interface RexCharacterProps {
  state: RexState;
  eatPhase?: EatPhase;
  themeColor?: string;
  className?: string;
  /** Width/height of the Lottie container */
  size?: number;
}

const LOTTIE_URL =
  "https://lottie.host/0129f989-92eb-46a0-bf07-7ada238baf09/b6UdOj7mvb.lottie";

// Speed feedback — safe to call at any time, never freezes
const SPEED: Record<RexState, number> = {
  idle: 0.8,
  hungry: 1.6,
  eating: 1.2,
  celebrating: 1.4,
};

export default function RexCharacter({
  state,
  eatPhase = "none",
  className = "",
  size = 160,
}: RexCharacterProps) {
  const dotLottieRef = useRef<DotLottie | null>(null);

  // Stable ref callback — must NOT be an inline arrow fn or DotLottieReact
  // will tear down and remount the player on every render
  const dotLottieRefCallback = useCallback((instance: DotLottie | null) => {
    dotLottieRef.current = instance;
  }, []);

  // Apply speed once the animation has loaded
  useEffect(() => {
    const dl = dotLottieRef.current;
    if (!dl) return;

    const onLoad = () => {
      dl.setSpeed(SPEED[state]);
    };

    dl.addEventListener("load", onLoad);
    if (dl.isLoaded) onLoad();

    return () => {
      dl.removeEventListener("load", onLoad);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Speed toggle whenever state changes
  useEffect(() => {
    const dl = dotLottieRef.current;
    if (!dl || !dl.isLoaded) return;
    dl.setSpeed(SPEED[state]);
  }, [state]);

  // CSS overlay class — visual state cues without touching the player
  const wrapperClass = useMemo(() => {
    const classes = ["rex-lottie-wrapper"];
    if (state === "hungry") classes.push("rex-lottie-hungry");
    else if (state === "eating" && eatPhase === "chomp") classes.push("rex-lottie-chomp");
    else if (state === "celebrating") classes.push("rex-lottie-celebrating");
    else if (state === "idle") classes.push("rex-lottie-idle");
    return classes.join(" ");
  }, [state, eatPhase]);

  return (
    <div className={`relative ${className}`}>
      <div className={wrapperClass}>
        <DotLottieReact
          src={LOTTIE_URL}
          loop
          autoplay
          dotLottieRefCallback={dotLottieRefCallback}
          style={{ width: size, height: size }}
        />
      </div>
    </div>
  );
}
