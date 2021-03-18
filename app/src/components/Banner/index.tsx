import { getParser } from 'bowser';
import MobileDetect from 'mobile-detect';
import { useMemo } from 'react';
import styled from 'styled-components';

export interface BannerProps {
  className?: string;
}

function BannerBase({ className }: BannerProps) {
  const isDesktopChrome = useMemo(() => {
    const browser = getParser(navigator.userAgent);
    const mobileDetect = new MobileDetect(navigator.userAgent);

    return (
      browser.satisfies({
        chrome: '>60',
        edge: '>80',
      }) && !mobileDetect.os()
    );
  }, []);

  if (!isDesktopChrome) {
    return (
      <div className={className}>
        <p>
          Anchor currently only supports{' '}
          <a href="https://www.google.com/chrome/">desktop Chrome</a>
        </p>
      </div>
    );
  }

  return null;
}

export const Banner = styled(BannerBase)`
  height: 70px;
  background-color: #cfb673;
  display: flex;
  justify-content: center;
  align-items: center;

  color: ${({ theme }) => theme.textColor};
  font-size: 0.9em;

  button {
    font-size: 0.8em;
    background-color: transparent;
    outline: none;
    cursor: pointer;
    border: 1px solid currentColor;

    margin-left: 10px;

    color: ${({ theme }) => theme.textColor};

    padding: 5px 15px;
    border-radius: 20px;
  }
`;
