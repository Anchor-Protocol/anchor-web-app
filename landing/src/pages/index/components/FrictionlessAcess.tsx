import { CircleArrowRight } from '@anchor-protocol/icons';
import styled from 'styled-components';
import signalImage from './assets/signal.png';
import signal2xImage from './assets/signal@2x.png';

export interface FrictionlessAcessProps {
  className?: string;
}

function FrictionlessAcessBase({ className }: FrictionlessAcessProps) {
  return (
    <section className={className}>
      <article>
        <h2>Anchor offers frictionless access</h2>
        <p>
          Anchor savings has no minimum deposits, account freezes, or signup
          requirements - it can be used by anyone in the world with access to
          the internet.
          <br />
          <button>
            Learn more <CircleArrowRight />
          </button>
        </p>
      </article>

      <figure></figure>
    </section>
  );
}

export const FrictionlessAcess = styled(FrictionlessAcessBase)`
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

    button {
      margin-top: 16px;

      border: none;
      outline: none;
      background-color: transparent;
      padding: 0;
      font-size: 14px;
      color: #5ebfc9;
      font-weight: 500;

      svg {
        font-size: 1em;
        transform: scale(1.4) translate(4px, 1px);
      }
    }
  }

  figure {
    width: 100%;
    max-width: 1520px;
    min-height: 242px;

    background-image: url('${devicePixelRatio > 1
      ? signal2xImage
      : signalImage}');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;

    overflow: hidden;
  }

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
      background-position: 60% 0;
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
