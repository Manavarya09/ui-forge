export function MarqueeStrip() {
  const words = [
    "SNATCH",
    "CLEAN & JERK",
    "DEADLIFT",
    "THRUSTER",
    "MUSCLE-UP",
    "BOX JUMP",
    "WALL BALL",
    "BURPEE",
    "DOUBLE-UNDER",
    "HANDSTAND WALK",
  ]

  return (
    <div className="bg-accent overflow-hidden py-2.5 md:py-3 relative" role="marquee" aria-label="CrossFit movements">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...words, ...words].map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="font-sans text-lg md:text-3xl text-accent-foreground mx-3 md:mx-10 tracking-wider"
          >
            {word}
            <span className="text-accent-foreground/40 mx-3 md:mx-10">/</span>
          </span>
        ))}
      </div>
    </div>
  )
}
