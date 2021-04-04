import { DesktopHeader } from 'components/Header/DesktopHeader';
import { MobileHeader } from 'components/Header/MobileHeader';
import { useMediaQuery } from 'react-responsive';
import { useRouteMatch } from 'react-router-dom';
import { useTheme } from 'base/contexts/theme';

export function Header() {
  const match = useRouteMatch({ path: '/', exact: true });

  const { themeColor } = useTheme();

  const isMobile = useMediaQuery({ maxWidth: 700 });

  return isMobile ? (
    <MobileHeader color={!!match ? 'dark' : themeColor} />
  ) : (
    <DesktopHeader color={!!match ? 'dark' : themeColor} />
  );
}
