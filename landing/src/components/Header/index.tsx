import { DesktopHeader } from 'components/Header/DesktopHeader';
import { MobileHeader } from 'components/Header/MobileHeader';
import { useMediaQuery } from 'react-responsive';

export function Header() {
  const isMobile = useMediaQuery({ maxWidth: 700 });

  return isMobile ? (
    <MobileHeader color="dark" />
  ) : (
    <DesktopHeader color="dark" />
  );
}
