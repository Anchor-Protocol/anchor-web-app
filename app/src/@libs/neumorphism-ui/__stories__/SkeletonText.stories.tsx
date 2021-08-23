import { SkeletonText } from '@libs/neumorphism-ui/components/SkeletonText';
import React from 'react';

export default {
  title: 'components/SkeletonText',
};

export const Basic = () => {
  return (
    <section>
      <h1 style={{ color: 'white' }}>
        <SkeletonText>AAAAAA</SkeletonText>
      </h1>
      <p style={{ color: 'white' }}>
        <SkeletonText>AAAAAAAAAAAAAAA</SkeletonText>
      </p>
    </section>
  );
};
