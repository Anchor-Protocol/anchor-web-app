import React, {
  Consumer,
  Context,
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface NotificationProviderProps {
  children: ReactNode;
}

export interface NotificationState {
  permission: NotificationPermission;
  create: (
    title: string,
    options?: NotificationOptions,
  ) => Notification | undefined;
}

const NotificationContext: Context<NotificationState> =
  // @ts-ignore
  createContext<NotificationState>();

//firebase.initializeApp(firebaseOptions);

async function getNotificationPermission(): Promise<NotificationPermission> {
  if (
    Notification.permission === 'granted' ||
    Notification.permission === 'denied'
  ) {
    return Notification.permission;
  }

  return Notification.requestPermission();
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [permission, setPermission] =
    useState<NotificationPermission>('default');

  const create = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (permission === 'granted') {
        return new Notification(title, options);
      } else if (permission === 'default') {
        getNotificationPermission().then((nextPermission) => {
          setPermission(nextPermission);
          if (nextPermission === 'granted') {
            return new Notification(title, options);
          }
        });
      }
    },
    [permission],
  );

  useEffect(() => {
    if (!('Notification' in window)) {
      return;
    }

    getNotificationPermission().then((initialPermission) => {
      //console.log('Notification.permission is', initialPermission);
      setPermission(initialPermission);
    });
  }, []);

  const state = useMemo<NotificationState>(
    () => ({
      permission,
      create,
    }),
    [create, permission],
  );

  return (
    <NotificationContext.Provider value={state}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationState {
  return useContext(NotificationContext);
}

export const NotificationConsumer: Consumer<NotificationState> =
  NotificationContext.Consumer;
