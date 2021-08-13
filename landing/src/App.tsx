import { GlobalStyle as NeumorphismGlobalStyle } from '@terra-dev/neumorphism-ui/themes/GlobalStyle';
import { GlobalStyle } from 'components/GlobalStyle';
import { Header } from 'components/Header';
import { Index } from 'pages/index';
import React from 'react';

export function App() {
  return (
    <div>
      <NeumorphismGlobalStyle />
      <GlobalStyle />

      <Header />
      <Index />
    </div>
  );
}
