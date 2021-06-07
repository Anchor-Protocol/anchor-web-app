import React, {
  createContext,
  useContext,
  Context,
  Consumer,
  ReactNode,
} from 'react';

export interface NotificationProviderProps {
  children: ReactNode;
}

export interface Notification {}

// @ts-ignore
const NotificationContext: Context<Notification> =
  createContext<Notification>();

export function NotificationProvider({ children }: NotificationProviderProps) {
  return (
    <NotificationContext.Provider value={{}}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification(): Notification {
  return useContext(NotificationContext);
}

export const NotificationConsumer: Consumer<Notification> =
  NotificationContext.Consumer;
