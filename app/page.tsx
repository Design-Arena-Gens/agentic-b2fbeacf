"use client";

import { motion } from "framer-motion";
import { useCallback, useMemo, useRef, useState } from "react";
import Poster, { PosterPalette, PRESET_POSTERS } from "../components/Poster";
import PosterGallery from "../components/PosterGallery";
import { DownloadIcon, RefreshCw } from "../components/icons";
import { downloadSvgAsPng } from "../lib/svgToPng";

export default function HomePage() {
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 1_000_000));
  const [palette, setPalette] = useState<PosterPalette>("vibrant");

  const regenerate = useCallback(() => {
    setSeed(Math.floor(Math.random() * 1_000_000));
  }, []);

  const featured = useMemo(() => PRESET_POSTERS.slice(0, 6), []);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const onDownload = async () => {
    if (!svgRef.current) return;
    await downloadSvgAsPng(svgRef.current, `fraggle-rock-poster-${seed}.png`, 2);
  };

  return (
    <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <section className="text-center mb-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-[family-name:var(--font-concert)] text-5xl sm:text-6xl md:text-7xl tracking-tight drop-shadow-[0_6px_0_rgba(0,0,0,0.35)]"
        >
          Fraggle Rock
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-4 text-white/80 text-lg max-w-2xl mx-auto"
        >
          A playful tribute with generative, interactive SVG posters inspired by the spirit of the Fraggles, Doozers, and Gorgs.
        </motion.p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button className="btn btn-primary" onClick={regenerate}>
            <RefreshCw className="h-4 w-4" /> Generate New
          </button>
          <button className="btn btn-ghost" onClick={onDownload}>
            <DownloadIcon className="h-4 w-4" /> Download PNG
          </button>
          <div className="inline-flex items-center gap-2 card px-3 py-2">
            <label className="text-sm text-white/70">Palette</label>
            <select
              className="bg-transparent outline-none text-sm"
              value={palette}
              onChange={(e) => setPalette(e.target.value as PosterPalette)}
            >
              <option value="vibrant">Vibrant</option>
              <option value="sunset">Sunset</option>
              <option value="cool">Cool</option>
              <option value="glow">Glow</option>
            </select>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6 items-stretch">
        <div className="card p-4 md:p-6 flex items-center justify-center">
          <Poster ref={svgRef} width={900} height={1200} seed={seed} palette={palette} variant="collage" />
        </div>
        <div>
          <PosterGallery seed={seed} palette={palette} posters={featured} />
        </div>
      </section>

      <footer className="mt-12 text-center text-white/50 text-sm">
        Built with love for the world of Fraggle Rock. Artwork is original, inspired fan art rendered as SVG.
      </footer>
    </main>
  );
}
