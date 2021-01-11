import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import { HorizontalScrollTable } from '@anchor-protocol/neumorphism-ui/components/HorizontalScrollTable';
import { Section } from '@anchor-protocol/neumorphism-ui/components/Section';
import { Error } from '@material-ui/icons';
import { useBorrowDialog } from './useBorrowDialog';
import styled from 'styled-components';

export interface CollateralListProps {
  className?: string;
}

function CollateralListBase({ className }: CollateralListProps) {
  const [openBorrowDialog, borrowDialogElement] = useBorrowDialog();

  return (
    <Section className={`collateral-list ${className}`}>
      <h2>COLLATERAL LIST</h2>

      <HorizontalScrollTable>
        <colgroup>
          <col style={{ width: 300 }} />
          <col style={{ width: 200 }} />
          <col style={{ width: 200 }} />
        </colgroup>
        <thead>
          <tr>
            <th>Name</th>
            <th>Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 3 }, (_, i) => (
            <tr key={'collateral-list' + i}>
              <td>
                <i>
                  <Error />
                </i>
                <div>
                  <div className="coin">bLuna</div>
                  <p className="name">Bonded Luna</p>
                </div>
              </td>
              <td>
                <div className="value">240 UST</div>
                <p className="volatility">200k bLUNA</p>
              </td>
              <td>
                <ActionButton onClick={() => openBorrowDialog({})}>
                  Add
                </ActionButton>
                <ActionButton>Withdraw</ActionButton>
              </td>
            </tr>
          ))}
        </tbody>
      </HorizontalScrollTable>

      {borrowDialogElement}
    </Section>
  );
}

export const CollateralList = styled(CollateralListBase)`
  // TODO
`;
