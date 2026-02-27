
"use client";

import Image, { type ImageProps } from 'next/image';
import { useState, useEffect } from 'react';

export function ParallaxImage(props: ImageProps) {
  const [offsetY, setOffsetY] = useState(0);
  
  const handleScroll = () => {
    if (typeof window !== 'undefined') {
      setOffsetY(window.pageYOffset);
    }
  };

  useEffect(() => {
    // only apply parallax on non-touch devices and larger screens to avoid performance issues on mobile
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice && window.innerWidth > 768) {
        window.addEventListener('scroll', handleScroll);
    }
    return () => {
        if (!isTouchDevice && window.innerWidth > 768) {
            window.removeEventListener('scroll', handleScroll);
        }
    };
  }, []);

  const scale = props.priority ? 1.15 : 1.1; // scale a bit more for priority images to avoid any edge cases

  return (
    <Image
      {...props}
      style={{
        ...props.style,
        transform: `translateY(${offsetY * 0.5}px) scale(${scale})`,
        willChange: 'transform',
      }}
    />
  );
}
