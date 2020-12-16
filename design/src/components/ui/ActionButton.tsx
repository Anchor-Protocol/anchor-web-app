import React from 'react';
import styled from 'styled-components';

export interface ActionButtonProps {
  className?: string;
}

function ActionButtonBase({ className }: ActionButtonProps) {
  return <div className={className}>...</div>;
}

export const ActionButton = styled(ActionButtonBase)`
  // TODO
`;