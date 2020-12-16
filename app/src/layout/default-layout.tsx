import React from 'react';
import AnchorLogo from './anchor-logo';
import Navigation from './navigation';
import Wallet from '../components/wallet';

import style from './default-layout.module.scss';

interface LayoutProps {
  currentRoute: string;
}

const DefaultLayout: React.FunctionComponent<LayoutProps> = ({
  currentRoute,
  children,
}) => {
  return (
    <div className={style.layout}>
      {/* header */}
      <section className={style.header}>
        <div className={style.ci}>
          <AnchorLogo />
        </div>
        <div className={style.navigation}>
          <Navigation currentRoute={currentRoute} />
          <Wallet />
        </div>
      </section>
      {/* header end */}
      {/* content */}
      <section className={style.content}>{children}</section>
      {/* content end */}
      {/* footer */}
      <section className={style.footer}>-</section>
      {/* footer end */}
    </div>
  );
};

export default DefaultLayout;
