import styled, { keyframes } from 'styled-components';

const enter = keyframes`
  0% {
    opacity: 0.1;
    transform: scale(0.4);
  }
  
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

export const FloatingContainer = styled.ul`
  position: fixed;
  right: 1em;
  bottom: 1em;

  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1em;

  li {
    min-width: 300px;
    border: 5px solid deepskyblue;
    padding: 1em;
    
    animation: ${enter} 0.5s ease-in-out;
  }
`;
