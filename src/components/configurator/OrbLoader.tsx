"use client";

import { ThinkingOrb } from "thinking-orbs";
import type { OrbState, OrbTheme, OrbSize } from "thinking-orbs";

export type { OrbState };

type OrbLoaderProps = {
  state?: OrbState;
  size?: OrbSize;
  theme?: OrbTheme;
  className?: string;
  "aria-label"?: string;
};

export function OrbLoader({ state = "working", size = 64, theme = "light", className, ...rest }: OrbLoaderProps) {
  return <ThinkingOrb state={state} size={size} theme={theme} className={className} {...rest} />;
}
