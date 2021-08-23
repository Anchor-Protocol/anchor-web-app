import { CircleArrowRight } from '@anchor-protocol/icons';
import { useElementIntersection } from '@libs/use-element-intersection';
import { links } from 'env';
import { useRef } from 'react';
import styled from 'styled-components';
import codeImage from './assets/code.png';

export interface EasierIntegrationsProps {
  className?: string;
}

function EasierIntegrationsBase({ className }: EasierIntegrationsProps) {
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
      <figure>
        <div>
          <img src={codeImage} alt="code" />
        </div>
      </figure>

      <article>
        <h2>
          Anchor
          <br />
          offers easier
          <br />
          integrations
        </h2>
        <p>
          Anchor’s open source Savings-as-a-Service SDK can be integrated in 10
          lines of code to any serviced application holding user balances.
          <br />
          <a href={links.easierIntegration} target="_blank" rel="noreferrer">
            Read the docs <CircleArrowRight />
          </a>
        </p>
      </article>
    </section>
  );
}

export const EasierIntegrations = styled(EasierIntegrationsBase)`
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
    width: 50vw;
    height: 58vw;
    max-width: 597px;
    max-height: 728px;
    border-radius: 43px;
    box-shadow: inset 2px 3px 3px 0 rgba(0, 0, 0, 0.06),
      inset -2px -3px 3px 0 #ffffff;
    background-color: #f8f8f8;
    padding: 28px;

    > div {
      width: 100%;
      height: 100%;
      border-radius: 30px;
      box-shadow: inset 0 0 16px 0 rgba(0, 0, 0, 0.09);
      background-image: linear-gradient(219deg, #585858 0%, #252525 100%);

      padding: 0;

      img {
        width: 100%;
      }
    }
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
    transform: translateX(-10%) scale(1.1);
    transition: opacity 1s ease-out, transform 0.3s ease-in-out;
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
      transform: none;
    }
  }

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  @media (max-width: 1100px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;

    padding: 100px 58px;

    background-image: linear-gradient(219deg, #585858 0%, #252525 100%);

    article {
      margin-top: 64px;

      min-width: 0;
      max-width: 100%;

      h2 {
        color: #ffffff;
      }

      p {
        color: rgba(255, 255, 255, 0.7);
        max-width: 401px;
      }
    }

    figure {
      width: 70vw;
      height: 50vw;
      max-width: 400px;
      max-height: 300px;

      box-shadow: none;
      background-color: transparent;
      padding: 0;

      > div {
        box-shadow: none;
        background-image: none;
        padding: 0;
      }

      transform: scale(1.2);
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
