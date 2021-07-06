import { GlobalStyle as NeumorphismGlobalStyle } from '@terra-dev/neumorphism-ui/themes/GlobalStyle';
import { Header } from 'components/Header';
import { Index } from 'pages/index';
import React from 'react';
import { GlobalStyle } from './components/GlobalStyle';

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
