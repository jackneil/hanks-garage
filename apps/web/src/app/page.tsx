"use client";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300">
      {/* Hero Section */}
      <div className="hero min-h-[70vh]">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            {/* Logo/Title */}
            <div className="mb-8">
              <span className="text-8xl">🚗</span>
            </div>
            <h1 className="text-6xl font-bold text-primary mb-4">
              Hank&apos;s Hits
            </h1>
            <p className="text-2xl text-base-content/80 mb-8">
              Monster trucks, games, and awesome stuff!
            </p>

            {/* Main CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
              <a
                href="/games/monster-truck"
                className="btn btn-primary btn-lg text-xl gap-2"
              >
                <span className="text-2xl">🚗</span>
                Play Monster Truck
              </a>
              <a
                href="/games/hill-climb"
                className="btn btn-accent btn-lg text-xl gap-2"
              >
                <span className="text-2xl">🏔️</span>
                Hill Climb Racing
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* All Games Section */}
      <div className="py-16 px-4 bg-base-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            🎮 All Games
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Monster Truck */}
            <a href="/games/monster-truck" className="card bg-base-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
              <div className="card-body items-center text-center p-4">
                <span className="text-5xl mb-2">🚗</span>
                <h3 className="card-title text-lg">Monster Truck</h3>
              </div>
            </a>

            {/* Hill Climb */}
            <a href="/games/hill-climb" className="card bg-base-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
              <div className="card-body items-center text-center p-4">
                <span className="text-5xl mb-2">🏔️</span>
                <h3 className="card-title text-lg">Hill Climb</h3>
              </div>
            </a>

            {/* Flappy Bird */}
            <a href="/games/flappy-bird" className="card bg-base-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
              <div className="card-body items-center text-center p-4">
                <span className="text-5xl mb-2">🐦</span>
                <h3 className="card-title text-lg">Flappy Bird</h3>
              </div>
            </a>

            {/* Snake */}
            <a href="/games/snake" className="card bg-base-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
              <div className="card-body items-center text-center p-4">
                <span className="text-5xl mb-2">🐍</span>
                <h3 className="card-title text-lg">Snake</h3>
              </div>
            </a>

            {/* 2048 */}
            <a href="/games/2048" className="card bg-base-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
              <div className="card-body items-center text-center p-4">
                <span className="text-5xl mb-2">🔢</span>
                <h3 className="card-title text-lg">2048</h3>
              </div>
            </a>

            {/* Checkers */}
            <a href="/games/checkers" className="card bg-base-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
              <div className="card-body items-center text-center p-4">
                <span className="text-5xl mb-2">🔴</span>
                <h3 className="card-title text-lg">Checkers</h3>
              </div>
            </a>

            {/* Oregon Trail */}
            <a href="/games/oregon-trail" className="card bg-base-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
              <div className="card-body items-center text-center p-4">
                <span className="text-5xl mb-2">🤠</span>
                <h3 className="card-title text-lg">Oregon Trail</h3>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            What&apos;s Inside?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Monster Truck Card */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body items-center text-center">
                <span className="text-6xl mb-4">🚗</span>
                <h3 className="card-title text-xl">Monster Trucks</h3>
                <p className="text-base-content/70">
                  Drive big trucks through crazy terrain. Jump ramps and crush stuff!
                </p>
              </div>
            </div>

            {/* Collectibles Card */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body items-center text-center">
                <span className="text-6xl mb-4">⭐</span>
                <h3 className="card-title text-xl">Collect Stars</h3>
                <p className="text-base-content/70">
                  Find hidden stars scattered everywhere. How many can you get?
                </p>
              </div>
            </div>

            {/* Explore Card */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="card-body items-center text-center">
                <span className="text-6xl mb-4">🌍</span>
                <h3 className="card-title text-xl">Explore</h3>
                <p className="text-base-content/70">
                  Big open world to drive around. Find secret spots!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Info */}
      <div className="py-16 px-4 bg-base-200">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">How to Play</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mobile */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <span className="text-4xl mb-2">📱</span>
                <h3 className="text-xl font-bold">On Phone</h3>
                <ul className="text-left space-y-2 mt-4">
                  <li>📐 Tilt to steer</li>
                  <li>👆 Tap pedals for gas/brake</li>
                  <li>📯 Horn button to honk!</li>
                </ul>
              </div>
            </div>

            {/* Desktop */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <span className="text-4xl mb-2">💻</span>
                <h3 className="text-xl font-bold">On Computer</h3>
                <ul className="text-left space-y-2 mt-4">
                  <li>⬆️ W or Arrow keys to drive</li>
                  <li>⬅️➡️ A/D to steer</li>
                  <li>🔤 H to honk!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-8 bg-base-300 text-base-content">
        <div>
          <p className="text-lg">
            <span className="text-2xl">🚗</span> Hank&apos;s Hits
          </p>
          <p className="text-base-content/60">Made for Hank with ❤️</p>
        </div>
      </footer>
    </div>
  );
}
