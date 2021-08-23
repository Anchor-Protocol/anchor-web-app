import { CircleArrowRight } from '@anchor-protocol/icons';
import { useElementIntersection } from '@libs/use-element-intersection';
import { links } from 'env';
import { useRef } from 'react';
import styled from 'styled-components';
import signalImage from './assets/signal.png';
import signal2xImage from './assets/signal@2x.png';

export interface FrictionlessAcessProps {
  className?: string;
}

function FrictionlessAcessBase({ className }: FrictionlessAcessProps) {
  const elementRef = useRef<HTMLElement>(null);

  const elementIntersection = useElementIntersection({
    elementRef,
    threshold: 0.4,
    observeOnce: true,
  });

  return (
    <section
      ref={elementRef}
      className={className}
      data-intersection={elementIntersection?.isIntersecting}
    >
      <article>
        <h2>Anchor offers frictionless access</h2>
        <p>
          Anchor savings has no minimum deposits, account freezes, or signup
          requirements - it can be used by anyone in the world with access to
          the internet.
          <br />
          <a href={links.frictionlessAccess} target="_blank" rel="noreferrer">
            Learn more <CircleArrowRight />
          </a>
        </p>
      </article>

      <figure></figure>
    </section>
  );
}

export const FrictionlessAcess = styled(FrictionlessAcessBase)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: #f8f8f8;

  min-width: 0;

  padding: 200px 0;

  article {
    min-width: 401px;

    font-size: 17px;
    text-align: center;

    h2 {
      font-size: 3.5em;
      line-height: 1.1;
      letter-spacing: -1px;
      color: #171717;
    }

    p {
      margin: 40px auto 0 auto;

      max-width: 670px;

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
    width: 100%;
    //max-width: 1520px;
    min-height: 242px;

    background-image: url('${devicePixelRatio > 1
      ? signal2xImage
      : signalImage}');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;

    overflow: hidden;
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

  figure {
    opacity: 0;
    transition: opacity 1s ease-out;
  }

  &[data-intersection='true'] {
    article {
      h2,
      p {
        opacity: 1;
        transform: none;
      }
    }

    figure {
      opacity: 1;
    }
  }

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  @media (max-width: 1100px) {
    flex-direction: column-reverse;

    padding: 100px 0;

    article {
      min-width: 0;
      max-width: 517px;

      padding: 0 58px;

      text-align: left;
    }

    figure {
      margin-bottom: min(85px, 10vw);
      background-position: 55% 0;
    }
  }

  @media (max-width: 600px) {
    article {
      font-size: 14px;
    }

    figure {
      background-position: 53% 0;
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
