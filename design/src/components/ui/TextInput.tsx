import React from 'react';
import styled from 'styled-components';

export interface TextInputProps {
  className?: string;
}

function TextInputBase({ className }: TextInputProps) {
  return <div className={className}>...</div>;
}

export const TextInput = styled(TextInputBase)`
  // TODO
`;