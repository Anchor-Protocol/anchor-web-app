import 'styled-components';
import type { NeumorphismTheme } from '@libs/neumorphism-ui/themes/Theme';

declare module 'styled-components' {
  export interface DefaultTheme extends NeumorphismTheme {}
}
