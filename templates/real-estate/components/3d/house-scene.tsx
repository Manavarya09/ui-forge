"use client"

import type React from "react"

import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls, PerspectiveCamera, Html, Float, Text, RoundedBox } from "@react-three/drei"
import { useState, useRef, useEffect } from "react"
import type * as THREE from "three"
import portfolioData from "@/data/portfolio.json"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Home,
  User,
  Code,
  Briefcase,
  FolderOpen,
  MessageSquare,
  Server,
  Smartphone,
  Layout,
  Database,
  Terminal,
} from "lucide-react"

const themeColors = {
  dark: {
    floor: "#0a0a0f",
    wall: "#0d0d15",
    desk: "#1a1a24",
    panel: "#0a0a0f",
    text: "#ffffff",
    textMuted: "#94a3b8",
    roomBg: "#0f172a",
  },
  light: {
    floor: "#f1f5f9",
    wall: "#e2e8f0",
    desk: "#cbd5e1",
    panel: "#f8fafc",
    text: "#0f172a",
    textMuted: "#475569",
    roomBg: "#f1f5f9",
  },
}

const rooms = [
  { id: "entrance", name: "Entrance", icon: Home, position: [0, 0, 0] as [number, number, number] },
  { id: "about", name: "About", icon: User, position: [15, 0, 0] as [number, number, number] },
  { id: "skills", name: "Skills", icon: Code, position: [30, 0, 0] as [number, number, number] },
  { id: "experience", name: "Experience", icon: Briefcase, position: [45, 0, 0] as [number, number, number] },
  { id: "projects", name: "Projects", icon: FolderOpen, position: [60, 0, 0] as [number, number, number] },
  { id: "contact", name: "Contact", icon: MessageSquare, position: [75, 0, 0] as [number, number, number] },
]

function Room({
  position,
  children,
  color,
  isDark = true,
}: { position: [number, number, number]; children: React.ReactNode; color?: string; isDark?: boolean }) {
  const colors = isDark ? themeColors.dark : themeColors.light
  const roomColor = color || colors.roomBg

  return (
    <group position={position}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color={roomColor} roughness={0.8} />
      </mesh>
      {/* Back Wall */}
      <mesh position={[0, 2, -7]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color={roomColor} roughness={0.9} />
      </mesh>
      {/* Left Wall */}
      <mesh position={[-7, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color={roomColor} roughness={0.9} />
      </mesh>
      {/* Right Wall */}
      <mesh position={[7, 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color={roomColor} roughness={0.9} />
      </mesh>
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 7, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color={roomColor} roughness={0.9} />
      </mesh>
      {children}
    </group>
  )
}

function FloatingFrame({
  position,
  rotation = [0, 0, 0],
  children,
  size = [4, 3],
  isDark = true,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  children: React.ReactNode
  size?: [number, number]
  isDark?: boolean
}) {
  const colors = isDark ? themeColors.dark : themeColors.light

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
      <group position={position} rotation={rotation as any}>
        {/* Frame */}
        <mesh castShadow>
          <boxGeometry args={[size[0] + 0.3, size[1] + 0.3, 0.1]} />
          <meshStandardMaterial color="#14b8a6" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Inner Frame */}
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[size[0], size[1], 0.05]} />
          <meshStandardMaterial color={colors.panel} />
        </mesh>
        {/* Content */}
        <Html transform position={[0, 0, 0.15]} scale={0.4} center>
          <div className="w-[400px] text-center">{children}</div>
        </Html>
      </group>
    </Float>
  )
}

function ColorfulRoom({
  position,
  children,
  isDark = true,
}: { position: [number, number, number]; children: React.ReactNode; isDark?: boolean }) {
  const colors = isDark ? themeColors.dark : themeColors.light

  return (
    <group position={position}>
      {/* Floor with gradient effect */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color={colors.floor} roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 2, -7]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color={colors.wall} roughness={0.9} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-7, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color={colors.wall} roughness={0.9} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[7, 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color={colors.wall} roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 7, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color={colors.floor} roughness={0.9} />
      </mesh>

      {/* Colorful accent lights on walls */}
      <mesh position={[-6.5, 5, -6.9]}>
        <boxGeometry args={[0.1, 4, 0.1]} />
        <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={2} />
      </mesh>
      <mesh position={[6.5, 5, -6.9]}>
        <boxGeometry args={[0.1, 4, 0.1]} />
        <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, 6.8, -6.9]}>
        <boxGeometry args={[13, 0.1, 0.1]} />
        <meshStandardMaterial color="#2dd4bf" emissive="#2dd4bf" emissiveIntensity={1.5} />
      </mesh>

      {/* Side wall neon accents */}
      <mesh position={[-6.9, 0, -5]}>
        <boxGeometry args={[0.1, 0.1, 4]} />
        <meshStandardMaterial color="#fb923c" emissive="#fb923c" emissiveIntensity={2} />
      </mesh>
      <mesh position={[6.9, 0, -5]}>
        <boxGeometry args={[0.1, 0.1, 4]} />
        <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={2} />
      </mesh>

      {/* Floor LED strips */}
      <mesh position={[0, -2.95, -6.9]}>
        <boxGeometry args={[14, 0.08, 0.08]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={2} />
      </mesh>
      <mesh position={[-6.9, -2.95, 0]}>
        <boxGeometry args={[0.08, 0.08, 14]} />
        <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={2} />
      </mesh>
      <mesh position={[6.9, -2.95, 0]}>
        <boxGeometry args={[0.08, 0.08, 14]} />
        <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={2} />
      </mesh>

      {children}
    </group>
  )
}

function RealisticFlowerPot({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Terracotta pot - outer */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.08, 0.24, 16]} />
        <meshStandardMaterial color="#c2410c" roughness={0.85} />
      </mesh>

      {/* Pot rim - top ring */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <torusGeometry args={[0.12, 0.015, 16, 32]} />
        <meshStandardMaterial color="#9a3412" roughness={0.8} />
      </mesh>

      {/* Pot bottom ring */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <torusGeometry args={[0.08, 0.01, 16, 32]} />
        <meshStandardMaterial color="#7c2d12" roughness={0.9} />
      </mesh>

      {/* Soil surface */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.04, 16]} />
        <meshStandardMaterial color="#3d2314" roughness={1} />
      </mesh>

      {/* Main thick stem */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.025, 0.32, 12]} />
        <meshStandardMaterial color="#15803d" roughness={0.6} />
      </mesh>

      {/* Branch stems */}
      <mesh position={[-0.04, 0.35, 0.02]} rotation={[0.4, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.008, 0.012, 0.15, 8]} />
        <meshStandardMaterial color="#22c55e" roughness={0.6} />
      </mesh>
      <mesh position={[0.04, 0.38, -0.02]} rotation={[-0.35, 0, 0.35]} castShadow>
        <cylinderGeometry args={[0.008, 0.012, 0.14, 8]} />
        <meshStandardMaterial color="#22c55e" roughness={0.6} />
      </mesh>
      <mesh position={[0.02, 0.4, 0.04]} rotation={[0.3, 0.2, 0.2]} castShadow>
        <cylinderGeometry args={[0.006, 0.01, 0.12, 8]} />
        <meshStandardMaterial color="#22c55e" roughness={0.6} />
      </mesh>

      {/* Large leaves - bottom layer */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <mesh
          key={`leaf-b-${i}`}
          position={[
            Math.cos((i * Math.PI * 2) / 8) * 0.1,
            0.35 + Math.random() * 0.05,
            Math.sin((i * Math.PI * 2) / 8) * 0.1,
          ]}
          rotation={[0.6 + Math.random() * 0.2, (i * Math.PI * 2) / 8, 0.4]}
          castShadow
        >
          <sphereGeometry args={[0.055, 16, 12]} />
          <meshStandardMaterial color="#16a34a" roughness={0.5} />
        </mesh>
      ))}

      {/* Medium leaves - middle layer */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={`leaf-m-${i}`}
          position={[Math.cos((i * Math.PI * 2) / 6 + 0.3) * 0.07, 0.45, Math.sin((i * Math.PI * 2) / 6 + 0.3) * 0.07]}
          rotation={[0.5, (i * Math.PI * 2) / 6 + 0.3, 0.3]}
          castShadow
        >
          <sphereGeometry args={[0.04, 16, 12]} />
          <meshStandardMaterial color="#4ade80" roughness={0.45} />
        </mesh>
      ))}

      {/* Small leaves - top layer */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={`leaf-t-${i}`}
          position={[Math.cos((i * Math.PI * 2) / 5 + 0.5) * 0.04, 0.52, Math.sin((i * Math.PI * 2) / 5 + 0.5) * 0.04]}
          rotation={[0.35, (i * Math.PI * 2) / 5 + 0.5, 0.2]}
          castShadow
        >
          <sphereGeometry args={[0.03, 16, 12]} />
          <meshStandardMaterial color="#86efac" roughness={0.4} />
        </mesh>
      ))}

      {/* Flowers */}
      <mesh position={[0, 0.58, 0]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.05, 0.52, 0.03]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="#fb7185" emissive="#fb7185" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0.04, 0.55, -0.03]}>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshStandardMaterial color="#c084fc" emissive="#c084fc" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0.02, 0.5, 0.05]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

function Bookshelf({ position, isDark = true }: { position: [number, number, number]; isDark?: boolean }) {
  const bookColors = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"]

  return (
    <group position={position}>
      {/* Shelf frame */}
      <RoundedBox args={[1.5, 2.2, 0.35]} radius={0.02}>
        <meshStandardMaterial color={isDark ? "#1a1a24" : "#94a3b8"} roughness={0.6} />
      </RoundedBox>

      {/* Shelves */}
      {[-0.7, -0.1, 0.5].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <boxGeometry args={[1.4, 0.04, 0.32]} />
          <meshStandardMaterial color={isDark ? "#2d2d3a" : "#cbd5e1"} roughness={0.5} />
        </mesh>
      ))}

      {/* Books on shelves */}
      {[-0.7, -0.1, 0.5].map((shelfY, shelfIndex) => (
        <group key={shelfIndex}>
          {[...Array(5)].map((_, bookIndex) => (
            <mesh key={bookIndex} position={[-0.5 + bookIndex * 0.25, shelfY + 0.22, 0]} castShadow>
              <boxGeometry args={[0.08, 0.35 - Math.random() * 0.1, 0.22]} />
              <meshStandardMaterial
                color={bookColors[(shelfIndex * 5 + bookIndex) % bookColors.length]}
                roughness={0.7}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

function WallClock({ position, isDark = true }: { position: [number, number, number]; isDark?: boolean }) {
  return (
    <group position={position}>
      {/* Clock face */}
      <mesh castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.05, 16]} />
        <meshStandardMaterial color={isDark ? "#1a1a24" : "#f8fafc"} roughness={0.3} />
      </mesh>

      {/* Clock rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.4, 0.03, 16, 48]} />
        <meshStandardMaterial color="#14b8a6" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Hour markers */}
      {[...Array(12)].map((_, i) => (
        <mesh
          key={i}
          position={[Math.sin((i * Math.PI * 2) / 12) * 0.32, Math.cos((i * Math.PI * 2) / 12) * 0.32, 0.03]}
        >
          <boxGeometry args={[0.02, 0.06, 0.01]} />
          <meshStandardMaterial color={isDark ? "#fff" : "#1e293b"} />
        </mesh>
      ))}

      {/* Hour hand */}
      <mesh position={[0.08, 0.08, 0.04]} rotation={[0, 0, -0.8]}>
        <boxGeometry args={[0.02, 0.18, 0.01]} />
        <meshStandardMaterial color="#f472b6" />
      </mesh>

      {/* Minute hand */}
      <mesh position={[0, 0.12, 0.045]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.015, 0.26, 0.01]} />
        <meshStandardMaterial color="#818cf8" />
      </mesh>

      {/* Center dot */}
      <mesh position={[0, 0, 0.05]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={1} />
      </mesh>
    </group>
  )
}

function FloorLamp({ position, isDark = true }: { position: [number, number, number]; isDark?: boolean }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.28, 0.04, 12]} />
        <meshStandardMaterial color={isDark ? "#1a1a24" : "#6b7280"} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Pole */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 2.4, 8]} />
        <meshStandardMaterial color={isDark ? "#2d2d3a" : "#9ca3af"} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Lamp shade */}
      <mesh position={[0, 2.3, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.35, 0.4, 12]} />
        <meshStandardMaterial color={isDark ? "#0f172a" : "#f1f5f9"} roughness={0.9} side={2} />
      </mesh>

      {/* Light bulb glow */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={isDark ? 2 : 3} />
      </mesh>

      {/* Actual light */}
      <pointLight position={[0, 2.1, 0]} intensity={isDark ? 12 : 8} color="#fef3c7" distance={5} />
    </group>
  )
}

function AreaRug({ position, isDark = true }: { position: [number, number, number]; isDark?: boolean }) {
  return (
    <group position={position}>
      {/* Main rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 2.5]} />
        <meshStandardMaterial color={isDark ? "#1e3a5f" : "#bfdbfe"} roughness={0.95} />
      </mesh>

      {/* Rug border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.001]}>
        <ringGeometry args={[1.8, 2, 4]} />
        <meshStandardMaterial color="#14b8a6" roughness={0.9} transparent opacity={0.6} />
      </mesh>

      {/* Decorative pattern - center */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.002]}>
        <circleGeometry args={[0.5, 32]} />
        <meshStandardMaterial color="#f472b6" roughness={0.9} transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

function WallArt({
  position,
  rotation = [0, 0, 0] as [number, number, number],
  isDark = true,
}: { position: [number, number, number]; rotation?: [number, number, number]; isDark?: boolean }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <RoundedBox args={[1.2, 0.9, 0.08]} radius={0.02}>
        <meshStandardMaterial color={isDark ? "#2d2d3a" : "#d1d5db"} metalness={0.3} roughness={0.5} />
      </RoundedBox>

      {/* Canvas */}
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[1, 0.7]} />
        <meshStandardMaterial color="#0ea5e9" />
      </mesh>

      {/* Abstract art shapes */}
      <mesh position={[-0.2, 0.1, 0.05]}>
        <circleGeometry args={[0.15, 32]} />
        <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.2, -0.1, 0.05]}>
        <circleGeometry args={[0.12, 32]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.1, 0.15, 0.05]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[0.15, 0.15]} />
        <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

function ModernDesk({ position, isDark = true }: { position: [number, number, number]; isDark?: boolean }) {
  const colors = isDark ? themeColors.dark : themeColors.light

  return (
    <group position={position}>
      {/* Desktop surface - sleek */}
      <RoundedBox args={[4, 0.08, 1.8]} radius={0.02} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={colors.desk} roughness={0.2} metalness={0.3} />
      </RoundedBox>

      {/* Left leg - angular modern */}
      <mesh position={[-1.7, -0.75, 0]} castShadow>
        <boxGeometry args={[0.08, 1.4, 1.6]} />
        <meshStandardMaterial color={isDark ? "#2d2d3a" : "#94a3b8"} roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Right leg */}
      <mesh position={[1.7, -0.75, 0]} castShadow>
        <boxGeometry args={[0.08, 1.4, 1.6]} />
        <meshStandardMaterial color={isDark ? "#2d2d3a" : "#94a3b8"} roughness={0.3} metalness={0.4} />
      </mesh>

      {/* RGB underglow strip - front */}
      <mesh position={[0, -0.1, 0.85]}>
        <boxGeometry args={[3.8, 0.06, 0.06]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={3} />
      </mesh>

      {/* RGB underglow strip - back */}
      <mesh position={[0, -0.1, -0.85]}>
        <boxGeometry args={[3.8, 0.06, 0.06]} />
        <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={3} />
      </mesh>

      {/* RGB side strips */}
      <mesh position={[-1.85, -0.1, 0]}>
        <boxGeometry args={[0.06, 0.06, 1.6]} />
        <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={3} />
      </mesh>
      <mesh position={[1.85, -0.1, 0]}>
        <boxGeometry args={[0.06, 0.06, 1.6]} />
        <meshStandardMaterial color="#fb923c" emissive="#fb923c" emissiveIntensity={3} />
      </mesh>
    </group>
  )
}

function ModernGamingChair({ position, isDark = true }: { position: [number, number, number]; isDark?: boolean }) {
  return (
    <group position={position}>
      {/* Seat */}
      <RoundedBox args={[1.1, 0.15, 1.1]} radius={0.05} position={[0, 0, 0]} castShadow>
        <meshStandardMaterial color={isDark ? "#1a1a24" : "#374151"} roughness={0.5} />
      </RoundedBox>

      {/* Back rest */}
      <RoundedBox args={[1.1, 1.5, 0.15]} radius={0.05} position={[0, 0.85, -0.5]} rotation={[0.15, 0, 0]} castShadow>
        <meshStandardMaterial color={isDark ? "#1a1a24" : "#374151"} roughness={0.5} />
      </RoundedBox>

      {/* Colorful side wings - left */}
      <mesh position={[-0.6, 0.7, -0.35]} rotation={[0.1, 0, -0.15]} castShadow>
        <boxGeometry args={[0.12, 1.2, 0.5]} />
        <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={0.3} roughness={0.4} />
      </mesh>

      {/* Colorful side wings - right */}
      <mesh position={[0.6, 0.7, -0.35]} rotation={[0.1, 0, 0.15]} castShadow>
        <boxGeometry args={[0.12, 1.2, 0.5]} />
        <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={0.3} roughness={0.4} />
      </mesh>

      {/* Headrest */}
      <RoundedBox args={[0.5, 0.3, 0.12]} radius={0.03} position={[0, 1.55, -0.55]} rotation={[0.2, 0, 0]} castShadow>
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={0.2} roughness={0.4} />
      </RoundedBox>

      {/* Armrests */}
      <RoundedBox args={[0.12, 0.08, 0.5]} radius={0.02} position={[-0.55, 0.25, 0.15]} castShadow>
        <meshStandardMaterial color={isDark ? "#2d2d3a" : "#6b7280"} roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[0.12, 0.08, 0.5]} radius={0.02} position={[0.55, 0.25, 0.15]} castShadow>
        <meshStandardMaterial color={isDark ? "#2d2d3a" : "#6b7280"} roughness={0.3} />
      </RoundedBox>

      {/* Chair base */}
      <mesh position={[0, -0.4, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.7]} />
        <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Star base */}
      <mesh position={[0, -0.75, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.06]} />
        <meshStandardMaterial color={isDark ? "#1a1a24" : "#4b5563"} metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Wheels with RGB */}
      {[0, 1, 2, 3, 4].map((i) => (
        <group key={i} position={[Math.cos((i * Math.PI * 2) / 5) * 0.5, -0.85, Math.sin((i * Math.PI * 2) / 5) * 0.5]}>
          <mesh>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#111" roughness={0.7} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.06, 0.015, 8, 16]} />
            <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={1} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Monitor({
  position,
  rotation = [0, 0, 0],
}: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation as any}>
      {/* Monitor bezel */}
      <mesh castShadow>
        <boxGeometry args={[1.8, 1.1, 0.08]} />
        <meshStandardMaterial color="#1a1a24" roughness={0.3} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[1.65, 0.95]} />
        <meshStandardMaterial color="#0a192f" emissive="#14b8a6" emissiveIntensity={0.1} />
      </mesh>
      {/* Monitor stand */}
      <mesh position={[0, -0.7, 0.1]} castShadow>
        <boxGeometry args={[0.15, 0.4, 0.15]} />
        <meshStandardMaterial color="#1a1a24" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Monitor base */}
      <mesh position={[0, -0.9, 0.2]} castShadow>
        <boxGeometry args={[0.6, 0.05, 0.4]} />
        <meshStandardMaterial color="#1a1a24" metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  )
}

function UltrawideMonitor({
  position,
  rotation = [0, 0, 0],
  showSkills = false,
  isDark = true,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  showSkills?: boolean
  isDark?: boolean
}) {
  const { skills } = portfolioData

  const skillIcons: Record<string, React.ReactNode> = {
    "Backend & ERP": <Server className="w-6 h-6" />,
    "Mobile Development": <Smartphone className="w-6 h-6" />,
    Frontend: <Layout className="w-6 h-6" />,
    "Databases & Tools": <Database className="w-6 h-6" />,
  }

  const skillColors = ["#f472b6", "#818cf8", "#2dd4bf", "#fb923c"]

  return (
    <group position={position} rotation={rotation as any}>
      {/* Monitor curved bezel */}
      <mesh castShadow>
        <boxGeometry args={[3, 1.3, 0.1]} />
        <meshStandardMaterial color={isDark ? "#0a0a0f" : "#d1d5db"} roughness={0.2} metalness={0.5} />
      </mesh>

      {/* Screen */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[2.85, 1.15]} />
        <meshStandardMaterial
          color={isDark ? "#0f172a" : "#f8fafc"}
          emissive={isDark ? "#14b8a6" : "#0ea5e9"}
          emissiveIntensity={isDark ? 0.08 : 0.02}
        />
      </mesh>

      {/* RGB strip on bottom */}
      <mesh position={[0, -0.6, 0.06]}>
        <boxGeometry args={[2.9, 0.04, 0.02]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={2} />
      </mesh>

      {/* Monitor stand - modern V shape */}
      <mesh position={[0, -0.85, 0.3]} castShadow>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color={isDark ? "#1a1a24" : "#9ca3af"} metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[0, -1.05, 0.4]} rotation={[-0.3, 0, 0]} castShadow>
        <boxGeometry args={[1.2, 0.04, 0.6]} />
        <meshStandardMaterial color={isDark ? "#1a1a24" : "#9ca3af"} metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Content on screen - improved visibility */}
      <Html transform position={[0, 0, 0.1]} scale={0.18} center>
        {showSkills ? (
          <div
            className="w-[700px] p-5 rounded-xl shadow-2xl"
            style={{
              backgroundColor: isDark ? "rgba(15, 23, 42, 0.98)" : "rgba(255, 255, 255, 0.98)",
              border: `2px solid ${isDark ? "#14b8a6" : "#0d9488"}`,
            }}
          >
            <h3
              className="text-xl font-bold mb-4 tracking-wide"
              style={{ color: "#14b8a6", textShadow: isDark ? "0 0 10px #14b8a6" : "none" }}
            >
              MY SKILLS
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {skills.categories.map((category, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border-2"
                  style={{
                    backgroundColor: `${skillColors[i]}10`,
                    borderColor: skillColors[i],
                  }}
                >
                  <div className="flex items-center gap-3 mb-3" style={{ color: skillColors[i] }}>
                    {skillIcons[category.title] || <Code className="w-6 h-6" />}
                    <span className="font-bold text-base">{category.title}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.slice(0, 4).map((skill, j) => (
                      <span
                        key={j}
                        className="text-sm px-3 py-1 rounded-full font-medium"
                        style={{
                          backgroundColor: `${skillColors[i]}25`,
                          color: isDark ? "#fff" : skillColors[i],
                          border: `1px solid ${skillColors[i]}`,
                        }}
                      >
                        {skill.split(" ")[0]}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="w-[700px] p-5 rounded-xl shadow-2xl"
            style={{
              backgroundColor: isDark ? "rgba(15, 23, 42, 0.98)" : "rgba(255, 255, 255, 0.98)",
              border: `2px solid ${isDark ? "#14b8a6" : "#0d9488"}`,
            }}
          >
            <div className="flex items-center justify-center gap-4 mb-3">
              <Terminal className="w-8 h-8" style={{ color: "#14b8a6" }} />
              <span
                className="font-mono text-2xl font-bold"
                style={{ color: "#14b8a6", textShadow: isDark ? "0 0 10px #14b8a6" : "none" }}
              >
                WELCOME
              </span>
            </div>
            <p className="font-mono text-base" style={{ color: isDark ? "#94a3b8" : "#475569" }}>
              {">"} Ready to code amazing things...
            </p>
            <div className="mt-3 flex gap-2 justify-center">
              {["#f472b6", "#818cf8", "#2dd4bf", "#fb923c"].map((color, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ backgroundColor: color, animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </Html>
    </group>
  )
}

function Keyboard({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[1, 0.05, 0.4]} />
        <meshStandardMaterial color="#1a1a24" roughness={0.4} />
      </mesh>
      {/* RGB strip */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[0.95, 0.01, 0.35]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

function RGBKeyboard({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RoundedBox args={[1.2, 0.04, 0.45]} radius={0.01} castShadow>
        <meshStandardMaterial color="#0a0a0f" roughness={0.3} />
      </RoundedBox>

      {/* RGB backlight rows */}
      {[-0.15, -0.05, 0.05, 0.15].map((z, i) => (
        <mesh key={i} position={[0, 0.025, z]}>
          <boxGeometry args={[1.1, 0.008, 0.06]} />
          <meshStandardMaterial
            color={["#f472b6", "#818cf8", "#2dd4bf", "#fb923c"][i]}
            emissive={["#f472b6", "#818cf8", "#2dd4bf", "#fb923c"][i]}
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
    </group>
  )
}

function Mouse({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.15, 0.05, 0.25]} />
        <meshStandardMaterial color="#1a1a24" roughness={0.4} />
      </mesh>
      {/* RGB accent */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[0.05, 0.01, 0.15]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={1} />
      </mesh>
    </group>
  )
}

function RGBMouse({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RoundedBox args={[0.15, 0.04, 0.28]} radius={0.02} castShadow>
        <meshStandardMaterial color="#0a0a0f" roughness={0.3} />
      </RoundedBox>

      <mesh position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.08, 0.01, 8, 24]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={2} />
      </mesh>

      {/* Scroll wheel - fixed rotation */}
      <mesh position={[0, 0.03, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.04, 12]} />
        <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={1} />
      </mesh>
    </group>
  )
}

function PCTower({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Main case */}
      <mesh castShadow>
        <boxGeometry args={[0.5, 1.2, 0.6]} />
        <meshStandardMaterial color="#1a1a24" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Glass panel */}
      <mesh position={[0.26, 0, 0]}>
        <boxGeometry args={[0.02, 1, 0.5]} />
        <meshStandardMaterial color="#14b8a6" transparent opacity={0.2} />
      </mesh>
      {/* RGB fans visible through glass */}
      <mesh position={[0.2, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.02]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={1} />
      </mesh>
      <mesh position={[0.2, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.02]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={1} />
      </mesh>
      {/* Power LED */}
      <mesh position={[0, 0.5, 0.31]}>
        <boxGeometry args={[0.02, 0.02, 0.02]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={3} />
      </mesh>
    </group>
  )
}

function ModernPCTower({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Main case */}
      <RoundedBox args={[0.5, 1.3, 0.55]} radius={0.03} castShadow>
        <meshStandardMaterial color="#0a0a0f" roughness={0.2} metalness={0.3} />
      </RoundedBox>

      {/* Glass panel with tint */}
      <mesh position={[0.26, 0, 0]}>
        <planeGeometry args={[1.1, 0.45]} />
        <meshStandardMaterial color="#14b8a6" transparent opacity={0.15} />
      </mesh>

      {/* RGB fans visible through glass - fixed torusGeometry */}
      <Float speed={3} rotationIntensity={0} floatIntensity={0}>
        <mesh position={[0.2, 0.35, 0.05]}>
          <torusGeometry args={[0.12, 0.02, 8, 24]} />
          <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={2} />
        </mesh>
      </Float>
      <Float speed={3.5} rotationIntensity={0} floatIntensity={0}>
        <mesh position={[0.2, -0.1, 0.05]}>
          <torusGeometry args={[0.12, 0.02, 8, 24]} />
          <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={2} />
        </mesh>
      </Float>
      <Float speed={4} rotationIntensity={0} floatIntensity={0}>
        <mesh position={[0.2, -0.55, 0.05]}>
          <torusGeometry args={[0.1, 0.02, 8, 24]} />
          <meshStandardMaterial color="#2dd4bf" emissive="#2dd4bf" emissiveIntensity={2} />
        </mesh>
      </Float>

      {/* Front IO - Power button - fixed cylinderGeometry rotation */}
      <mesh position={[0, 0.55, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={3} />
      </mesh>

      {/* Front RGB strip */}
      <mesh position={[-0.22, 0, 0.28]}>
        <boxGeometry args={[0.03, 1, 0.02]} />
        <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={2} />
      </mesh>
    </group>
  )
}

function ModernWallDisplay({ position, isDark = true }: { position: [number, number, number]; isDark?: boolean }) {
  const { personal } = portfolioData
  const colors = isDark ? themeColors.dark : themeColors.light

  return (
    <group position={position}>
      {/* Main display panel - larger */}
      <RoundedBox args={[11, 5.5, 0.15]} radius={0.1}>
        <meshStandardMaterial color={colors.panel} roughness={0.8} />
      </RoundedBox>

      {/* Glowing borders - multi-color */}
      <mesh position={[-5.4, 0, 0.08]}>
        <boxGeometry args={[0.1, 5.3, 0.02]} />
        <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[5.4, 0, 0.08]}>
        <boxGeometry args={[0.1, 5.3, 0.02]} />
        <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[0, 2.65, 0.08]}>
        <boxGeometry args={[10.9, 0.1, 0.02]} />
        <meshStandardMaterial color="#2dd4bf" emissive="#2dd4bf" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[0, -2.65, 0.08]}>
        <boxGeometry args={[10.9, 0.1, 0.02]} />
        <meshStandardMaterial color="#fb923c" emissive="#fb923c" emissiveIntensity={2.5} />
      </mesh>

      {/* Name text - much larger */}
      <Text
        position={[0, 1.5, 0.1]}
        fontSize={1.1}
        color={colors.text}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor={isDark ? "#000" : "#fff"}
        depthOffset={-1}
      >
        {personal.name}
      </Text>

      {/* Decorative line under name */}
      <mesh position={[0, 0.8, 0.1]}>
        <boxGeometry args={[5, 0.08, 0.02]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={2.5} />
      </mesh>

      {/* Title - larger */}
      <Text
        position={[0, 0.3, 0.1]}
        fontSize={0.5}
        color="#14b8a6"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor={isDark ? "#000" : "#fff"}
      >
        {personal.title}
      </Text>

      {/* Tagline - larger */}
      <Text
        position={[0, -0.3, 0.1]}
        fontSize={0.28}
        color={colors.textMuted}
        anchorX="center"
        anchorY="middle"
        maxWidth={9}
        textAlign="center"
      >
        {personal.tagline}
      </Text>

      {/* Specializations with colors - much larger and clearer */}
      <Html transform position={[0, -1.4, 0.2]} scale={0.35} center>
        <div className="flex flex-wrap gap-4 justify-center w-[800px]">
          {personal.specializations.map((spec, i) => {
            const specColors = ["#f472b6", "#818cf8", "#2dd4bf", "#fb923c"]
            return (
              <span
                key={i}
                className="px-6 py-3 rounded-full text-lg font-bold border-3 shadow-xl"
                style={{
                  backgroundColor: isDark ? `${specColors[i]}40` : `${specColors[i]}25`,
                  borderColor: specColors[i],
                  borderWidth: "3px",
                  color: isDark ? "#fff" : "#1e293b",
                  textShadow: isDark
                    ? `0 0 12px ${specColors[i]}, 0 2px 4px rgba(0,0,0,0.5)`
                    : "0 1px 2px rgba(0,0,0,0.2)",
                  boxShadow: `0 0 20px ${specColors[i]}50`,
                }}
              >
                {spec}
              </span>
            )
          })}
        </div>
      </Html>

      {/* Corner decorations - larger */}
      {[
        [-5.1, 2.35, "#f472b6"],
        [5.1, 2.35, "#818cf8"],
        [-5.1, -2.35, "#fb923c"],
        [5.1, -2.35, "#2dd4bf"],
      ].map(([x, y, color], i) => (
        <mesh key={i} position={[x as number, y as number, 0.1]}>
          <boxGeometry args={[0.35, 0.35, 0.06]} />
          <meshStandardMaterial color={color as string} emissive={color as string} emissiveIntensity={2} />
        </mesh>
      ))}
    </group>
  )
}

function Shelf({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Shelf board */}
      <mesh castShadow>
        <boxGeometry args={[2, 0.08, 0.4]} />
        <meshStandardMaterial color="#2d2d3a" roughness={0.5} />
      </mesh>
      {/* Brackets */}
      <mesh position={[-0.8, -0.15, 0.15]}>
        <boxGeometry args={[0.05, 0.25, 0.05]} />
        <meshStandardMaterial color="#14b8a6" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.8, -0.15, 0.15]}>
        <boxGeometry args={[0.05, 0.25, 0.05]} />
        <meshStandardMaterial color="#14b8a6" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

function FloatingDecor({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh position={position}>
        <octahedronGeometry args={[0.15]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
      </mesh>
    </Float>
  )
}

function CeilingLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Light fixture */}
      <mesh>
        <boxGeometry args={[2.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#1a1a24" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Light panel */}
      <mesh position={[0, -0.06, 0]}>
        <boxGeometry args={[2.3, 0.02, 0.4]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <pointLight position={[0, -0.5, 0]} intensity={30} color="#ffffff" distance={10} />
    </group>
  )
}

function EntranceRoom({ position, isDark = true }: { position: [number, number, number]; isDark?: boolean }) {
  const { personal } = portfolioData

  return (
    <ColorfulRoom position={position} isDark={isDark}>
      {/* Wall Display - Main showcase */}
      <ModernWallDisplay position={[0, 2.5, -6.8]} isDark={isDark} />

      {/* Modern desk setup */}
      <ModernDesk position={[0, -1.5, -3]} isDark={isDark} />

      {/* Dual ultrawide monitors - one showing skills */}
      <UltrawideMonitor position={[-0.8, -0.2, -3.8]} rotation={[0, 0.15, 0]} showSkills={true} isDark={isDark} />
      <UltrawideMonitor position={[0.8, -0.2, -3.8]} rotation={[0, -0.15, 0]} showSkills={false} isDark={isDark} />

      <RealisticFlowerPot position={[-1.7, -1.35, -2.5]} />

      {/* RGB Keyboard and mouse */}
      <RGBKeyboard position={[0, -1.42, -2.5]} />
      <RGBMouse position={[0.85, -1.42, -2.5]} />

      {/* Modern PC Tower */}
      <ModernPCTower position={[2.2, -2.35, -3.2]} />

      {/* Modern gaming chair */}
      <ModernGamingChair position={[0, -2.3, -0.8]} isDark={isDark} />

      <Bookshelf position={[-6.5, -1.8, -3]} isDark={isDark} />

      <FloorLamp position={[-5.5, -3, 1]} isDark={isDark} />

      <AreaRug position={[0, -2.98, -1.5]} isDark={isDark} />

      <group position={[-6.9, 3, -1]} rotation={[0, Math.PI / 2, 0]}>
        <WallClock position={[0, 0, 0]} isDark={isDark} />
      </group>

      <WallArt position={[6.9, 3.5, -4]} rotation={[0, -Math.PI / 2, 0]} isDark={isDark} />
      <WallArt position={[6.9, 1.5, -5]} rotation={[0, -Math.PI / 2, 0]} isDark={isDark} />

      {/* Floating decorative elements */}
      <FloatingDecor position={[-5, 3, -4]} color="#f472b6" />
      <FloatingDecor position={[5, 4, -3]} color="#818cf8" />
      <FloatingDecor position={[-4, 5, -5]} color="#2dd4bf" />
      <FloatingDecor position={[4, 2, -5]} color="#fb923c" />

      {/* Social links panel on right wall - improved visibility */}
      <group position={[6.7, -0.5, -1]} rotation={[0, -Math.PI / 2, 0]}>
        <Float speed={2} rotationIntensity={0.05} floatIntensity={0.2}>
          <RoundedBox args={[2.8, 2, 0.1]} radius={0.1}>
            <meshStandardMaterial color={isDark ? "#0a0a0f" : "#f1f5f9"} roughness={0.8} />
          </RoundedBox>
          {/* Border glow */}
          <mesh position={[0, 0.95, 0.06]}>
            <boxGeometry args={[2.6, 0.06, 0.02]} />
            <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={2.5} />
          </mesh>
          <mesh position={[0, -0.95, 0.06]}>
            <boxGeometry args={[2.6, 0.06, 0.02]} />
            <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={2.5} />
          </mesh>
          <Html transform position={[0, 0, 0.15]} scale={0.35} center>
            <div
              className="p-6 text-center w-[300px] rounded-xl"
              style={{
                backgroundColor: isDark ? "rgba(10, 10, 15, 0.98)" : "rgba(255, 255, 255, 0.98)",
                border: `2px solid ${isDark ? "#14b8a6" : "#0d9488"}`,
              }}
            >
              <p
                className="text-lg mb-6 font-bold tracking-wider"
                style={{ color: "#14b8a6", textShadow: isDark ? "0 0 10px #14b8a6" : "none" }}
              >
                CONNECT WITH ME
              </p>
              <div className="flex gap-6 justify-center">
                <a
                  href={personal.github}
                  className="transition-all p-4 rounded-xl hover:scale-110"
                  style={{
                    color: isDark ? "#fff" : "#374151",
                    backgroundColor: isDark ? "rgba(244, 114, 182, 0.25)" : "rgba(244, 114, 182, 0.15)",
                    border: "2px solid #f472b6",
                  }}
                >
                  <Github size={36} />
                </a>
                <a
                  href={personal.linkedin}
                  className="transition-all p-4 rounded-xl hover:scale-110"
                  style={{
                    color: isDark ? "#fff" : "#374151",
                    backgroundColor: isDark ? "rgba(129, 140, 248, 0.25)" : "rgba(129, 140, 248, 0.15)",
                    border: "2px solid #818cf8",
                  }}
                >
                  <Linkedin size={36} />
                </a>
                <a
                  href={`mailto:${personal.email}`}
                  className="transition-all p-4 rounded-xl hover:scale-110"
                  style={{
                    color: isDark ? "#fff" : "#374151",
                    backgroundColor: isDark ? "rgba(20, 184, 166, 0.25)" : "rgba(20, 184, 166, 0.15)",
                    border: "2px solid #14b8a6",
                  }}
                >
                  <Mail size={36} />
                </a>
              </div>
            </div>
          </Html>
        </Float>
      </group>

      {/* Ambient colored lighting - reduced for performance */}
      <pointLight position={[0, -2, -3]} intensity={isDark ? 20 : 10} color="#14b8a6" distance={8} />
      <pointLight position={[0, 6, -3]} intensity={isDark ? 35 : 40} color="#ffffff" distance={10} />
    </ColorfulRoom>
  )
}

function AboutRoom({ position, isDark = true }: { position: [number, number, number]; isDark?: boolean }) {
  const { about } = portfolioData
  const colors = isDark ? themeColors.dark : themeColors.light

  return (
    <Room position={position} color={isDark ? "#0f172a" : "#f1f5f9"} isDark={isDark}>
      {/* Main About Frame */}
      <FloatingFrame position={[0, 3, -5]} size={[10, 4]} isDark={isDark}>
        <div className="p-4 text-left">
          <h2 className="text-teal-400 text-2xl font-bold mb-3">{about.heading}</h2>
          {about.paragraphs.map((p, i) => (
            <p key={i} className={`${isDark ? "text-gray-300" : "text-gray-700"} text-sm mb-2`}>
              {p}
            </p>
          ))}
        </div>
      </FloatingFrame>

      {/* Stats */}
      <group position={[0, -0.5, -3]}>
        {about.stats.map((stat, i) => (
          <FloatingFrame key={i} position={[(i - 1.5) * 3, 0, 0]} size={[2.2, 1.8]} isDark={isDark}>
            <div className="p-2">
              <p className="text-teal-400 text-3xl font-bold">{stat.value}</p>
              <p className={`${isDark ? "text-gray-400" : "text-gray-600"} text-xs`}>{stat.label}</p>
            </div>
          </FloatingFrame>
        ))}
      </group>

      <pointLight position={[0, 5, 0]} intensity={isDark ? 40 : 60} color="#14b8a6" />
      <ambientLight intensity={isDark ? 0.3 : 0.6} />
    </Room>
  )
}

function SkillsRoom({ position, isDark = true }: { position: [number, number, number]; isDark?: boolean }) {
  const { skills } = portfolioData

  return (
    <Room position={position} color={isDark ? "#1e1b4b" : "#e0e7ff"} isDark={isDark}>
      <FloatingFrame position={[0, 4.5, -5]} size={[6, 1.5]} isDark={isDark}>
        <h2 className="text-teal-400 text-2xl font-bold">{skills.heading}</h2>
      </FloatingFrame>

      {skills.categories.map((category, i) => {
        const xPos = i % 2 === 0 ? -3.5 : 3.5
        const yPos = i < 2 ? 2 : -0.5
        return (
          <FloatingFrame key={i} position={[xPos, yPos, -4]} size={[5, 2.5]} isDark={isDark}>
            <div className="p-3 text-left">
              <h3 className="text-teal-400 text-base font-semibold mb-2">{category.title}</h3>
              <div className="flex flex-wrap gap-1">
                {category.skills.map((skill, j) => (
                  <span key={j} className="bg-teal-500/20 text-teal-900 px-2 py-0.5 rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </FloatingFrame>
        )
      })}

      <pointLight position={[0, 5, 0]} intensity={isDark ? 40 : 60} color="#8b5cf6" />
      <ambientLight intensity={isDark ? 0.3 : 0.6} />
    </Room>
  )
}

function ExperienceRoom({ position, isDark = true }: { position: [number, number, number]; isDark?: boolean }) {
  const { experience } = portfolioData

  return (
    <Room position={position} color={isDark ? "#172554" : "#dbeafe"} isDark={isDark}>
      <FloatingFrame position={[0, 4.5, -5]} size={[6, 1.5]} isDark={isDark}>
        <h2 className="text-teal-400 text-2xl font-bold">{experience.heading}</h2>
      </FloatingFrame>

      {experience.items.map((item, i) => (
        <FloatingFrame key={i} position={[i === 0 ? -3 : 3, 1.5, -4]} size={[5, 4]} isDark={isDark}>
          <div className="p-3 text-left">
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full ${item.type === "work" ? "bg-teal-400" : "bg-purple-400"}`} />
              <span className={`${isDark ? "text-gray-400" : "text-gray-600"} text-xs`}>{item.period}</span>
            </div>
            <h3 className={`${isDark ? "text-white" : "text-slate-800"} text-base font-semibold`}>{item.title}</h3>
            <p className="text-teal-400 text-sm mb-2">{item.company}</p>
            <ul className="space-y-1">
              {item.description.slice(0, 3).map((desc, j) => (
                <li key={j} className={`${isDark ? "text-gray-300" : "text-gray-700"} text-xs`}>
                  • {desc}
                </li>
              ))}
            </ul>
          </div>
        </FloatingFrame>
      ))}

      <pointLight position={[0, 5, 0]} intensity={isDark ? 40 : 60} color="#3b82f6" />
      <ambientLight intensity={isDark ? 0.3 : 0.6} />
    </Room>
  )
}

function ProjectsRoom({ position, isDark = true }: { position: [number, number, number]; isDark?: boolean }) {
  const { projects } = portfolioData
  const featuredProjects = projects.items.filter((p) => p.featured)

  return (
    <Room position={position} color={isDark ? "#1c1917" : "#fef3c7"} isDark={isDark}>
      <FloatingFrame position={[0, 4.5, -5]} size={[6, 1.5]} isDark={isDark}>
        <h2 className="text-teal-400 text-2xl font-bold">{projects.heading}</h2>
      </FloatingFrame>

      {featuredProjects.map((project, i) => (
        <FloatingFrame key={i} position={[(i - 1) * 4.5, 1, -4]} size={[4, 3.5]} isDark={isDark}>
          <div className="p-3 text-left">
            <h3 className={`${isDark ? "text-white" : "text-slate-800"} text-base font-semibold mb-2`}>
              {project.title}
            </h3>
            <p className={`${isDark ? "text-gray-400" : "text-gray-600"} text-xs mb-2`}>{project.description}</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {project.tags.map((tag, j) => (
                <span key={j} className="bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <a
                href={project.github}
                className={`${isDark ? "text-gray-400 hover:text-teal-400" : "text-gray-600 hover:text-teal-500"} text-xs flex items-center gap-1`}
              >
                <Github size={12} /> Code
              </a>
              <a
                href={project.demo}
                className={`${isDark ? "text-gray-400 hover:text-teal-400" : "text-gray-600 hover:text-teal-500"} text-xs flex items-center gap-1`}
              >
                <ExternalLink size={12} /> Demo
              </a>
            </div>
          </div>
        </FloatingFrame>
      ))}

      <pointLight position={[0, 5, 0]} intensity={isDark ? 40 : 60} color="#f97316" />
      <ambientLight intensity={isDark ? 0.3 : 0.6} />
    </Room>
  )
}

function ContactRoom({ position, isDark = true }: { position: [number, number, number]; isDark?: boolean }) {
  const { contact, personal } = portfolioData

  return (
    <Room position={position} color={isDark ? "#0f172a" : "#f1f5f9"} isDark={isDark}>
      <FloatingFrame position={[0, 3, -5]} size={[8, 5]} isDark={isDark}>
        <div className="p-6">
          <h2 className="text-teal-400 text-3xl font-bold mb-3">{contact.heading}</h2>
          <p className={`${isDark ? "text-gray-300" : "text-gray-700"} text-base mb-6`}>{contact.description}</p>

          <div className="space-y-4">
            <a
              href={`mailto:${personal.email}`}
              className="flex items-center justify-center gap-3 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 py-3 px-4 rounded-lg transition-colors"
            >
              <Mail size={20} />
              <span>{personal.email}</span>
            </a>

            <div className="flex justify-center gap-6">
              <a
                href={personal.github}
                className={`${isDark ? "text-white hover:text-teal-400" : "text-slate-700 hover:text-teal-500"} transition-colors`}
              >
                <Github size={28} />
              </a>
              <a
                href={personal.linkedin}
                className={`${isDark ? "text-white hover:text-teal-400" : "text-slate-700 hover:text-teal-500"} transition-colors`}
              >
                <Linkedin size={28} />
              </a>
            </div>
          </div>

          <p className={`${isDark ? "text-gray-500" : "text-gray-600"} text-xs mt-6`}>{personal.copyright}</p>
        </div>
      </FloatingFrame>

      {/* Glowing orbs - reduced for performance */}
      <mesh position={[0, 5, -3]}>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={2} />
      </mesh>

      <pointLight position={[0, 5, 0]} intensity={isDark ? 30 : 40} color="#14b8a6" />
    </Room>
  )
}

function Scene({ currentRoom, isDark }: { currentRoom: number; isDark: boolean }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)

  useEffect(() => {
    if (cameraRef.current) {
      const targetX = rooms[currentRoom].position[0]
      const animate = () => {
        if (cameraRef.current) {
          const currentX = cameraRef.current.position.x
          const diff = targetX - currentX
          if (Math.abs(diff) > 0.1) {
            cameraRef.current.position.x += diff * 0.05
            requestAnimationFrame(animate)
          } else {
            cameraRef.current.position.x = targetX
          }
        }
      }
      animate()
    }
  }, [currentRoom])

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 2, 8]} fov={60} />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={5}
        maxDistance={12}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        target={[rooms[currentRoom].position[0], 1, 0]}
      />

      <ambientLight intensity={isDark ? 0.4 : 0.6} />
      <directionalLight position={[10, 10, 5]} intensity={isDark ? 0.3 : 0.5} castShadow={false} />

      {/* Lazy load only nearby rooms for performance */}
      {currentRoom === 0 && <EntranceRoom position={rooms[0].position} isDark={isDark} />}
      {(currentRoom === 0 || currentRoom === 1) && <AboutRoom position={rooms[1].position} isDark={isDark} />}
      {(currentRoom === 1 || currentRoom === 2) && <SkillsRoom position={rooms[2].position} isDark={isDark} />}
      {(currentRoom === 2 || currentRoom === 3) && <ExperienceRoom position={rooms[3].position} isDark={isDark} />}
      {(currentRoom === 3 || currentRoom === 4) && <ProjectsRoom position={rooms[4].position} isDark={isDark} />}
      {(currentRoom === 4 || currentRoom === 5) && <ContactRoom position={rooms[5].position} isDark={isDark} />}

      <Environment preset={isDark ? "night" : "city"} background={false} environmentIntensity={0.5} />
    </>
  )
}

export function House3D() {
  const [currentRoom, setCurrentRoom] = useState(0)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted ? resolvedTheme === "dark" : true

  const goToPrev = () => setCurrentRoom((prev) => Math.max(0, prev - 1))
  const goToNext = () => setCurrentRoom((prev) => Math.min(rooms.length - 1, prev + 1))

  return (
    <div className="relative h-screen w-full">
      <Canvas 
        shadows={false}
        className="bg-background"
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        gl={{ 
          antialias: false, 
          powerPreference: "high-performance",
          alpha: false,
          stencil: false,
          depth: true
        }}
      >
        <Scene currentRoom={currentRoom} isDark={isDark} />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="bg-background/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-border">
            <span className="text-primary font-semibold">{portfolioData.personal.name}</span>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* Room Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-2 border border-border flex items-center gap-2">
          <button
            onClick={goToPrev}
            disabled={currentRoom === 0}
            className="p-2 rounded-lg hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>

          <div className="flex gap-1">
            {rooms.map((room, i) => {
              const Icon = room.icon
              return (
                <button
                  key={room.id}
                  onClick={() => setCurrentRoom(i)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    currentRoom === i ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className={`text-sm font-medium ${currentRoom === i ? "block" : "hidden md:block"}`}>
                    {room.name}
                  </span>
                </button>
              )
            })}
          </div>

          <button
            onClick={goToNext}
            disabled={currentRoom === rooms.length - 1}
            className="p-2 rounded-lg hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
        <p className="text-muted-foreground text-sm bg-background/60 backdrop-blur-sm px-3 py-1 rounded-full">
          Drag to look around • Scroll to zoom • Click rooms to navigate
        </p>
      </div>
    </div>
  )
}
