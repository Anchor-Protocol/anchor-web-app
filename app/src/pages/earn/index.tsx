import { PaddedLayout } from 'components/layouts/PaddedLayout';
import { FlexTitleContainer, PageTitle } from 'components/primitives/PageTitle';
import { links, screen } from 'env';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled from 'styled-components';
import { BuyUstButton } from './components/BuyUstButton';
import { ExpectedInterestSection } from './components/ExpectedInterestSection';
import { InsuranceCoverageButton } from './components/InsuranceCoverageButton';
import { InterestSection } from './components/InterestSection';
import { TotalDepositSection } from './components/TotalDepositSection';

export interface EarnProps {
  className?: string;
}

function Component({ className }: EarnProps) {
  return (
    <PaddedLayout className={className}>
      <FlexTitleContainer>
        <PageTitle title="EARN" docs={links.docs.earn} />
        <Buttons>
          <InsuranceCoverageButton />
          <BuyUstButton />
        </Buttons>
      </FlexTitleContainer>
      <section className="grid">
        <TotalDepositSection className="total-deposit" />
        <InterestSection className="interest" />
        <ExpectedInterestSection className="expected-interest" />
      </section>
    </PaddedLayout>
  );
}

const Buttons = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 700px) {
    width: 100%;
    gap: 0;
    justify-content: stretch;
    flex-direction: column;
  }
`;

const StyledComponent = styled(Component)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  h2 {
    margin: 0;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: -0.3px;
    color: ${({ theme }) => theme.textColor};
  }

  hr {
    margin: 30px 0;
  }

  .decimal-point {
    color: ${({ theme }) => theme.dimTextColor};
  }

  .total-deposit {
    .amount {
      font-size: 32px;
      font-weight: 500;
      letter-spacing: -0.3px;
      color: ${({ theme }) => theme.textColor};

      .denom {
        font-size: 18px;
      }
    }

    .total-deposit-buttons {
      margin-top: 64px;
    }
  }

  .interest {
    .apy {
      text-align: center;

      .name {
        margin-bottom: 5px;
      }

      .value {
        font-size: 50px;
        font-weight: 500;
        color: ${({ theme }) => theme.colors.primary};
        margin-bottom: 50px;
      }

      figure {
        width: 100%;
        height: 300px;
      }
    }
  }

  .expected-interest {
    .amount {
      font-size: 32px;
      font-weight: 500;
      letter-spacing: -0.3px;
      color: ${({ theme }) => theme.textColor};

      .denom {
        font-size: 18px;
      }
    }

    .tab {
      margin-top: 64px;
    }
  }

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  .total-deposit {
    h2 {
      margin-bottom: 15px;
    }

    .total-deposit-buttons {
      display: grid;
      grid-template-columns: repeat(2, 142px);
      justify-content: end;
      grid-gap: 20px;
    }
  }

  .interest {
    h2 {
      margin-bottom: 10px;
    }
  }

  .expected-interest {
    h2 {
      margin-bottom: 15px;
    }
  }

  // pc
  @media (min-width: ${screen.monitor.min}px) {
    .grid {
      display: grid;

      grid-template-columns: 1fr 1fr 554px;
      grid-template-rows: auto auto;
      grid-gap: 40px;

      .NeuSection-root {
        margin: 0;
      }

      .total-deposit {
        grid-column: 1/3;
        grid-row: 1;
      }

      .interest {
        grid-column: 3;
        grid-row: 1/3;
      }

      .expected-interest {
        grid-column: 1/3;
        grid-row: 2/3;
      }
    }

    .interest {
      .NeuSection-content {
        padding: 60px 40px;
      }
    }
  }

  // under pc
  @media (max-width: ${screen.pc.max}px) {
    .interest {
      .apy {
        figure {
          height: 180px;
        }
      }
    }

    .expected-interest {
      height: unset;
    }
  }

  // mobile
  @media (max-width: ${screen.mobile.max}px) {
    .decimal-point {
      display: none;
    }

    .total-deposit {
      h2 {
        margin-bottom: 10px;
      }

      .amount {
        font-size: 40px;
      }

      .total-deposit-buttons {
        margin-top: 30px;
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 15px;
      }
    }

    .interest {
      .apy {
        figure {
          height: 150px;
        }
      }
    }

    .expected-interest {
      h2 {
        margin-bottom: 10px;
      }

      .amount {
        font-size: 40px;
      }

      .tab {
        margin-top: 30px;
      }
    }
  }
`;

export const Earn = fixHMR(StyledComponent);
