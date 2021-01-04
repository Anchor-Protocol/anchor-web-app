# Install

```sh
npm install @ssen/snackbar
```

# API

1. Add the `<SnackbarProvider>` on your top node of App.

```jsx
function App() {
  <SnackbarProvider>{children}</SnackbarProvider>;
}
```

2. Assign the `snackbarContainer` ref object to some `<div>` to use as the snackbar container.

```jsx
function Component({children}) {
  const {snackbarContainerRef} = useSnackbar();
  
  return (
    <Container>
      {children}
      <SnackbarContainer ref={snackbarContainerRef}/>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 700px;
  height: 400px;
  background-color: #000000;
`;

const SnackbarContainer = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: flex;
  flex-direction: column-reverse;
  justify-content: right;
  align-items: flex-end;

  > * {
    margin-top: 10px;
  }
`;
```

3. You can your `addSnackbar()` function anywhere in the `<SnackbarProvider>`

```jsx
import { SnackbarContent } from '@material-ui/core';

function Component() {
  const { addSnackbar } = useSnackbar();

  const onClick = useCallback(() => {
    addSnackbar(<SnackbarContent message="HELLO SNACKBAR!" />);
  }, [addSnackbar]);

  return <button onClick={onClick}>Open a snackbar</button>;
}
```

# Sample Codes

<!-- import **/*.stories.{ts,tsx} --title-tag h3 -->

### \_\_stories\_\_/Snackbar.stories.tsx

```tsx
import { IconButton, SnackbarContent as MuiSnackbarContent, SnackbarContentProps } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Snackbar, SnackbarProvider, useSnackbar } from '@ssen/snackbar';
import { storiesOf } from '@storybook/react';
import React from 'react';
import styled from 'styled-components';

let count: number = 0;

function Basic() {
  const { addSnackbar, snackbarContainer } = useSnackbar();

  return (
    <Container>
      <button
        onClick={() => {
          count++;

          addSnackbar(
            <Snackbar>
              <MuiSnackbarContent message={`${count} HELLO SNACKBAR!`} />
            </Snackbar>,
          );
        }}
      >
        Add a MUI Snackbar
      </button>

      <button
        onClick={() => {
          count++;

          addSnackbar(
            <Snackbar>
              <CustomElement>{count} HELLO SNACKBAR!</CustomElement>
            </Snackbar>,
          );
        }}
      >
        Add a Custom Snackbar
      </button>

      <button
        onClick={() => {
          count++;

          addSnackbar(
            <Snackbar>
              <ActionSnackbar message={`${count} HELLO SNACKBAR!`} />
            </Snackbar>,
          );
        }}
      >
        Add a Action Snackbar
      </button>

      <button
        onClick={() => {
          count++;

          addSnackbar(
            <Snackbar autoClose={false}>
              <ActionSnackbar message={`${count} HELLO SNACKBAR!`} />
            </Snackbar>,
          );
        }}
      >
        Add a Manual Close Snackbar
      </button>

      <SnackbarContainer ref={snackbarContainer} />
    </Container>
  );
}

storiesOf('<Snackbar>', module)
  .addDecorator((storyFn) => <SnackbarProvider>{storyFn()}</SnackbarProvider>)
  .add('Basic', () => <Basic />);

const Container = styled.div`
  position: relative;
  width: 700px;
  height: 400px;
  background-color: #000000;
`;

const SnackbarContainer = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: flex;
  flex-direction: column-reverse;
  justify-content: right;
  align-items: flex-end;

  > * {
    margin-top: 10px;
  }
`;

const CustomElement = styled.div`
  display: inline-block;
  padding: 10px;
  border: 10px solid white;
  font-size: 16px;
  color: red;
`;

const ActionSnackbar = styled(({ onClose, ...props }: SnackbarContentProps & { onClose?: () => void }) => {
  return (
    <MuiSnackbarContent
      {...props}
      action={[
        <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
          <Close />
        </IconButton>,
      ]}
    />
  );
})``;
```

<!-- importend -->
