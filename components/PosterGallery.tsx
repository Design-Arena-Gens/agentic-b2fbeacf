"use client";

import { motion } from "framer-motion";
import Poster, { PosterPalette, PosterSpec } from "./Poster";

export default function PosterGallery({ seed, palette, posters }: { seed: number; palette: PosterPalette; posters: PosterSpec[] }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {posters.map((spec, i) => (
        <motion.div
          key={spec.id}
          className="card p-3 hover:shadow-neonglow transition-shadow"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="text-sm text-white/70 px-1 pb-2">{spec.title}</div>
          <Poster width={400} height={533} seed={seed + i * 123} palette={palette} variant={spec.id} />
        </motion.div>
      ))}
    </div>
  );
}
