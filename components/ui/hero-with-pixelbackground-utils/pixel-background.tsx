'use client';

import { useEffect, useRef } from 'react';

type Direction = 'top' | 'bottom' | 'left' | 'right';

type PixelBackgroundProps = {
  gap?: number;
  speed?: number;
  colors?: string;
  opacity?: number;
  direction?: Direction;
  className?: string;
};

export default function PixelBackground({
  gap = 6,
  speed = 60,
  colors = '#d4d4d4,#e5e5e5,#c4c4c4,#bababa',
  opacity = 0.7,
  direction = 'top',
  className = '',
}: PixelBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const palette = colors
      .split(',')
      .map((color) => color.trim())
      .filter(Boolean);

    type Particle = {
      x: number;
      y: number;
      size: number;
      color: string;
      drift: number;
    };

    const particles: Particle[] = [];

    const buildParticles = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        return;
      }

      canvas.width = rect.width;
      canvas.height = rect.height;
      particles.length = 0;

      const columns = Math.ceil(rect.width / (gap + 2));
      const rows = Math.ceil(rect.height / (gap + 2));

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < columns; col += 1) {
          particles.push({
            x: col * (gap + 2) + (row % 2) * (gap / 2),
            y: row * (gap + 2),
            size: Math.max(2, gap * 0.75),
            color: palette[(row + col) % palette.length] ?? palette[0] ?? '#d4d4d4',
            drift: Math.random() * 0.8 + 0.3,
          });
        }
      }
    };

    buildParticles();

    let frameId = 0;

    const render = (timestamp: number) => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      const offset = ((timestamp * 0.05 * speed) % (Math.max(canvas.height, gap * 4) + gap * 4)) || 0;
      const horizontalShift = direction === 'left' ? -offset : direction === 'right' ? offset : 0;
      const verticalShift = direction === 'top' ? -offset : direction === 'bottom' ? offset : 0;

      for (const particle of particles) {
        const x = (particle.x + horizontalShift + canvas.width + gap) % (canvas.width + gap) - gap;
        const y = (particle.y + verticalShift + canvas.height + gap) % (canvas.height + gap) - gap;

        context.globalAlpha = opacity;
        context.fillStyle = particle.color;
        context.fillRect(x, y, particle.size, particle.size);
      }

      context.globalAlpha = 1;
      frameId = window.requestAnimationFrame(render);
    };

    frameId = window.requestAnimationFrame(render);

    const onResize = () => {
      buildParticles();
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
    };
  }, [colors, direction, gap, opacity, speed]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
