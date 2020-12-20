import 'styled-components';

declare module 'styled-components' {
  import type { NeumorphismTheme } from '@anchor-protocol/neumorphism-ui/themes/Theme';
  
  export interface DefaultTheme extends NeumorphismTheme {}
}
