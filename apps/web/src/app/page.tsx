"use client";

import Link from "next/link";
import { LoginButton } from "@/shared/components";

// Category data with distinct theming
const CATEGORIES = [
  {
    id: "racing",
    title: "Racing & Driving",
    emoji: "🏎️",
    gradient: "from-red-500 via-orange-500 to-yellow-500",
    bgClass: "bg-gradient-to-br from-red-950 via-orange-950 to-yellow-950",
    items: [
      { href: "/games/monster-truck", emoji: "🚗", name: "Monster Truck" },
      { href: "/games/hill-climb", emoji: "🏔️", name: "Hill Climb" },
    ],
  },
  {
    id: "board",
    title: "Board Games",
    emoji: "♟️",
    gradient: "from-amber-400 via-yellow-500 to-lime-500",
    bgClass: "bg-gradient-to-br from-amber-950 via-yellow-950 to-lime-950",
    items: [
      { href: "/games/chess", emoji: "♟️", name: "Chess" },
      { href: "/games/checkers", emoji: "🔴", name: "Checkers" },
      { href: "/games/quoridor", emoji: "🧱", name: "Quoridor" },
    ],
  },
  {
    id: "arcade",
    title: "Arcade Classics",
    emoji: "🕹️",
    gradient: "from-green-400 via-emerald-500 to-teal-500",
    bgClass: "bg-gradient-to-br from-green-950 via-emerald-950 to-teal-950",
    items: [
      { href: "/games/flappy-bird", emoji: "🐦", name: "Flappy Bird" },
      { href: "/games/snake", emoji: "🐍", name: "Snake" },
      { href: "/games/2048", emoji: "🔢", name: "2048" },
      { href: "/games/memory-match", emoji: "🧠", name: "Memory Match" },
    ],
  },
  {
    id: "action",
    title: "Action Games",
    emoji: "🎮",
    gradient: "from-cyan-400 via-blue-500 to-indigo-500",
    bgClass: "bg-gradient-to-br from-cyan-950 via-blue-950 to-indigo-950",
    items: [
      { href: "/games/platformer", emoji: "🏃", name: "Platformer" },
      { href: "/games/endless-runner", emoji: "🏃‍♂️", name: "Endless Runner" },
      { href: "/games/cookie-clicker", emoji: "🍪", name: "Cookie Clicker" },
    ],
  },
  {
    id: "retro",
    title: "Retro Gaming",
    emoji: "🎰",
    gradient: "from-purple-400 via-fuchsia-500 to-pink-500",
    bgClass: "bg-gradient-to-br from-purple-950 via-fuchsia-950 to-pink-950",
    items: [
      { href: "/games/retro-arcade", emoji: "👾", name: "Retro Arcade" },
      { href: "/games/oregon-trail", emoji: "🤠", name: "Oregon Trail" },
    ],
  },
  {
    id: "apps",
    title: "Fun Apps",
    emoji: "📱",
    gradient: "from-pink-400 via-rose-500 to-red-500",
    bgClass: "bg-gradient-to-br from-pink-950 via-rose-950 to-red-950",
    items: [
      { href: "/apps/weather", emoji: "🌤️", name: "Weather" },
      { href: "/apps/toy-finder", emoji: "🧸", name: "Toy Finder" },
      { href: "/apps/joke-generator", emoji: "😂", name: "Jokes" },
    ],
  },
];

// Floating emojis for hero background
const FLOATING_EMOJIS = ["🎮", "🕹️", "🏆", "⭐", "🎯", "🚀", "💎", "🎪"];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">
      {/* Login Button - Fixed top-right */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-end p-4 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <LoginButton />
      </header>

      {/* Hero Section - Playful & Energetic */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-16">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-20" />

        {/* Floating emoji background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {FLOATING_EMOJIS.map((emoji, i) => (
            <span
              key={i}
              className="absolute text-4xl md:text-6xl opacity-10 animate-float"
              style={{
                left: `${10 + (i * 12) % 80}%`,
                top: `${15 + (i * 17) % 70}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + (i % 3)}s`,
              }}
            >
              {emoji}
            </span>
          ))}
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-4">
          {/* Bouncing game controller */}
          <div className="mb-6 animate-bounce-slow">
            <span className="text-7xl md:text-9xl drop-shadow-2xl filter">🎮</span>
          </div>

          {/* Title with gradient text */}
          <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
            Hank&apos;s Hits
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-white/70 mb-8 font-medium">
            Games, apps, and awesome stuff! 🚀
          </p>

          {/* Scroll hint */}
          <div className="animate-bounce mt-8">
            <span className="text-3xl">👇</span>
          </div>
        </div>
      </div>

      {/* Category Sections */}
      {CATEGORIES.map((category, categoryIndex) => (
        <section
          key={category.id}
          className={`relative py-12 md:py-16 px-4 ${category.bgClass}`}
        >
          {/* Section header */}
          <div className="max-w-6xl mx-auto mb-8">
            <h2 className="text-2xl md:text-4xl font-bold text-center">
              <span className={`bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent`}>
                {category.emoji} {category.title}
              </span>
            </h2>
          </div>

          {/* Game cards grid */}
          <div className="max-w-6xl mx-auto">
            <div className={`grid gap-4 md:gap-6 ${
              category.items.length <= 2
                ? 'grid-cols-2 max-w-md mx-auto'
                : category.items.length === 3
                  ? 'grid-cols-2 md:grid-cols-3 max-w-2xl mx-auto'
                  : 'grid-cols-2 md:grid-cols-4 max-w-4xl mx-auto'
            }`}>
              {category.items.map((item, itemIndex) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative"
                  style={{
                    animationDelay: `${categoryIndex * 0.1 + itemIndex * 0.05}s`,
                  }}
                >
                  {/* Card */}
                  <div className={`
                    relative overflow-hidden rounded-2xl md:rounded-3xl
                    bg-gradient-to-br from-white/10 to-white/5
                    border border-white/10
                    backdrop-blur-sm
                    p-4 md:p-6
                    transition-all duration-300 ease-out
                    hover:scale-105 hover:-translate-y-1
                    hover:shadow-2xl hover:shadow-white/10
                    hover:border-white/20
                    active:scale-95
                    cursor-pointer
                  `}>
                    {/* Glow effect on hover */}
                    <div className={`
                      absolute inset-0 opacity-0 group-hover:opacity-100
                      bg-gradient-to-br ${category.gradient}
                      blur-xl transition-opacity duration-300
                      -z-10
                    `} style={{ transform: 'scale(0.8)' }} />

                    {/* Emoji */}
                    <div className="text-center mb-2 md:mb-3">
                      <span className="text-5xl md:text-6xl lg:text-7xl block transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                        {item.emoji}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="text-base md:text-lg lg:text-xl font-bold text-center text-white/90 group-hover:text-white transition-colors">
                      {item.name}
                    </h3>

                    {/* Play indicator on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="absolute inset-0 bg-black/30 rounded-2xl md:rounded-3xl" />
                      <span className="relative text-3xl md:text-4xl animate-pulse">▶️</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/5 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-2xl mb-2">
            <span className="text-3xl">🎮</span> Hank&apos;s Hits
          </p>
          <p className="text-white/40 text-sm">
            Made for Hank with ❤️
          </p>
        </div>
      </footer>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
