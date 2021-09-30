import { useTerraWebapp } from '@libs/webapp-provider';
import { useWallet } from '@terra-dev/use-wallet';
import { useFlags } from 'contexts/flags';
import React, { ReactElement, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { ReactComponent as Logo } from './assets/logo.svg';
import { ReactComponent as Wheel } from './assets/wheel.svg';

export function MaintenanceBlocker({ children }: { children: ReactElement }) {
  const { lastSyncedHeight } = useTerraWebapp();

  const { maintenanceDownBlock, forceMaintenanceDown } = useFlags();

  const [maintenanceDown, setMaintenanceDown] =
    useState<boolean>(forceMaintenanceDown);

  const { network } = useWallet();

  useEffect(() => {
    if (!network.chainID.startsWith('columbus')) {
      setMaintenanceDown(false);
      return;
    }

    if (forceMaintenanceDown) {
      setMaintenanceDown(true);
    } else if (maintenanceDownBlock > 0) {
      function check() {
        lastSyncedHeight().then((blockHeight) => {
          console.log('MAINTANANCE_DOWN', {
            blockHeight,
            maintenanceDownBlock,
          });
          setMaintenanceDown(blockHeight > maintenanceDownBlock);
        });
      }

      const intervalId = setInterval(check, 1000 * 10);

      check();

      return () => {
        clearInterval(intervalId);
      };
    } else {
      setMaintenanceDown(false);
    }
  }, [
    forceMaintenanceDown,
    lastSyncedHeight,
    maintenanceDownBlock,
    network.chainID,
  ]);

  return maintenanceDown ? (
    <Container>
      <div>
        <LogoWheel>
          <Wheel />
          <Logo />
        </LogoWheel>
      </div>
      <h1>Under Maintenance</h1>
      <p>We will be back on Columbus-5 soon.</p>
    </Container>
  ) : (
    children
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;

  display: grid;
  place-content: center;
  text-align: center;

  h1 {
    margin-top: 22px;

    font-size: 24px;
    font-weight: 400;
    letter-spacing: -0.3px;
  }

  p {
    margin-top: 12px;

    font-size: 16px;
    font-weight: 400;
    letter-spacing: -0.3px;
  }
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LogoWheel = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;

  > :nth-child(1) {
    animation: ${rotate} 3s ease-in-out infinite;
  }

  > :nth-child(2) {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;
