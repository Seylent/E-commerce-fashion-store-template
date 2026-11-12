"use client";

import Image from "next/image";

type SmartImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
};

/** Renders next/image for static assets and a plain <img> for inline data/blob URLs
 *  (user uploads in the configurator), which next/image cannot optimize. */
export function SmartImage({ src, alt, fill, sizes, className, priority, style, width, height }: SmartImageProps) {
  if (src.startsWith("data:") || src.startsWith("blob:")) {
    return <img src={src} alt={alt} className={className} width={width} height={height} style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", ...style } : style} />;
  }
  return <Image src={src} alt={alt} fill={fill} sizes={sizes} className={className} priority={priority} style={style} width={width} height={height} />;
}
