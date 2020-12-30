import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import style from './selection.module.scss';

interface BassetSelectionProps {}

/** @deprecated */
const BassetSelection: React.FunctionComponent<BassetSelectionProps> = () => {
  const location = useLocation();

  return (
    <nav className={style['basset-selection']}>
      <Link
        to="/basset/mint"
        className={highlightActive('/basset/mint', location.pathname)}
      >
        Mint
      </Link>
      <Link
        to="/basset/burn"
        className={highlightActive('/basset/burn', location.pathname)}
      >
        Burn
      </Link>
      <Link
        to="/basset/claim"
        className={highlightActive('/basset/claim', location.pathname)}
      >
        Claim
      </Link>
    </nav>
  );
};

function highlightActive(
  currentPath: string,
  path: string,
): string | undefined {
  return path === currentPath ? style.active : undefined;
}

export default BassetSelection;
