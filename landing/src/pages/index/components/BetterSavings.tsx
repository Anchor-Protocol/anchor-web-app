import { useElementIntersection } from '@anchor-protocol/use-element-intersection';
import { GUI } from 'dat.gui';
import { useEffect, useRef, useState } from 'react';
import Regl from 'regl';
import Stats from 'stats.js';
import styled from 'styled-components';
import { animate } from '../graphics/cube-3d';
import { play, stop } from '../graphics/cube-3d/renderer';

export interface BetterSavingsProps {
  className?: string;
}

function getSize(): number {
  return Math.max(500, Math.min(Math.floor(window.innerWidth * 0.6), 900));
}

function BetterSavingsBase({ className }: BetterSavingsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const intersection = useElementIntersection({ elementRef: canvasRef });

  const isIntersecting = intersection?.isIntersecting ?? false;

  const [size, setSize] = useState<number>(() => getSize());

  useEffect(() => {
    function listener() {
      setSize(getSize());
    }

    window.addEventListener('resize', listener);

    return () => {
      window.removeEventListener('resize', listener);
    };
  }, []);

  useEffect(() => {
    if (!isIntersecting) return;

    let gui: GUI | null = null,
      stats: Stats | null = null;

    if (process.env.NODE_ENV === 'development') {
      gui = new GUI({ width: 300 });

      stats = new Stats();
      stats.showPanel(0);

      document.body.appendChild(stats.dom);
    }

    const regl = Regl({
      canvas: canvasRef.current!,
      attributes: {
        antialias: true,
        alpha: true,
      },
    });

    play(regl, animate(regl, gui, stats));

    return () => {
      stop();
      
      if (!!gui) {
        gui.destroy();
      }

      if (!!stats) {
        document.body.removeChild(stats.dom);
      }
    };
  }, [isIntersecting]);

  return (
    <section className={className}>
      <h2 className="title">Better Savings</h2>
      <canvas
        ref={canvasRef}
        width={size * 2}
        height={size * 2}
        style={{ width: size, height: size, opacity: isIntersecting ? 1 : 0 }}
      />
    </section>
  );
}

export const BetterSavings = styled(BetterSavingsBase)`
  position: relative;

  display: grid;
  place-items: center;

  width: 100%;
  height: max(450px, 80vh);

  > h2 {
    text-shadow: -1px -1px 1px rgba(255, 255, 255, 0.2), 1px 1px 1px #000;
    color: #171717;
    font-size: clamp(80px, 10vw, 156px);
    font-weight: 900;
    text-align: center;
    word-spacing: 1em;
    line-height: 1em;
  }

  > canvas {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    transition: opacity 2s ease-out;
  }

  @media (max-width: 500px) {
    height: 80vh;

    > h2 {
      margin-top: 40vh;
    }

    > canvas {
      top: 40%;
    }
  }
`;
