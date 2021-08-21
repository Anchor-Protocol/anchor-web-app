import 'styled-components';
import type { NeumorphismTheme } from '@packages/neumorphism-ui/themes/Theme';

declare module 'styled-components' {
  export interface DefaultTheme extends NeumorphismTheme {}
}
