import { AccountBalanceWallet } from '@material-ui/icons';
import styled from 'styled-components';

export interface ViewAddressButtonProps {
  className?: string;
  onClick: () => void;
}

function ViewAddressButtonBase({ className, onClick }: ViewAddressButtonProps) {
  return (
    <button className={className} onClick={onClick}>
      <AccountBalanceWallet /> View an address
    </button>
  );
}

export const ViewAddressButton = styled(ViewAddressButtonBase)`
  display: inline-flex;
  text-decoration: none;
  justify-content: center;
  align-items: center;

  width: 180px;
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
