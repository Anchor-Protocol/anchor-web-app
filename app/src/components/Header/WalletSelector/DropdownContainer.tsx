import styled from 'styled-components';

export const DropdownContainer = styled.div`
  position: absolute;
  display: block;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;

  min-width: 260px;

  border: 1px solid ${({ theme }) => theme.highlightBackgroundColor};
  background-color: ${({ theme }) => theme.highlightBackgroundColor};
  box-shadow: 0 0 21px 4px rgba(0, 0, 0, 0.3);
  border-radius: 15px;

  button {
    cursor: pointer;
  }
`;
