import 'styled-components';
import type { NeumorphismTheme } from '@terra-dev/neumorphism-ui/themes/Theme';

declare module 'styled-components' {
  export interface DefaultTheme extends NeumorphismTheme {}
}
