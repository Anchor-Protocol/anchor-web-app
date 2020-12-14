import React from 'react';
import { Link } from 'react-router-dom';
import style from './navigation.module.css';

interface NavigationProps {
  currentRoute: string;
}

const Navigation: React.FunctionComponent<NavigationProps> = ({
  currentRoute,
}) => {
  return (
    <nav className={style.navigation}>
      <Link to="/earn" className={highlightCurrentRoute('/earn', currentRoute)}>
        Earn
      </Link>
      <Link
        to="/borrow"
        className={highlightCurrentRoute('/borrow', currentRoute)}
      >
        Borrow
      </Link>
      <Link
        to="/basset/mint"
        className={highlightCurrentRoute('/basset', currentRoute)}
      >
        bAsset
      </Link>
    </nav>
  );
};

function highlightCurrentRoute(
  route: string,
  currentRoute: string,
): string | undefined {
  return route === currentRoute ? style.active : undefined;
}

export default Navigation;
