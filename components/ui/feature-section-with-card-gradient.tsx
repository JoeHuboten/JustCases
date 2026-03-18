"use client";

import React, { useCallback, useRef } from "react";

interface Feature {
  title: string;
  description: string;
  icon?: string;
}

interface FeaturesSectionProps {
  sectionLabel?: string;
  sectionTitle?: string;
  features: Feature[];
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!glowRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glowRef.current.style.opacity = "1";
    glowRef.current.style.background = `radial-gradient(250px circle at ${x}px ${y}px, rgba(255,255,255,0.06), transparent 70%)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!glowRef.current) return;
    glowRef.current.style.opacity = "0";
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-6 rounded-3xl overflow-hidden border border-white/5 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/10 hover:from-white/[0.06] hover:to-white/[0.02]"
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 z-10 rounded-3xl opacity-0 transition-opacity duration-300"
      />
      <Grid size={20} index={index} />
      {feature.icon && (
        <span className="relative z-20 text-2xl mb-3 block">{feature.icon}</span>
      )}
      <p className="text-base font-bold text-white relative z-20">
        {feature.title}
      </p>
      <p className="text-white/40 mt-4 text-base font-normal relative z-20">
        {feature.description}
      </p>
    </div>
  );
}

export function FeaturesSectionWithCardGradient({
  sectionLabel,
  sectionTitle,
  features,
}: FeaturesSectionProps) {
  return (
    <div className="py-20 lg:py-40">
      {(sectionLabel || sectionTitle) && (
        <div className="text-center max-w-2xl mx-auto mb-16">
          {sectionLabel && (
            <span className="inline-block font-body text-xs tracking-[0.3em] uppercase text-violet-400/80 mb-4">
              {sectionLabel}
            </span>
          )}
          {sectionTitle && (
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white leading-tight">
              {sectionTitle}
            </h2>
          )}
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto px-4">
        {features.map((feature, i) => (
          <FeatureCard key={feature.title} feature={feature} index={i} />
        ))}
      </div>
    </div>
  );
}

export const Grid = ({
  pattern,
  size,
  index = 0,
}: {
  pattern?: number[][];
  size?: number;
  index?: number;
}) => {
  const p = pattern ?? [
    [8, 2],
    [9, 4],
    [7, 1],
    [10, 5],
    [8, 3],
  ];
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] from-zinc-900/30 to-zinc-900/30 opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          patternId={`grid-pattern-${index}`}
          className="absolute inset-0 h-full w-full mix-blend-overlay fill-white/10 stroke-white/10"
        />
      </div>
    </div>
  );
};

export function GridPattern({ width, height, x, y, squares, patternId, ...props }: any) {
  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]: any, idx: number) => (
            <rect
              strokeWidth="0"
              key={`${idx}-${x}-${y}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}
