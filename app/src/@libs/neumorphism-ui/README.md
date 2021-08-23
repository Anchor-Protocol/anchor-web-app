# `@libs/neumorphism-ui`

[Material-UI](https://material-ui.com/) based the neumorphism look implementation components.

<https://anchor-storybook.vercel.app/>

## Setup styles and themes

```jsx
import { GlobalStyle } from '@libs/neumorphism-ui/themes/GlobalStyle';
import { darkTheme } from '@libs/neumorphism-ui/themes/darkTheme';
// import { lightTheme } from '@libs/neumorphism-ui/themes/lightTheme';
import { ThemeProvider } from '@libs/neumorphism-ui/themes/ThemeProvider';

function App() {
  <ThemeProvider theme={darkTheme}>
    <YOUR_APP />
  </ThemeProvider>;
}

ReactDOM.render(
  <>
    <GlobalStyle />
    <App />
  </>,
  document.getElementById('root'),
);
```

## Setup TypeScript declarations

Create a `.d.ts` file (e.g. `styled.d.ts`) in your `/src` directory.

```ts
import 'styled-components';

declare module 'styled-components' {
  import type { NeumorphismTheme } from '@libs/neumorphism-ui/themes/Theme';

  export interface DefaultTheme extends NeumorphismTheme {}
}
```
