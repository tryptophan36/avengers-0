import Link from "next/link";
import GameCanvas from "@/components/GameCanvas";

export default function GamePage() {
  return (
    <main className="game-page">
      <header className="game-header">
        <div>
          <p className="eyebrow">Stark Industries // Movement Lab</p>
          <h1>Training Protocol</h1>
        </div>
        <Link className="back-link" href="/">← Exit</Link>
      </header>

      <section className="game-shell" aria-label="Iron Man training simulation">
        <div className="game-frame">
          <GameCanvas />
          <div className="controls-strip" aria-label="Game controls">
            <span><strong>A / D</strong> move</span>
            <span><strong>W</strong> jump ×2</span>
            <span><strong>S</strong> crouch</span>
            <span><strong>↑</strong> look up</span>
            <span><strong>Shift</strong> sprint</span>
            <span><strong>→ / D ×2</strong> dash</span>
          </div>
        </div>
      </section>
    </main>
  );
}
