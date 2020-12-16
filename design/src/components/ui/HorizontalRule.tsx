import React from 'react';
import styled from 'styled-components';

export interface HorizontalRuleProps {
  className?: string;
}

function HorizontalRuleBase({ className }: HorizontalRuleProps) {
  return <div className={className}>...</div>;
}

export const HorizontalRule = styled(HorizontalRuleBase)`
  // TODO
`;