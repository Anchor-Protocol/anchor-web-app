# `@libs/snackbar`

TODO

<https://anchor-storybook.vercel.app/?path=/story/core-snackbar--basic>

## API

1. Add the `<SnackbarProvider>` on your top node of App.

```jsx
function App() {
  <SnackbarProvider>{children}</SnackbarProvider>;
}
```

2. Assign the `snackbarContainer` ref object to some `<div>` to use as the snackbar container.

```jsx
function Component({ children }) {
  const { snackbarContainerRef } = useSnackbar();

  return (
    <Container>
      {children}
      <SnackbarContainer ref={snackbarContainerRef} />
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

<!-- source __stories__/*.stories.{ts,tsx} -->

[\_\_stories\_\_/Snackbar.stories.tsx](__stories__/Snackbar.stories.tsx)

```tsx
import {
  IconButton,
  SnackbarContent as MuiSnackbarContent,
  SnackbarContentProps,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import {
  Snackbar,
  SnackbarControl,
  SnackbarProvider,
  useSnackbar,
} from '@libs/snackbar';
import React, { ComponentType, useRef } from 'react';
import styled from 'styled-components';

let count: number = 0;

export default {
  title: 'core/Snackbar',
  decorators: [
    (Story: ComponentType) => (
      <SnackbarProvider>
        <Story />
      </SnackbarProvider>
    ),
  ],
};

export const Basic = () => {
  const { addSnackbar, snackbarContainerRef } = useSnackbar();

  return (
    <div>
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

      <SnackbarContainer ref={snackbarContainerRef} />
    </div>
  );
};

export const CustomElement = () => {
  const { addSnackbar, snackbarContainerRef } = useSnackbar();

  return (
    <div>
      <button
        onClick={() => {
          count++;

          addSnackbar(
            <Snackbar>
              <CustomElementSnackbar>
                {count} HELLO SNACKBAR!
              </CustomElementSnackbar>
            </Snackbar>,
          );
        }}
      >
        Add a Custom Snackbar
      </button>

      <SnackbarContainer ref={snackbarContainerRef} />
    </div>
  );
};

export const Control = () => {
  const { addSnackbar, snackbarContainerRef } = useSnackbar();

  const snackbarControlRef = useRef<SnackbarControl | null>(null);

  return (
    <div>
      <button
        onClick={() => {
          snackbarControlRef.current?.close();

          count++;

          snackbarControlRef.current = addSnackbar(
            <Snackbar autoClose={false}>
              <MuiSnackbarContent message={`${count} HELLO SNACKBAR!`} />
            </Snackbar>,
          );
        }}
      >
        Add a MUI Snackbar
      </button>

      <button
        onClick={() => {
          snackbarControlRef.current?.close();
        }}
      >
        Close Snackbar
      </button>

      <button
        onClick={() => {
          snackbarControlRef.current?.update(
            <Snackbar autoClose={false}>
              <MuiSnackbarContent
                message={`CHANAGED CONTENT! ${Math.floor(
                  Math.random() * 1000,
                )}`}
              />
            </Snackbar>,
          );
        }}
      >
        Update Snackbar content
      </button>

      <SnackbarContainer ref={snackbarContainerRef} />
    </div>
  );
};

const CustomElementSnackbar = styled.div`
  display: inline-block;
  padding: 10px;
  border: 10px solid white;
  font-size: 16px;
  color: red;
`;

export const With_Action = () => {
  const { addSnackbar, snackbarContainerRef } = useSnackbar();

  return (
    <div>
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

      <SnackbarContainer ref={snackbarContainerRef} />
    </div>
  );
};

const ActionSnackbar = styled(
  ({
    close,
    ...props
  }: SnackbarContentProps & {
    close?: () => void;
  }) => {
    return (
      <MuiSnackbarContent
        {...props}
        action={[
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            onClick={close}
          >
            <Close />
          </IconButton>,
        ]}
      />
    );
  },
)``;

export const Prevent_Auto_Close = () => {
  const { addSnackbar, snackbarContainerRef } = useSnackbar();

  return (
    <div>
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

      <SnackbarContainer ref={snackbarContainerRef} />
    </div>
  );
};

const SnackbarContainer = styled.div`
  position: fixed;
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

<!-- /source -->
