import { CircleArrowRight } from '@anchor-protocol/icons';
import styled from 'styled-components';

export interface BetterYieldProps {
  className?: string;
}

function BetterYieldBase({ className }: BetterYieldProps) {
  return (
    <section className={className}>
      <article>
        <h2>
          Anchor
          <br />
          offers
          <br />
          better yield
        </h2>
        <p>
          Anchor yields stable and attractive - powered by staking returns from
          multiple Proof of Stake blockchains.
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

export const BetterYield = styled(BetterYieldBase)`
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  padding: 151px 0;

  background-color: #f8f8f8;

  article {
    min-width: 401px;
    max-width: 401px;

    h2 {
      font-size: 58px;
      line-height: 1.1;
      letter-spacing: -1px;
      color: #171717;
    }

    p {
      margin-top: 40px;

      font-size: 17px;
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
    width: 40vw;
    height: 40vw;
    max-width: 598px;
    max-height: 598px;
    border-radius: 50%;
    box-shadow: 32px 76px 84px -42px rgba(0, 0, 0, 0.14),
      inset -2px -2px 4px 0 rgba(0, 0, 0, 0.05), inset 2px 2px 4px 0 #ffffff;
    background-image: linear-gradient(145deg, #fbfbfb 14%, #f3f3f3 89%);
  }

  @media (max-width: 1000px) {
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center;

    padding: 100px 58px;

    article {
      margin-top: 64px;

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
      border-radius: 50%;
    }
  }
`;
