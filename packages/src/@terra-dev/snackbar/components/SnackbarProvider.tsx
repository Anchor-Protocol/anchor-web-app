import React, {
  cloneElement,
  Consumer,
  Context,
  createContext,
  ReactElement,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { MultiTimer } from './MultiTimer';
import { SnackbarProps } from './Snackbar';

export interface SnackbarProviderProps {
  interval?: number;
  children:
    | ReactNode
    | ((props: {
        snackbarContainerRef: RefObject<HTMLDivElement>;
      }) => ReactNode);
}

export interface SnackbarState {
  snackbarContainerRef: RefObject<HTMLDivElement>;
  addSnackbar: (element: ReactElement<SnackbarProps>) => () => void;
  removeAllSnackbars: () => void;
}

// @ts-ignore
const SnackbarContext: Context<SnackbarState> = createContext<SnackbarState>();

let count: number = 0;

export function SnackbarProvider({
  children,
  interval = 100,
}: SnackbarProviderProps) {
  const [timer] = useState<MultiTimer>(() => new MultiTimer(interval));

  const [contents, setContents] = useState<ReactElement<SnackbarProps>[]>([]);

  const snackbarContainerRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(
    null,
  );

  const addSnackbar = useCallback(
    (element: ReactElement<SnackbarProps>) => {
      const primaryId: number = count++;

      const onClose = () => {
        setContents((prevContents) => {
          const index = prevContents.findIndex(
            ({ props }) => props.primaryId === primaryId,
          );

          if (index > -1) {
            const nextContents = [...prevContents];
            nextContents.splice(index, 1);
            return nextContents;
          }

          return prevContents;
        });
      };

      const content = cloneElement(element, {
        key: primaryId,
        primaryId,
        onClose: () => {
          if (typeof element.props.onClose === 'function') {
            element.props.onClose();
          }
          onClose();
        },
        timer,
      });

      setContents((prevContents) => {
        return [...prevContents, content];
      });

      return onClose;
    },
    [timer],
  );

  const removeAllSnackbars = useCallback(() => {
    timer.stopAll();
    setContents([]);
  }, [timer]);

  const state = useMemo<SnackbarState>(() => {
    return {
      snackbarContainerRef,
      addSnackbar,
      removeAllSnackbars,
    };
  }, [addSnackbar, removeAllSnackbars]);

  return (
    <SnackbarContext.Provider value={state}>
      {typeof children === 'function'
        ? children({ snackbarContainerRef })
        : children}
      {contents.length > 0 &&
        snackbarContainerRef.current &&
        createPortal(contents, snackbarContainerRef.current)}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar(): SnackbarState {
  return useContext(SnackbarContext);
}

export const SnackbarConsumer: Consumer<SnackbarState> =
  SnackbarContext.Consumer;
