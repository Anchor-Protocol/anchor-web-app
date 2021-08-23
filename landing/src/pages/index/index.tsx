import { auditMeasure } from '@libs/audit-fastdom';
import { isTouchDevice } from '@libs/is-touch-device';
import { landingMobileLayout } from 'env';
import { FrictionlessAcess } from 'pages/index/components/FrictionlessAcess';
import { Subscribe } from 'pages/index/components/Subscribe';
import { useEffect, useMemo, useRef } from 'react';
import SmoothScroll from 'smooth-scroll';
import styled from 'styled-components';
import { BetterSavings } from './components/BetterSavings';
import { BetterYield } from './components/BetterYield';
import { EasierIntegrations } from './components/EasierIntegrations';

export interface IndexProps {
  className?: string;
}

const ANIMATION_OFFSET = 1000;

function IndexBase({ className }: IndexProps) {
  const scrollTarget = useRef<HTMLDivElement>(null);
  const scroll = useMemo(() => new SmoothScroll(), []);

  useEffect(() => {
    let inScroll = false;

    function endPaging(event: WheelEvent) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      if (event.deltaY >= 1 && !inScroll) {
        inScroll = true;
        if (process.env.NODE_ENV === 'development') {
          console.log('SCROLL TO NEXT PAGE!');
        }

        scroll.animateScroll(scrollTarget.current, undefined, {
          easing: 'easeInOutCubic',
        });

        setTimeout(() => {
          if (process.env.NODE_ENV === 'development') {
            console.log('END PAGING!');
          }
          window.removeEventListener('wheel', endPaging);
          inScroll = false;
        }, ANIMATION_OFFSET);
      }
    }

    const startPaging = auditMeasure(() => {
      const scrollY = window.scrollY;

      if (scrollY === 0) {
        if (process.env.NODE_ENV === 'development') {
          console.log('START PAGING!');
        }
        window.addEventListener('wheel', endPaging, { passive: false });
      }
    });

    if (!isTouchDevice()) {
      window.addEventListener('scroll', startPaging);
      startPaging();
    }

    return () => {
      window.removeEventListener('scroll', startPaging);
      window.removeEventListener('wheel', endPaging);
    };
  }, [scroll]);

  return (
    <div className={className}>
      <BetterSavings disable3D={process.env.NODE_ENV === 'development'} />
      <ResponsiveContainer ref={scrollTarget}>
        <BetterYield />
        <EasierIntegrations />
        <FrictionlessAcess />
        <Subscribe />
      </ResponsiveContainer>
    </div>
  );
}

export const ResponsiveContainer = styled.div`
  width: 100%;
  min-width: 0;

  background-color: #ffffff;
  padding: 60px 40px;

  > :not(:last-child) {
    margin-bottom: 60px;
  }

  @media (max-width: ${landingMobileLayout}px) {
    padding: 0;

    > :not(:last-child) {
      margin-bottom: 0;
    }
  }
`;

export const Index = styled(IndexBase)`
  background-color: #000000;
  color: #ffffff;

  font-size: 60px;

  display: grid;
  place-items: center;
`;
