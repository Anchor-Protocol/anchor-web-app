import type { ComponentType, ReactNode } from 'react';
import { createElement, useCallback, useMemo, useState } from 'react';

export type DialogProps<Param, Return> = Param & {
  closeDialog: (returnValue: Return) => void;
};

export type OpenDialog<Param, Return> = (p: Param) => Promise<Return>;

export function useDialog<Param = {}, Return = void>(
  DialogComponent: ComponentType<DialogProps<Param, Return>>,
): [
  OpenDialog<Param extends DialogProps<infer P, any> ? P : Param, Return>,
  ReactNode,
] {
  const [dialogProps, setDialogProps] = useState<DialogProps<
    Param,
    Return
  > | null>(null);

  const openDialog: OpenDialog<any, Return> = useCallback(
    async (props: Param) => {
      return new Promise<Return>((resolve) => {
        setDialogProps({
          ...props,
          closeDialog: (returnValue: Return) => {
            resolve(returnValue);
            setDialogProps(null);
          },
        });
      });
    },
    [],
  );

  const dialog = useMemo<ReactNode>(() => {
    return dialogProps ? createElement(DialogComponent, dialogProps) : null;
  }, [DialogComponent, dialogProps]);

  return [openDialog, dialog];
}
