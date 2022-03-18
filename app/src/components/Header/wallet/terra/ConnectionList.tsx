import React, { Dispatch, SetStateAction } from 'react';
import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { FlatButton } from '@libs/neumorphism-ui/components/FlatButton';
import { IconSpan } from '@libs/neumorphism-ui/components/IconSpan';
import { Tooltip } from '@libs/neumorphism-ui/components/Tooltip';
import { ConnectType, useWallet } from '@terra-money/wallet-provider';
import { ConnectionTypeList } from '../../desktop/ConnectionTypeList';
import { TermsMessage } from '../../desktop/TermsMessage';

interface FooterProps {
  includesReadonly: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const Footer = (props: FooterProps) => {
  const { setOpen, includesReadonly } = props;
  const { connect } = useWallet();
  return (
    <>
      {includesReadonly && (
        <Tooltip
          title="Read-only mode for viewing information. Please connect through Terra Station (extension or mobile) to make transactions."
          placement="bottom"
        >
          <BorderButton
            className="readonly"
            onClick={() => {
              connect(ConnectType.READONLY);
              setOpen(false);
            }}
          >
            View an address
          </BorderButton>
        </Tooltip>
      )}
      <TermsMessage />
    </>
  );
};

interface ConnectionListProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ConnectionList = (props: ConnectionListProps) => {
  const { setOpen } = props;
  const {
    connect,
    availableConnectTypes,
    availableConnections,
    availableInstallations,
  } = useWallet();

  return (
    <ConnectionTypeList
      footer={
        <Footer
          setOpen={setOpen}
          includesReadonly={availableConnectTypes.includes(
            ConnectType.READONLY,
          )}
        />
      }
    >
      {availableConnections
        .filter(({ type }) => type !== ConnectType.READONLY)
        .map(({ type, icon, name, identifier }) => (
          <FlatButton
            key={'connection' + type + identifier}
            className="connect"
            onClick={() => {
              connect(type, identifier);
              setOpen(false);
            }}
          >
            <IconSpan>
              {name}
              <img
                src={
                  icon ===
                  'https://assets.terra.money/icon/station-extension/icon.png'
                    ? 'https://assets.terra.money/icon/wallet-provider/station.svg'
                    : icon
                }
                alt={name}
              />
            </IconSpan>
          </FlatButton>
        ))}

      {availableInstallations
        .filter(({ type }) => type === ConnectType.EXTENSION)
        .map(({ type, identifier, name, icon, url }) => (
          <BorderButton
            key={'installation' + type + identifier}
            className="install"
            component="a"
            href={url}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              setOpen(false);
            }}
          >
            <IconSpan>
              Install {name}
              <img src={icon} alt={`Install ${name}`} />
            </IconSpan>
          </BorderButton>
        ))}
    </ConnectionTypeList>
  );
};

export { ConnectionList };
