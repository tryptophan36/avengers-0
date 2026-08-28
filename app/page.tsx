import Link from "next/link";

export default function Home() {
  return (
    <main className="landing-page">
      <div className="landing-grid" aria-hidden="true" />
      <section className="landing-card">
        <p className="eyebrow">Avengers Initiative // Prototype 01</p>
        <h1>Suit up.</h1>
        <p className="landing-copy">
          Test Iron Man&apos;s movement system in a pixel-art side-scrolling
          training ground.
        </p>
        <Link className="primary-link" href="/game">
          Launch simulation <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
