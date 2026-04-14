import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Text, Preload } from "@react-three/drei";
import * as THREE from "three";

interface Device {
  id: string;
  name: string;
  uPos: number; // Starting U position (1-indexed)
  uSize: number; // Size in U
  type: "SWITCH" | "SERVER" | "ROUTER" | "FIREWALL";
  color?: string;
}

interface RackProps {
  totalU?: number;
  devices: Device[];
}

function RackFrame({ totalU = 42 }: { totalU?: number }) {
  const height = totalU * 0.1; // Each U is 0.1 units
  const width = 1.2;
  const depth = 1.0;

  return (
    <group>
      {/* Main vertical rails */}
      <mesh position={[-width / 2, height / 2, depth / 2]}>
        <boxGeometry args={[0.05, height, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[width / 2, height / 2, depth / 2]}>
        <boxGeometry args={[0.05, height, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-width / 2, height / 2, -depth / 2]}>
        <boxGeometry args={[0.05, height, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[width / 2, height / 2, -depth / 2]}>
        <boxGeometry args={[0.05, height, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Horizontal supports */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[width + 0.1, 0.05, depth + 0.1]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>
      <mesh position={[0, height, 0]}>
        <boxGeometry args={[width + 0.1, 0.05, depth + 0.1]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>

      {/* U Markings (optimized: show every 5th or first/last) */}
      {Array.from({ length: totalU }).map((_, i) => {
        const isMajor = (i + 1) % 5 === 0 || i === 0 || i === totalU - 1;
        if (!isMajor) return null;
        
        return (
          <group key={i} position={[width / 2 + 0.05, i * 0.1 + 0.05, depth / 2]}>
            <Text
              fontSize={0.04}
              color="#666"
              anchorX="left"
              anchorY="middle"
            >
              {i + 1}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

function RackDevice({ device }: { device: Device }) {
  const height = device.uSize * 0.1 - 0.01; // Slightly smaller to show gaps
  const yPos = (device.uPos - 1) * 0.1 + (height / 2) + 0.005;
  const width = 1.1;
  const depth = 0.9;

  const color = device.color || (
    device.type === "SERVER" ? "#3b82f6" : 
    device.type === "SWITCH" ? "#10b981" : 
    device.type === "ROUTER" ? "#f59e0b" : "#ef4444"
  );

  return (
    <group position={[0, yPos, 0.05]}>
      {/* Device Body */}
      <mesh>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#222" metalness={0.5} roughness={0.5} />
      </mesh>
      
      {/* Front Panel */}
      <mesh position={[0, 0, depth / 2 + 0.001]}>
        <boxGeometry args={[width, height, 0.01]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>

      {/* Label */}
      <Text
        position={[0, 0, depth / 2 + 0.012]}
        fontSize={0.04}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {device.name}
      </Text>

      {/* Status LEDs (simplified) */}
      <mesh position={[-width / 2 + 0.1, 0, depth / 2 + 0.012]}>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

export function Rack3D({ totalU = 42, devices }: RackProps) {
  return (
    <div className="w-full h-[600px] bg-slate-950 rounded-3xl overflow-hidden relative shadow-2xl border border-white/5">
      <div className="absolute top-6 left-6 z-10">
        <h3 className="text-white font-bold text-lg">Rack View (3D)</h3>
        <p className="text-slate-400 text-xs">Drag to rotate • Scroll to zoom</p>
      </div>
      
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[3, 4, 6]} fov={45} />
        <OrbitControls 
          enablePan={false} 
          minDistance={3} 
          maxDistance={12} 
          autoRotate 
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
        />
        
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <group position={[0, -totalU * 0.05, 0]}>
          <Suspense fallback={null}>
            <RackFrame totalU={totalU} />
            {devices.map((device) => (
              <RackDevice key={device.id} device={device} />
            ))}
          </Suspense>
        </group>

        <Suspense fallback={null}>
          <ContactShadows position={[0, -totalU * 0.05, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
          <Environment preset="city" />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
}
