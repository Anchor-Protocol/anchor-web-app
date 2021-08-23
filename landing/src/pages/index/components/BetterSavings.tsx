import { isTouchDevice } from '@libs/is-touch-device';
import { useElementIntersection } from '@libs/use-element-intersection';
import { GUI } from 'dat.gui';
import { headerHeight, landingMobileLayout } from 'env';
import { useEffect, useRef, useState } from 'react';
import Regl from 'regl';
import Stats from 'stats.js';
import styled from 'styled-components';
import { animate } from '../graphics/cube-3d';
import { play, stop } from '../graphics/cube-3d/renderer';

export interface BetterSavingsProps {
  className?: string;
  disable3D?: boolean;
}

function measureGraphicsSize(windowInnerWidth: number): number {
  return Math.max(500, Math.min(Math.floor(windowInnerWidth * 0.6), 900));
}

function measureHeight(windowInnerHeight: number): number {
  return windowInnerHeight - headerHeight;
}

function BetterSavingsBase({
  className,
  disable3D = false,
}: BetterSavingsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const intersection = useElementIntersection({ elementRef: canvasRef });

  const isIntersecting = intersection?.isIntersecting ?? false;

  const [graphicsSize, setGraphicsSize] = useState<number>(() =>
    measureGraphicsSize(window.innerWidth),
  );

  const [height] = useState<number>(() => measureHeight(window.innerHeight));

  useEffect(() => {
    function resize() {
      setGraphicsSize(measureGraphicsSize(window.innerWidth));
      //setHeight(measureHeight(window.innerHeight));
    }

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    if (disable3D || !isIntersecting) return;

    let gui: GUI | null = null,
      stats: Stats | null = null;

    if (process.env.NODE_ENV === 'development' && !isTouchDevice()) {
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
  }, [disable3D, isIntersecting]);

  return (
    <section className={className} style={{ height }}>
      <h2 className="title">
        <span>Better</span> <span>Savings</span>
      </h2>
      <canvas
        ref={canvasRef}
        width={graphicsSize * 2}
        height={graphicsSize * 2}
        style={{
          width: graphicsSize,
          height: graphicsSize,
          opacity: isIntersecting ? 1 : 0,
          border: disable3D ? '2px dashed blue' : undefined,
        }}
      />
    </section>
  );
}

export const BetterSavings = styled(BetterSavingsBase)`
  position: relative;

  display: grid;
  place-items: center;

  width: 100%;
  overflow: hidden;

  > h2 {
    font-size: clamp(80px, 10vw, 156px);
    font-weight: 900;
    text-align: center;
    line-height: 1em;

    text-shadow: rgb(255 255 255 / 50%) 0 -1px 2px, rgb(0 0 0) 1px 1px 1px;
    color: rgb(47, 50, 46);
    word-spacing: 1.4em;
  }

  > canvas {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-56%, -50%);

    transition: opacity 2s ease-out;
  }

  @media (max-width: ${landingMobileLayout}px) {
    > h2 {
      margin-top: 40vh;
    }

    > canvas {
      top: 40%;
      transform: translate(-50%, -50%);
    }
  }
`;
