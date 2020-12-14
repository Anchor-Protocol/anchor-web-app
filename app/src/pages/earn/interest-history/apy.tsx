import React from 'react';

interface ApyProps {
  apy: number;
}

const Apy: React.FunctionComponent<ApyProps> = ({ children, apy }) => {
  return (
    <div>
      <header>
        <h6>APY</h6>
        <aside>{apy}%/year</aside>
      </header>
      <div>graph</div>
    </div>
  );
};

export default Apy;
