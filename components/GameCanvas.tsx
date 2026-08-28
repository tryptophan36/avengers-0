"use client";

import { useEffect, useRef, useState } from "react";

export default function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<import("phaser").Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function mountGame() {
      if (!containerRef.current || gameRef.current) return;
      const { createGame } = await import("@/game/config/createGame");
      if (cancelled || !containerRef.current) return;
      gameRef.current = createGame(containerRef.current);
      setIsLoading(false);
    }

    void mountGame();
    return () => {
      cancelled = true;
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div ref={containerRef} className="game-canvas">
      {isLoading && <div className="game-loading">Initializing armor systems…</div>}
    </div>
  );
}
