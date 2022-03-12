import React from 'react';
import { PaddedLayout } from 'components/layouts/PaddedLayout';
import { FlexTitleContainer, PageTitle } from 'components/primitives/PageTitle';
import { links, screen } from 'env';
import { Overview } from 'pages/borrow/components/Overview';
import { ParticipateInLiquidationsButton } from 'pages/borrow/components/ParticipateInLiquidationsButton';
import styled from 'styled-components';
import { CollateralList } from './components/CollateralList';
import { ReactComponent as InfoIcon } from './assets/info.svg';
import { ReactComponent as LinkIcon } from './assets/link.svg';
import { MessageBox } from 'components/MessageBox';
import { useDeploymentTarget } from '@anchor-protocol/app-provider';

export interface BorrowProps {
  className?: string;
}

function BorrowBase({ className }: BorrowProps) {
  const {
    target: { isNative },
  } = useDeploymentTarget();
  return (
    <PaddedLayout className={className}>
      <FlexTitleContainer>
        <PageTitle title="BORROW" docs={links.docs.borrow} />
        <Buttons>
          <ParticipateInLiquidationsButton />
        </Buttons>
      </FlexTitleContainer>

      <Overview className="borrow" />
      <CollateralList className="collateral-list" />

      {isNative && (
        <MessageBox
          className="message-box"
          variant="highlight"
          textAlign="left"
          icon={<InfoIcon />}
          level="info"
          hide={{
            id: 'borrow_wormhole_transfer',
            period: 1000 * 60 * 60 * 24 * 7,
          }}
        >
          bAssets that have been transferred to Terra through Wormhole (e.g.
          webETH) must go through the convert operation to be used as collateral
          on Anchor.{' '}
          <a href="/basset">
            Convert Wormhole bAsset
            <LinkIcon />
          </a>
        </MessageBox>
      )}
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

export const Borrow = styled(BorrowBase)`
  // ---------------------------------------------
  // style
  // ---------------------------------------------
  .market {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;

    h1 {
      img {
        transform: scale(1.3) translateY(3px);
        margin-right: 5px;
      }
    }

    .loan-buttons {
      display: grid;
      grid-template-columns: repeat(2, 180px);
      grid-gap: 10px;

      button {
        height: 48px;
        border-radius: 26px;
      }
    }
  }

  h2 {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: -0.3px;
    color: ${({ theme }) => theme.textColor};
  }

  .borrow {
    article {
      margin-bottom: 80px;
    }

    figure {
      height: 53px;
    }
  }

  .collateral-list,
  .loan-list {
    table {
      thead {
        th {
          text-align: right;

          &:first-child {
            font-size: 12px;
            font-weight: 500;
            color: ${({ theme }) => theme.textColor};
            text-align: left;
          }
        }
      }

      tbody {
        td {
          text-align: right;

          .value,
          .coin {
            font-size: 16px;
          }

          .volatility,
          .name {
            font-size: 12px;
            color: ${({ theme }) => theme.dimTextColor};
          }

          &:first-child {
            text-align: left;

            display: flex;

            align-items: center;

            i {
              width: 60px;
              height: 60px;

              margin-right: 15px;

              svg,
              img {
                display: block;
                width: 60px;
                height: 60px;
              }
            }

            .coin {
              font-weight: bold;

              grid-column: 2;
              grid-row: 1/2;
            }

            .name {
              grid-column: 2;
              grid-row: 2;
            }
          }

          &:last-child {
            button {
              height: 32px;
              font-size: 12px;
              font-weight: 500;

              padding: 0 24px;

              &:not(:last-child) {
                margin-right: 10px;
              }
            }
          }
        }
      }
    }
  }

  .message-box {
    font-size: 13px;
    color: ${({ theme }) => theme.messageBox.textColor};
    svg: {
      path {
        fill: ${({ theme }) => theme.messageBox.textColor};
      }
    }
    a {
      color: ${({ theme }) => theme.messageBox.linkColor};
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      svg {
        margin-left: 4px;
      }
    }
  }

  // ---------------------------------------------
  // layout
  // ---------------------------------------------
  .collateral-list,
  .loan-list {
    h2 {
      margin-bottom: 30px;
    }
  }

  // tablet
  @media (min-width: ${screen.tablet.min}px) and (max-width: ${screen.tablet
      .max}px) {
    .market {
      flex-direction: column;
      align-items: flex-start;

      .loan-buttons {
        width: 100%;
        margin-top: 20px;
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }

  // mobile
  @media (max-width: ${screen.mobile.max}px) {
    .market {
      flex-direction: column;
      align-items: flex-start;

      .loan-buttons {
        width: 100%;
        margin-top: 20px;
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .collateral-list,
    .loan-list {
      h2 {
        margin-bottom: 20px;
      }
    }
  }

  // borrow
  @media (min-width: 1400px) {
    .borrow {
      article {
        display: flex;

        > div {
          flex: 1;

          &:not(:first-child) {
            margin-left: 18px;
          }
        }
      }
    }
  }

  @media (max-width: 1399px) {
    .borrow {
      article {
        display: flex;
        flex-direction: column;

        > div {
          flex: 1;

          &:not(:first-child) {
            margin-top: 18px;
          }
        }
      }
    }
  }
`;
