"use client"

import { GameProvider } from "@/components/game-state";
import { HomePage } from "@/components/pages/home-page";

console.log("HomePage render");


export default function Page() {
  return (
    <GameProvider>
      <main className="min-h-screen items-center justify-center">
        <HomePage />
      </main>
    </GameProvider>
  )
}
