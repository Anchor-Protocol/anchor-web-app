import React from 'react';
import { UIElementProps } from '@libs/ui';
import { FlatButton } from '@libs/neumorphism-ui/components/FlatButton';
import { ButtonList } from '../shared';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { ChainListFooter } from './ChainListFooter';
import {
  useDeploymentTarget,
  DEPLOYMENT_TARGETS,
} from '@anchor-protocol/app-provider';
import styled from 'styled-components';

interface ChainListProps extends UIElementProps {
  onClose: () => void;
}

function ChainListBase(props: ChainListProps) {
  const { className, onClose } = props;

  const {
    target: { chain },
    updateTarget,
  } = useDeploymentTarget();

  return (
    <ButtonList
      className={className}
      title="Switch Chain"
      footer={<ChainListFooter />}
    >
      {DEPLOYMENT_TARGETS.filter((target) => target.chain !== chain).map(
        (target) => (
          <FlatButton
            key={target.chain}
            className="button"
            onClick={() => {
              updateTarget(target);
              onClose();
            }}
          >
            <IconSpan>
              {target.chain}
              <img src={target.icon} alt={target.chain} />
            </IconSpan>
          </FlatButton>
        ),
      )}
    </ButtonList>
  );
}

export const ChainList = styled(ChainListBase)`
  .button {
    background-color: ${({ theme }) =>
      theme.palette.type === 'light' ? '#f4f4f5' : '#2a2a46'};
    color: ${({ theme }) => theme.textColor};
  }
`;
