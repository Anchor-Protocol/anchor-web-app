import { init } from 'pages/index/graphics/cube-3d';
import { useEffect, useRef } from 'react';
import Regl from 'regl';
import styled from 'styled-components';

export interface BetterSavingsProps {
  className?: string;
}

function BetterSavingsBase({ className }: BetterSavingsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const regl = Regl({
      container: ref.current!,
      attributes: {
        antialias: true,
        alpha: true,
      },
    });

    init(regl);
  }, []);

  return (
    <figure className={className}>
      <div>
        <span>Better</span>
        <span>Savings</span>
      </div>
      <div ref={ref} />
    </figure>
  );
}

export const BetterSavings = styled(BetterSavingsBase)`
  position: relative;

  display: grid;
  place-items: center;
  
  height: 900px;

  > :first-child {
    text-shadow: -1px -1px 1px rgba(255, 255, 255, 0.2), 1px 1px 1px #000;
    color: #171717;
    font-size: 156px;
    font-weight: 900;
  }

  > :last-child {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    
    width: 600px;
    height: 600px;
  }
`;
