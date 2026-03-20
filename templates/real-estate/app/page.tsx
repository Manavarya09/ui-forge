"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

const House3D = dynamic(() => import("@/components/3d/house-scene").then((mod) => mod.House3D), {
  ssr: false,
  loading: () => <LoadingScreen />,
})

function LoadingScreen() {
  return (
    <div className="h-screen w-full bg-background flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-primary/30 rounded-full" />
        <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-foreground text-xl font-semibold">Muhammad Saad</p>
        <p className="text-foreground/60 text-sm">Loading portfolio...</p>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <main className="h-screen w-full overflow-hidden">
      <Suspense fallback={<LoadingScreen />}>
        <House3D />
      </Suspense>
    </main>
  )
}
