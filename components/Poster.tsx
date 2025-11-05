"use client";

import { forwardRef, useMemo } from "react";
import { motion } from "framer-motion";

export type PosterPalette = "vibrant" | "sunset" | "cool" | "glow";
export type PosterVariant = "collage" | "rings" | "stripes" | "radials" | "waves" | "tiles";

export interface PosterSpec {
  id: PosterVariant;
  title: string;
  description: string;
}

export const PRESET_POSTERS: PosterSpec[] = [
  { id: "collage", title: "Fraggle Collage", description: "Playful shapes and character echoes." },
  { id: "rings", title: "Gobo's Echo", description: "Concentric rings reverberating underground." },
  { id: "stripes", title: "Red's Sprint", description: "Energetic diagonal ribbons." },
  { id: "radials", title: "Doozer Sparks", description: "Radiant bursts and construction sparks." },
  { id: "waves", title: "Wembley's Wonder", description: "Soft waves and harmonic grooves." },
  { id: "tiles", title: "Boober's Quilt", description: "Cozy mosaic of earthy tiles." },
];

const PALETTES: Record<PosterPalette, string[]> = {
  vibrant: ["#ff6ea8", "#ffd166", "#60a5fa", "#2dd4bf", "#f97316"],
  sunset: ["#ff6b6b", "#f7b267", "#f79d65", "#84dcc6", "#5dd39e"],
  cool: ["#a78bfa", "#60a5fa", "#22d3ee", "#34d399", "#f472b6"],
  glow: ["#f43f5e", "#eab308", "#22c55e", "#06b6d4", "#8b5cf6"],
};

function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

type PosterProps = {
  width?: number;
  height?: number;
  seed: number;
  palette: PosterPalette;
  variant?: PosterVariant;
};

const Poster = forwardRef<SVGSVGElement, PosterProps>(function Poster(
  { width = 900, height = 1200, seed, palette, variant = "collage" },
  ref
) {
  const { bg, shapes } = useMemo(() => {
    const rng = seededRandom(seed);
    const colors = PALETTES[palette];

    const bg = pick(rng, ["#0b1220", "#0e1424", "#111827"]);

    const shapeCount = 18 + Math.floor(rng() * 16);

    const shapes = Array.from({ length: shapeCount }).map((_, i) => {
      const t = rng();
      const cx = Math.floor(rng() * width);
      const cy = Math.floor(rng() * height);
      const size = 40 + rng() * 180;
      const color = colors[i % colors.length];
      const opacity = 0.25 + rng() * 0.65;
      const rotate = Math.floor(rng() * 360);
      const stroke = rng() > 0.65 ? 3 + rng() * 6 : 0;
      const variantPick = variant;

      return { t, cx, cy, size, color, opacity, rotate, stroke, variantPick };
    });

    return { bg, shapes };
  }, [seed, palette, width, height, variant]);

  const maskId = useMemo(() => `mask-${seed.toString(36)}`, [seed]);

  return (
    <motion.svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.45)" }}
    >
      <defs>
        <radialGradient id="glow" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.06" />
          </feComponentTransfer>
        </filter>
        <mask id={maskId}>
          <rect width="100%" height="100%" fill="white" rx="24" />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <rect width="100%" height="100%" fill={bg} />
        <rect width="100%" height="100%" fill="url(#glow)" />

        {shapes.map((s, idx) => {
          if (s.variantPick === "rings") {
            const rings = 4 + Math.floor((s.t * 6));
            return (
              <g key={idx} transform={`translate(${s.cx},${s.cy}) rotate(${s.rotate})`} opacity={s.opacity}>
                {Array.from({ length: rings }).map((_, r) => (
                  <circle key={r} cx={0} cy={0} r={s.size * (r + 1) * 0.25} fill="none" stroke={s.color} strokeWidth={Math.max(2, s.stroke || 2)} />
                ))}
              </g>
            );
          }

          if (s.variantPick === "stripes") {
            const stripes = 6 + Math.floor(s.t * 8);
            return (
              <g key={idx} transform={`translate(${s.cx},${s.cy}) rotate(${s.rotate})`} opacity={s.opacity}>
                {Array.from({ length: stripes }).map((_, r) => (
                  <rect key={r} x={-s.size} y={-s.size + r * (s.size / 3)} width={s.size * 2} height={s.size / 8} fill={s.color} />
                ))}
              </g>
            );
          }

          if (s.variantPick === "radials") {
            const lines = 12 + Math.floor(s.t * 18);
            return (
              <g key={idx} transform={`translate(${s.cx},${s.cy}) rotate(${s.rotate})`} opacity={s.opacity}>
                {Array.from({ length: lines }).map((_, r) => (
                  <line key={r} x1={0} y1={0} x2={Math.cos((r / lines) * Math.PI * 2) * s.size} y2={Math.sin((r / lines) * Math.PI * 2) * s.size} stroke={s.color} strokeWidth={Math.max(2, s.stroke || 2)} />
                ))}
              </g>
            );
          }

          if (s.variantPick === "waves") {
            const paths = 4 + Math.floor(s.t * 6);
            return (
              <g key={idx} transform={`translate(${s.cx},${s.cy})`} opacity={s.opacity}>
                {Array.from({ length: paths }).map((_, r) => (
                  <path key={r} d={`M ${-s.size} 0 Q 0 ${Math.sin(r) * s.size * 0.5} ${s.size} 0`} stroke={s.color} strokeWidth={Math.max(2, s.stroke || 2)} fill="none" transform={`rotate(${s.rotate + r * 12})`} />
                ))}
              </g>
            );
          }

          if (s.variantPick === "tiles") {
            const n = 4;
            return (
              <g key={idx} transform={`translate(${s.cx - s.size / 2},${s.cy - s.size / 2}) rotate(${s.rotate}, ${s.size / 2}, ${s.size / 2})`} opacity={s.opacity}>
                {Array.from({ length: n }).map((_, yi) => (
                  Array.from({ length: n }).map((_, xi) => (
                    <rect key={`${xi}-${yi}`} x={(xi * s.size) / n} y={(yi * s.size) / n} width={s.size / n - 2} height={s.size / n - 2} fill={xi % 2 === yi % 2 ? s.color : "#ffffff10"} rx={6} />
                  ))
                ))}
              </g>
            );
          }

          // collage default
          return (
            <g key={idx} transform={`translate(${s.cx},${s.cy}) rotate(${s.rotate})`} opacity={s.opacity}>
              <ellipse cx={0} cy={0} rx={s.size * 0.6} ry={s.size * 0.4} fill={s.color} />
              {s.stroke > 0 && <ellipse cx={0} cy={0} rx={s.size * 0.7} ry={s.size * 0.5} fill="none" stroke={s.color} strokeWidth={s.stroke} />}
              <circle cx={-s.size * 0.2} cy={-s.size * 0.15} r={s.size * 0.12} fill="#fff3" />
              <circle cx={s.size * 0.25} cy={s.size * 0.1} r={s.size * 0.08} fill="#fff2" />
            </g>
          );
        })}

        {/* Title block */}
        <g>
          <rect x={0} y={height - 160} width={width} height={200} fill="#00000070" />
          <text x={width * 0.06} y={height - 80} fill="#fff" fontFamily="'Concert One', system-ui, sans-serif" fontSize={72} style={{ letterSpacing: 2 }}>
            FRAGGLE ROCK
          </text>
          <text x={width * 0.06} y={height - 36} fill="#ffffffaa" fontFamily="Inter, system-ui, sans-serif" fontSize={24}>
            A playful underground adventure
          </text>
        </g>

        {/* Film grain overlay */}
        <rect width="100%" height="100%" filter="url(#grain)" opacity="0.18" />
      </g>
    </motion.svg>
  );
});

export default Poster;
