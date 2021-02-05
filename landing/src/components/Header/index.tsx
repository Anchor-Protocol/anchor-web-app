import { DesktopHeader } from 'components/Header/DesktopHeader';
import { MobileHeader } from 'components/Header/MobileHeader';
import { useMediaQuery } from 'react-responsive';
import { useRouteMatch } from 'react-router-dom';

export function Header() {
  const match = useRouteMatch({ path: '/', exact: true });

  const isMobile = useMediaQuery({ maxWidth: 700 });

  return isMobile ? (
    <MobileHeader color={!!match ? 'dark' : 'light'} />
  ) : (
    <DesktopHeader color={!!match ? 'dark' : 'light'} />
  );
}
