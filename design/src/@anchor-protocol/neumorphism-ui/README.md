# Setup

## Setup Styles

```jsx
import { GlobalStyle } from '@anchor-protocol/neumorphism-ui/themes/GlobalStyle';
import { darkTheme } from '@anchor-protocol/neumorphism-ui/themes/darkTheme';
// import { lightTheme } from '@anchor-protocol/neumorphism-ui/themes/lightTheme';
import { ThemeProvider } from '@anchor-protocol/neumorphism-ui/themes/ThemeProvider';

function App() {
  <ThemeProvider theme={darkTheme}>
    <YOUR_APP/>
  </ThemeProvider>
}

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
```

## Setup TypeScript Declarations

```ts
import 'styled-components';

declare module 'styled-components' {
  import type { NeumorphismTheme } from '@anchor-protocol/neumorphism-ui/themes/Theme';
  
  export interface DefaultTheme extends NeumorphismTheme {}
}
```