# `@anchor-protocol/neumorphism-ui`

[Material-UI](https://material-ui.com/) based the neumorphism look implementation components.

<https://anchor-storybook.vercel.app/>

# Setup

## Setup fonts

```css
@font-face {
  font-family: 'Gotham';
  src: url('gotham/xlight/gotham-xlight-webfont.woff2') format('woff2'), url('gotham/xlight/gotham-xlight-webfont.woff')
      format('woff'),
    url('gotham/xlight/gotham-xlight-webfont.ttf') format('truetype');
  font-weight: 200;
  font-style: normal;
}

@font-face {
  font-family: 'Gotham';
  src: url('gotham/light/gotham-light-webfont.woff2') format('woff2'), url('gotham/light/gotham-light-webfont.woff')
      format('woff'),
    url('gotham/light/gotham-light-webfont.ttf') format('truetype');
  font-weight: 300;
  font-style: normal;
}

@font-face {
  font-family: 'Gotham';
  src: url('gotham/book/gotham-book-webfont.woff2') format('woff2'), url('gotham/book/gotham-book-webfont.woff')
      format('woff'),
    url('gotham/book/gotham-book-webfont.ttf') format('truetype');
  font-weight: 500;
  font-style: normal;
}

@font-face {
  font-family: 'Gotham';
  src: url('gotham/bold/gotham-bold-webfont.woff2') format('woff2'), url('gotham/bold/gotham-bold-webfont.woff')
      format('woff'),
    url('gotham/bold/gotham-bold-webfont.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: 'Gotham';
  src: url('gotham/black/gotham-black-webfont.woff2') format('woff2'), url('gotham/black/gotham-black-webfont.woff')
      format('woff'),
    url('gotham/black/gotham-black-webfont.ttf') format('truetype');
  font-weight: 900;
  font-style: normal;
}
```

> If you want to use the other fonts. please use your own customized `<GlobalStyle/>`

## Setup styles and themes

```jsx
import { GlobalStyle } from '@anchor-protocol/neumorphism-ui/themes/GlobalStyle';
import { darkTheme } from '@anchor-protocol/neumorphism-ui/themes/darkTheme';
// import { lightTheme } from '@anchor-protocol/neumorphism-ui/themes/lightTheme';
import { ThemeProvider } from '@anchor-protocol/neumorphism-ui/themes/ThemeProvider';

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
  import type { NeumorphismTheme } from '@anchor-protocol/neumorphism-ui/themes/Theme';

  export interface DefaultTheme extends NeumorphismTheme {}
}
```
