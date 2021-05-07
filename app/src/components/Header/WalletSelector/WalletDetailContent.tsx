import { Wallet } from '@anchor-protocol/icons';
import {
  demicrofy,
  formatANC,
  formatAUSTWithPostfixUnits,
  formatLP,
  formatLuna,
  formatUSTWithPostfixUnits,
  truncate,
} from '@anchor-protocol/notation';
import {
  WalletReady,
  WalletStatusType,
} from '@anchor-protocol/wallet-provider';
import { Check, KeyboardArrowRight, HelpOutline } from '@material-ui/icons';
import { FlatButton } from '@terra-dev/neumorphism-ui/components/FlatButton';
import { IconSpan } from '@terra-dev/neumorphism-ui/components/IconSpan';
import { Tooltip } from '@terra-dev/neumorphism-ui/components/Tooltip';
import { Bank } from 'base/contexts/bank';
import { useCallback } from 'react';
import useClipboard from 'react-use-clipboard';
import styled from 'styled-components';

interface WalletDetailContentProps {
  className?: string;
  status: WalletReady;
  closePopup: () => void;
  disconnectWallet: () => void;
  bank: Bank;
  openSend: () => void;
}

export function WalletDetailContentBase({
  className,
  status,
  disconnectWallet,
  closePopup,
  bank,
  openSend,
}: WalletDetailContentProps) {
  const [isCopied, setCopied] = useClipboard(status.walletAddress, {
    successDuration: 1000 * 5,
  });

  const viewOnTerraFinder = useCallback(() => {
    window.open(
      `https://finder.terra.money/${status.network.chainID}/account/${status.walletAddress}`,
      '_blank',
    );
  }, [status]);

  return (
    <div className={className}>
      <section>
        <div className="wallet-icon">
          <Wallet />
        </div>

        <h2 className="wallet-address">{truncate(status.walletAddress)}</h2>

        <button className="copy-wallet-address" onClick={setCopied}>
          <IconSpan>COPY ADDRESS {isCopied && <Check />}</IconSpan>
        </button>

        <ul>
          <li>
            <span>UST</span>
            <span>
              {formatUSTWithPostfixUnits(demicrofy(bank.userBalances.uUSD))}
            </span>
          </li>
          <li>
            <span>aUST</span>
            <span>
              {formatAUSTWithPostfixUnits(demicrofy(bank.userBalances.uaUST))}
            </span>
          </li>
          <li>
            <span>Luna</span>
            <span>{formatLuna(demicrofy(bank.userBalances.uLuna))}</span>
          </li>
          <li>
            <span>bLuna</span>
            <span>{formatLuna(demicrofy(bank.userBalances.ubLuna))}</span>
          </li>
          <li>
            <span>ANC</span>
            <span>{formatANC(demicrofy(bank.userBalances.uANC))}</span>
          </li>
          {process.env.NODE_ENV === 'development' && (
            <>
              <li>
                <span>ANC-UST LP</span>
                <span>{formatLP(demicrofy(bank.userBalances.uAncUstLP))}</span>
              </li>
              <li>
                <span>bLuna-Luna LP</span>
                <span>
                  {formatLP(demicrofy(bank.userBalances.ubLunaLunaLP))}
                </span>
              </li>
            </>
          )}
        </ul>

        {status.status === WalletStatusType.CONNECTED && (
          <>
            <div className="bridge">
              <div>
                <Tooltip
                  title="Transfer Terra assets from Ethereum"
                  placement="top"
                >
                  <FlatButton
                    component="a"
                    href="https://bridge.terra.money/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAAA8CAYAAABYfzddAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyVpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAyIDc5LjE2NDQ2MCwgMjAyMC8wNS8xMi0xNjowNDoxNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDIxRUFCODM3ODBGMTFFQkFENDE5NUY0RERFMDBGMDkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDIxRUFCODQ3ODBGMTFFQkFENDE5NUY0RERFMDBGMDkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEMjFFQUI4MTc4MEYxMUVCQUQ0MTk1RjREREUwMEYwOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEMjFFQUI4Mjc4MEYxMUVCQUQ0MTk1RjREREUwMEYwOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvouRTkAAAsCSURBVHja7F17yBxXFZ+vqdGmttmWis+SbaEPiiTbqvGB8k1AilXbbEH8q5otigpi80UEH6jZUKFIC1kEwdo/ulGrRYRuq9JakMwXwQo+MpFoqw3Jpi8rfWS/mljbtK6/w56ptzf33rkzO7Mzm5wfHOb7Zu577u+ec8+9d3ZhPB4HAoFgPnGaNIFAIAQWCARCYIFAIAQWCITAAoFACCwQCITAAoFACCwQCIEFAoEQWCAQCIEFAiGwQCAQAgsEglnidGmCUxsLCwsndf3G43EDl5ZS36hm5RMCC+aWXE1cOsqtqASCEXl3q2PWyayBZ3E4eFPdRsE56ey5ouVMdxkyhAzwrgYlVosIvF27J31D5sCCKbEI2QK5CwQfQtrSJEJgwXxiHRO5L00hBBZUhx08/3uVqMD/l9MUB7INcliLv6VoTUxTqYVXoyuvSQgsyE+omEnVgzSZ9Cp60kpCYMH8EJo04t2qOQ0tHErL1Ae6F/oCjzh/hpxlefYByGMp8Z/Ub6BTkPl2GeRdXIa1/OifkP2QPehMK65EkcYqR7leRPx/K2HXBxNHzVshr4M8C+kjzCN4RoPa2ZZ0jiPMMSWdy9jkfBvkDE5nF8IcNpTvNbhcCrkYcj7X8UzIC5AjkCcgpAEfqlkfIa27Wfm/KbSpEWgZIRHP8KOxHc2Meb8BciPk0bEbL0B+DLnIkVbLEb/PYULIXkuYNodpOtIZcJj3Qn7nSofDnQX5NOTnkKNjPxyCfBlypu09ZRAVXVMYz/ekYsnwvAOJWHqO5wlC5VmkSMujLA0qAyQ2tF3MzxpK+FAN4FlfKu/A0Nfp/75uhVCdXfXPUYce98PUd1wJgUnjcgV8O3WC/0A+k4fAkG9C/usI40VgLvdLHumcBnlinB+0fHNF1QQ2tGtoCNNVnkda3KGhbqFlcAhTyrKU0v9UonWyEpjDDj3fT5T0d21wigqqg/WdqXJ6BRp/NS53QD6WI/prIbeSdoKpuTNDvGsdZnEWbNLMSdf8kQaLX+PP63LmRcs3u5HGRqT1twqNNN3zHPtqMVxuL7DfkBW1xTM4TU9uZ40+KKm8NAWLs/gELHVYUdq0pUwfCdt5ytKphROL57o/ykleFbcgrfdnCH92QVXIms6dBeT3A263KqZX1KFUk5nm9yPPeD1DR72bPdvDAsi7C3K5tgy2ie8n2Orq/Cnkpd1o12rLXAusDJaVgSLy8Quwaa3Wgfwk10PI3A9ZGpz+PiUcxenXYg6M519wxCVz+ruQj0OugtwAedARfq/asVNMaB/4mNDe6SSOK8iz2vPjEHKW/QXyd8jzHmleOWsTmueBI80sbVrCdjXTMtbmdG3P+bXJPG8bzOOWh9lv7KeGsE1DWB/Sty15RBbTXJ/nNhxTo4ZhfhxWakIjs/NwudHy+EHIRzDAHVLu3Ys4t+L6U8g1hjj0Eq+E/CpjUfZC7oE8DvkXj3qU1lMZ09nP5tkjkOc4nfVqOqgPkZW08IWsfWjkfpjuK+1C7+CDkJshb7fkRfW/f8pXQOTomgZwQ7uGmilH2qKNcvtozkVNY3emLHdP0+IhrVenTF8S0zbS6mFCVwtzPeL3PaZIgwx59LW2DFMsmRG/g5inUkk5w8o0MJ591RKHOvklKR67FUvcXRk08Ms2B5hhRE7DF4s2a5HeWshBS35xARo4LyLVq+uhgb2cOT4a2KB9lzK2adtDA4+yltnglLLW26B9OxlWFzo6vyrzQltc5oT7PPL8mSXu4xkIfLNn/dIIfFuJVso2S55HKiRw4hHvZCRwswAC9zXTuZGjTWMbgQ3kaud8byMHgXtqO7oUqMc7XKrEhKb1UDYvTVjvMfJdarn/FsQ9B+bIEY9ifKeg6tySR7vi8mHIO9icPpcfvRRMNnCQl/kByAFLEo0Cyr0c+B3VS6YUqkd0HXt1O2xKpzmydnma22lQ57qRjwPNYr7u9Eg/CPIfZYwcqxOtKdNfVqYlJ8z9ZzUHpg5gMznfzJIXtJsqjcCH8PIfLaAez2RZ0kGHfxMu34J8ArLaI8rLJb6DyDQHdn2RgzViV+lAizzvDz1IUwQ2KH/HOdOIUwYrtS1GU+Sx2cMnQNZdd4r2aFZF4HNLTHuNR5hhQXkdzEDejbj8EnJehvRXBTUCf3gh1JZxFkkTuxw9NftgQzyDPHwtpEWN0FNjVuvAz1dM4OcKyuuYJ3lpwLonI3lrC/Ykq/u7XXPFwzUrftOX3D5bOS0Iq6rcrDTwk45ndABgGvP2aFHE88CKZzjylr7R8uz3kG/znPcfweQABh2GII39Wch7aspjMp23enTYYUn5N0qIp5e1nVVjs7NuQ0qfSXwJO/Qzz/PyUbvHmKgmU/oAKvXukvM/PuPOfo3lPpGW1gBf1KyDv5LgZe5ngtcR6vxw7YzyVB04ebVc22FZkIeaLIZkrZW8vP2MDri0+X4cOJxQc2FCo0FomLnX8ngjGm0xZZRbDfk6e3PnARda7t+mkVfH62tcp1YOS6TI+euGHKfdSPt2UoJ1tYFp4Ltcxb6BtDmtuhd7c56lsDrMgQnfdzy7AxW72NJI1KlpNxPt4tqH/983BwS2zcvT7KVOHSvDxFG9rNGMsu5n1HYmcq5NUS6Uprr3mMzhyHVIgfcKUBts8RjQBo4BY34IjIbaE9i3PdJS0B94Q8AVfE74EjpLi/t/CiYbvAM2dfbg/jf4AH9dYZvzfx7lXmPoEKsgXwv8T9vMmryDlE5ZVp+Jg/8fHCAs+n5cj9est2Yws1c0Eu/mTSBd3vAR8t9U90OK5qXdgD1HHYaBdsDCZ6+1NmjF1rn8jA8znA95qqDdQb9RyeBzoN+3w6Yd6PdI44eONA7y2WQ6tPFJyE2QAx71nfVhhhbH0d93bAjbzbsd0eMwg+mwgdXM5a23PW0HV+p5YM4nztgHe4kpnXKYoWGow5LOP01ahkMh1Z4Hps0UyPSjwWRj/rRH/H6rfianZvheYD8HTJ8M2lFBmTomR5ChTzcCu1d1JXAvIZXRZ4bc2dXjfmTOD3lAJcKQlmty/dqK2byPTda7fPKheT5vtFhKMb3J8dVR1rubFmdfkvbIcPBhJ9err01JksMkm72snoq+yEHbJx/OqXnp8MOXLBqjFhqY07kpR90eKFEDTwuX1itNAyvh2hm+ZPHKkb08n9RR8utyvSPWsl3TWrGmKbspVs0oR9t3avVJHU5nDWS74bysC/dBNjgapzYE5rToTPMxj3o9DbnOdHqmYgIPueOmnb8tncDKu+n7mLbKedtcBJ6iv3TSPOOedXjlsz2ud7yg1snnl+oQ/ivB5EuOJvSy7ifleezVkKsg7+QlmDP48TPB5NwtOTJ+4vpiI+87/pxtOcL3N374xduOrT2EdO7MWD/a0PEpyIeCyXnfc/jR05A/Qn4RTL6IeZS/gXVDgR7qcArTNcrSiRUzcpR2XleLG2rvaeSZX5vNzSTfIZuiAzWNsn+dkDWu+vtOF/isI3O5kjqoA+SQnVaDwGNTzEIJg5JgjnCy/7xohkEkzPrLEGyZ7FVuLSONMGMaU5VdPuwuEEwcSdvTzj1rxOsEJ66HL8264KKBRQOf6tqXiKh/0G6FTdjIYMaGbPrqvpht9JM0OfIXAguEwFMQOPF5pC0duZCLvEJggRC4eCKTRl7nGY0+VNjN4rQTAguEwOWTOdlM0QxOPEEUs0RFfDZICCwQnMIQL7RAIAQWCARCYIFAIAQWCITAAoFACCwQCITAAoFACCwQnFz4nwADABa/qSVRnoDRAAAAAElFTkSuQmCC"
                      alt="Terra Bridge"
                    />
                  </FlatButton>
                </Tooltip>
                <FlatButton
                  component="a"
                  href="https://docs.anchorprotocol.com/user-guide/interchain-transfers"
                  target="_blank"
                  rel="noreferrer"
                >
                  <HelpOutline />
                </FlatButton>
              </div>
            </div>

            <div className="send">
              <FlatButton
                onClick={() => {
                  openSend();
                  closePopup();
                }}
              >
                SEND
              </FlatButton>
            </div>
          </>
        )}

        <div className="outlink">
          <button onClick={viewOnTerraFinder}>
            View on Terra Finder{' '}
            <i>
              <KeyboardArrowRight />
            </i>
          </button>

          {process.env.NODE_ENV === 'development' && (
            <a
              href="https://faucet.terra.money/"
              target="_blank"
              rel="noreferrer"
            >
              Go to Faucet{' '}
              <i>
                <KeyboardArrowRight />
              </i>
            </a>
          )}
        </div>
      </section>

      <button className="disconnect" onClick={disconnectWallet}>
        Disconnect
      </button>
    </div>
  );
}

export const WalletDetailContent = styled(WalletDetailContentBase)`
  > section {
    padding: 32px 28px;

    .wallet-icon {
      width: 38px;
      height: 38px;
      background-color: #000000;
      border-radius: 50%;
      color: #ffffff;

      display: grid;
      place-content: center;

      svg {
        font-size: 16px;
      }
    }

    .wallet-address {
      margin-top: 15px;

      color: ${({ theme }) => theme.textColor};
      font-size: 18px;
      font-weight: 500;
    }

    .copy-wallet-address {
      margin-top: 8px;

      border: 0;
      outline: none;
      border-radius: 12px;
      font-size: 9px;
      padding: 5px 10px;

      background-color: ${({ theme }) =>
        theme.palette.type === 'light' ? '#f1f1f1' : 'rgba(0, 0, 0, 0.15)'};
      color: ${({ theme }) => theme.dimTextColor};

      &:hover {
        background-color: ${({ theme }) =>
          theme.palette.type === 'light' ? '#e1e1e1' : 'rgba(0, 0, 0, 0.2)'};
        color: ${({ theme }) => theme.textColor};
      }
    }

    ul {
      margin-top: 48px;

      padding: 0;
      list-style: none;

      font-size: 12px;
      color: ${({ theme }) =>
        theme.palette.type === 'light'
          ? '#666666'
          : 'rgba(255, 255, 255, 0.6)'};

      border-top: 1px solid
        ${({ theme }) =>
          theme.palette.type === 'light'
            ? '#e5e5e5'
            : 'rgba(255, 255, 255, 0.1)'};

      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 35px;

        &:not(:last-child) {
          border-bottom: 1px dashed
            ${({ theme }) =>
              theme.palette.type === 'light'
                ? '#e5e5e5'
                : 'rgba(255, 255, 255, 0.1)'};
        }
      }

      margin-bottom: 20px;
    }

    .bridge {
      margin-bottom: 10px;

      > div {
        display: flex;

        > :first-child {
          flex: 1;
          height: 28px;

          background-color: ${({ theme }) => theme.colors.positive};

          img {
            height: 24px;
            transform: translateX(13px);
          }

          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }

        > :last-child {
          width: 30px;
          height: 28px;

          margin-left: 1px;

          background-color: ${({ theme }) => theme.colors.positive};

          svg {
            font-size: 1em;
            transform: scale(1.2);
          }

          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
      }
    }

    .send {
      margin-bottom: 20px;

      button {
        width: 100%;
        height: 28px;

        background-color: ${({ theme }) => theme.colors.positive};
      }
    }

    .outlink {
      text-align: center;

      button,
      a {
        border: 0;
        outline: none;
        background-color: transparent;
        font-size: 12px;
        color: ${({ theme }) => theme.dimTextColor};
        display: inline-flex;
        align-items: center;

        i {
          margin-left: 5px;
          transform: translateY(1px);

          width: 16px;
          height: 16px;
          border-radius: 50%;

          svg {
            font-size: 11px;
            transform: translateY(1px);
          }

          background-color: ${({ theme }) =>
            theme.palette.type === 'light' ? '#f1f1f1' : 'rgba(0, 0, 0, 0.15)'};
          color: ${({ theme }) =>
            theme.palette.type === 'light'
              ? '#666666'
              : 'rgba(255, 255, 255, 0.6)'};

          &:hover {
            background-color: ${({ theme }) =>
              theme.palette.type === 'light'
                ? '#e1e1e1'
                : 'rgba(0, 0, 0, 0.2)'};
            color: ${({ theme }) =>
              theme.palette.type === 'light'
                ? '#666666'
                : 'rgba(255, 255, 255, 0.6)'};
          }
        }
      }
    }
  }

  .disconnect {
    border: none;
    outline: none;

    background-color: ${({ theme }) =>
      theme.palette.type === 'light' ? '#f1f1f1' : 'rgba(0, 0, 0, 0.15)'};
    color: ${({ theme }) => theme.dimTextColor};

    &:hover {
      background-color: ${({ theme }) =>
        theme.palette.type === 'light' ? '#e1e1e1' : 'rgba(0, 0, 0, 0.2)'};
      color: ${({ theme }) => theme.textColor};
    }

    font-size: 12px;
    width: 100%;
    height: 36px;

    border-bottom-left-radius: 14px;
    border-bottom-right-radius: 14px;
  }
`;
