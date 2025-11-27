"use client";

import { RetroGrid } from "@/components/ui/retro-grid";
import { GridContainer } from "@/components/GridContainer";

export default function Hero() {
  return (
    <section className="w-full">
      <div className="relative flex h-80 w-full flex-col items-center justify-center overflow-hidden bg-linear-to-t from-secondary to-secondary-foreground md:shadow-xl">
        <span className="pointer-events-none z-10 whitespace-pre-wrap bg-linear-to-b from-terciary to-terciary-foreground bg-clip-text text-center text-5xl md:text-7xl font-bold leading-normal tracking-tighter text-transparent">
          Blog
          O Pace Financeiro
        </span>
        <span className="text-primary-foreground">por Otávio Daudt</span>

        <RetroGrid />
      </div>
    </section>
  );
}
