import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    // neumorphism
    intensity: number;

    // colors
    backgroundColor: string;
    textColor: string;
    dimTextColor: string;

    // action buttons
    actionButton: {
      backgroundColor: string;
      textColor: string;
    };
    
    // text input
    textInput: {
      backgroundColor: string;
      textColor: string;
    }
    
    // table
    table: {
      head: {
        textColor: string;
      }
      
      body: {
        textColor: string;
      }
    }
  }
}
