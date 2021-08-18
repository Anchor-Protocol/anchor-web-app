/// <reference types="vite/client" />

declare module '*.svg' {
  import React from 'react';
  const content: string & {
    ReactComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  };
  export = content;
}
