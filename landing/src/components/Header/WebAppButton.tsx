import { Labtop } from '@anchor-protocol/icons';
import { links } from 'env';
import styled from 'styled-components';

export interface WebAppButtonProps {
  className?: string;
}

function WebAppButtonBase({ className }: WebAppButtonProps) {
  return (
    <a
      className={`webapp ${className}`}
      href={links.app}
      target="anchor-webapp"
    >
      <Labtop /> WebApp
    </a>
  );
}

export const WebAppButton = styled(WebAppButtonBase)`
  display: inline-flex;
  text-decoration: none;
  justify-content: center;
  align-items: center;

  width: 124px;
  height: 36px;
  border-radius: 18px;
  border: 0;
  outline: none;
  cursor: pointer;

  font-size: 11px;
  font-weight: 700;

  svg {
    margin-left: 4px;
    margin-right: 9px;
    font-size: 1em;
    transform: scale(1.8);
  }
`;
