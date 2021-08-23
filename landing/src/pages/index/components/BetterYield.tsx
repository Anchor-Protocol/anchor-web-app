import { CircleArrowRight } from '@anchor-protocol/icons';
import { scaleLinear } from 'd3-scale';
import { arc } from 'd3-shape';
import { links } from 'env';
import { useRef } from 'react';
import { animated, useSpring } from 'react-spring';
import styled from 'styled-components';
import circleBackground from './assets/circleBackground.png';
import textBackground from './assets/textBackground.png';
import { useElementIntersection } from '@libs/use-element-intersection';
import numeral from 'numeral';

export interface BetterYieldProps {
  className?: string;
}

type Value = { ratio: number };

const radialScale = scaleLinear()
  .domain([0, 1])
  .range([Math.PI * -0.75, Math.PI * 0.75]);

const amountScale = scaleLinear().domain([0, 1]).range([0, 1000]);

const pathGenerator = arc<Value>()
  .innerRadius(274)
  .outerRadius(278)
  .cornerRadius(2)
  .startAngle(radialScale(0))
  .endAngle(({ ratio }) => radialScale(ratio));

function BetterYieldBase({ className }: BetterYieldProps) {
  const elementRef = useRef<HTMLElement>(null);

  const elementIntersection = useElementIntersection({
    elementRef,
    threshold: 0.8,
    observeOnce: true,
  });

  const intersection = useSpring<Value>({
    ratio: elementIntersection?.isIntersecting === true ? 1 : 0,
    config: {
      friction: 60,
    },
  });

  return (
    <section
      ref={elementRef}
      className={className}
      data-intersection={elementIntersection?.isIntersecting}
    >
      <article>
        <h2>
          Anchor
          <br />
          offers
          <br />
          better yield
        </h2>
        <p>
          Anchor's yield is stable and attractive - powered by staking returns
          from multiple Proof of Stake blockchains.
          <br />
          <a href={links.betterYield} target="_blank" rel="noreferrer">
            Learn more <CircleArrowRight />
          </a>
        </p>
      </article>

      <figure>
        <Circle ratio={intersection.ratio} />
      </figure>
    </section>
  );
}

const Circle = animated((props: Value) => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 598 598">
      <defs>
        <pattern
          id="pattern"
          patternUnits="userSpaceOnUse"
          width="3"
          height="3"
        >
          <image xlinkHref={textBackground} width="3" height="3" />
        </pattern>
        <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" style={{ stopColor: '#cccccc', stopOpacity: 1 }} />
          <stop offset="20%" style={{ stopColor: '#cccccc', stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: '#555555', stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>
      {props.ratio > 0 && (
        <path
          d={pathGenerator(props) ?? ''}
          strokeLinecap="round"
          fill="url(#gradient)"
          transform="translate(299, 299)"
        />
      )}
      <text opacity="0.4" fontSize="10" fill="#373737">
        <tspan x="114" y="505">
          BANK
        </tspan>
      </text>
      <text opacity="0.4" fontSize="10" fill="#373737">
        <tspan x="440" y="505">
          ANCHOR
        </tspan>
      </text>
      <text>
        <tspan
          x="299"
          y="340"
          textAnchor="middle"
          fontSize="120"
          fontWeight="900"
          letterSpacing="-4"
          fill="url(#pattern)"
        >
          ${numeral(amountScale(props.ratio)).format('0,0')}
        </tspan>
      </text>
    </svg>
  );
});

export const BetterYield = styled(BetterYieldBase)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  padding: 151px 0;

  background-color: #f8f8f8;

  article {
    min-width: 401px;
    max-width: 401px;

    font-size: 17px;

    h2 {
      font-size: 3.5em;
      line-height: 1.1;
      letter-spacing: -1px;
      color: #171717;
    }

    p {
      margin-top: 40px;

      font-size: 1em;
      line-height: 1.41;
      color: rgba(0, 0, 0, 0.7);
      letter-spacing: -0.28px;

      word-break: break-word;
      white-space: break-spaces;
    }

    a {
      margin-top: 16px;

      display: inline-block;
      text-decoration: none;

      border: none;
      outline: none;
      background-color: transparent;
      padding: 0;
      font-size: 14px;
      color: #70d870;
      font-weight: 700;

      svg {
        font-size: 1em;
        transform: scale(1.4) translate(4px, 2px);
      }
    }
  }

  figure {
    width: 40vw;
    height: 40vw;
    max-width: 598px;
    max-height: 598px;
    border-radius: 50%;
    box-shadow: 32px 76px 84px -42px rgba(0, 0, 0, 0.14),
      inset -2px -2px 4px 0 rgba(0, 0, 0, 0.05), inset 2px 2px 4px 0 #ffffff;
    background-image: url('${circleBackground}'),
      linear-gradient(145deg, #fbfbfb 14%, #f3f3f3 89%);
    background-size: cover;
    transform: scale(1.2);
  }

  // ---------------------------------------------
  // animation
  // ---------------------------------------------
  article {
    h2,
    p {
      opacity: 0;
      transform: scale(1.5);
      transition: opacity 1s ease-out, transform 0.3s ease-in-out;
    }
  }

  &[data-intersection='true'] {
    article {
      h2,
      p {
        opacity: 1;
        transform: none;
      }
    }
  }

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  @media (max-width: 1100px) {
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center;

    padding: 100px 58px;

    article {
      margin-top: max(64px, 10vw);

      min-width: 0;
      max-width: 100%;

      p {
        max-width: 401px;
      }
    }

    figure {
      width: 70vw;
      height: 70vw;
      max-width: 400px;
      max-height: 400px;
    }
  }

  @media (max-width: 600px) {
    article {
      font-size: 14px;
    }
  }

  @media (max-width: 500px) {
    article {
      h2 {
        font-size: 2.6em;
      }
    }
  }
`;
