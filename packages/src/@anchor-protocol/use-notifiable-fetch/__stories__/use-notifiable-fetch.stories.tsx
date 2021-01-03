import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import {
  Snackbar,
  SnackbarControlRef,
  SnackbarProvider,
  useSnackbar,
} from '@anchor-protocol/snackbar';
import {
  NotifiableFetchProvider,
  useNotifiableFetch,
} from '@anchor-protocol/use-notifiable-fetch';
import { useNotifiableFetchInternal } from '@anchor-protocol/use-notifiable-fetch/NotifiableFetchProvider';
import { SnackbarContent as MuiSnackbarContent } from '@material-ui/core';
import React, {
  cloneElement,
  ComponentType,
  createRef,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';

export default {
  title: 'core/use-notifiable-fetch',
  decorators: [
    (Story: ComponentType) => (
      <NotifiableFetchProvider>
        <SnackbarProvider>
          <Story />
          <SnackbarContainer />
        </SnackbarProvider>
      </NotifiableFetchProvider>
    ),
  ],
};

function ContinuouslyComponent({ onUnmount }: { onUnmount: () => void }) {
  const [fetch, result] = useNotifiableFetch<
    { a: number; b: number },
    { c: number }
  >({
    target: 'continuously',
    fetchFactory: ({ a, b }) => {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ c: a + b }), 3000);
      });
    },
    notificationFactory: (result) => {
      switch (result.status) {
        case 'in-progress':
          return (
            <MuiSnackbarContent
              message={`${result.status} : ${result.params.a} + ${result.params.b} = ?`}
            />
          );
        case 'done':
          return (
            <MuiSnackbarContent
              message={`${result.status} : ${result.params.a} + ${result.params.b} = ${result.data.c}`}
            />
          );
        case 'error':
          return <MuiSnackbarContent message={`${result.status} : Error!!!`} />;
        default:
          return (
            <MuiSnackbarContent
              message={`${result.status} : Unknown case!!!`}
            />
          );
      }
    },
  });

  return (
    <section>
      <nav
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 200px)',
          gridGap: 10,
        }}
      >
        <ActionButton
          style={{ width: 200 }}
          onClick={() => fetch({ a: 1, b: 2 })}
        >
          Fetch
        </ActionButton>

        {result?.status === 'in-progress' && (
          <ActionButton style={{ width: 200 }} onClick={() => onUnmount()}>
            Unmount!
          </ActionButton>
        )}
      </nav>

      <article style={{ padding: 10 }}>
        {result?.status === 'in-progress' ? (
          <div>
            {result.status}: {result.params.a} + {result.params.b} = ?
          </div>
        ) : result?.status === 'done' ? (
          <div>
            {result.status}: {result.params.a} + {result.params.b} ={' '}
            {result.data.c}
          </div>
        ) : result?.status === 'error' ? (
          <div>{result.status}: Error!!!</div>
        ) : null}
      </article>
    </section>
  );
}

export const Target_Continuously = () => {
  const [mount, setMount] = useState(true);

  return (
    <div>
      {mount ? (
        <ContinuouslyComponent
          onUnmount={() => {
            setMount(false);
            setTimeout(() => setMount(true), 4000);
          }}
        />
      ) : (
        <p>Notification will be open by snackbar.</p>
      )}
    </div>
  );
};

export const Target_Notifier = () => {
  const [fetch] = useNotifiableFetch<{ a: number; b: number }, { c: number }>({
    target: 'notifier',
    fetchFactory: ({ a, b }) => {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ c: a + b }), 3000);
      });
    },
    notificationFactory: (result) => {
      switch (result.status) {
        case 'in-progress':
          return (
            <MuiSnackbarContent
              message={`${result.status} : ${result.params.a} + ${result.params.b} = ?`}
            />
          );
        case 'done':
          return (
            <MuiSnackbarContent
              message={`${result.status} : ${result.params.a} + ${result.params.b} = ${result.data.c}`}
            />
          );
        case 'error':
          return <MuiSnackbarContent message={`${result.status} : Error!!!`} />;
        default:
          return (
            <MuiSnackbarContent
              message={`${result.status} : Unknown case!!!`}
            />
          );
      }
    },
  });

  return (
    <div>
      <ActionButton
        style={{ width: 200 }}
        onClick={() => fetch({ a: 1, b: 2 })}
      >
        Fetch
      </ActionButton>
    </div>
  );
};

const SnackbarContainer = styled(({ className }: { className?: string }) => {
  const { addSnackbar, snackbarContainerRef } = useSnackbar();
  const { subscribe } = useNotifiableFetchInternal();

  const controlRefs = useRef<Map<string, RefObject<SnackbarControlRef>>>(
    new Map(),
  );

  useEffect(() => {
    const teardown = subscribe((id, notification) => {
      const controlRef = controlRefs.current.get(id);

      if (controlRef) {
        controlRef.current?.updateContent(
          cloneElement(notification, { key: id }),
        );
      } else {
        const controlRef = createRef<SnackbarControlRef>();

        controlRefs.current.set(id, controlRef);

        addSnackbar(
          <Snackbar
            controlRef={controlRef}
            onClose={() => controlRefs.current.delete(id)}
          >
            {cloneElement(notification, { key: id })}
          </Snackbar>,
        );
      }
    });

    return () => {
      teardown();
    };
  }, [addSnackbar, subscribe]);

  return <div ref={snackbarContainerRef} className={className} />;
})`
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
