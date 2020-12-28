import type { ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';

export type DialogProps<P, R> = P & {
  closeDialog: (returnValue: R) => void;
};

export type OpenDialog<P, R> = (p: P) => Promise<R>;

export type DialogTemplate<P = {}, R = void> = (
  props: DialogProps<P, R>,
) => ReactNode;

export function useDialog<P = {}, R = void>(
  dialogTemplate: DialogTemplate<P, R>,
): [OpenDialog<P, R>, ReactNode] {
  const [dialogProps, setDialogProps] = useState<DialogProps<P, R> | null>(
    null,
  );

  const openDialog: OpenDialog<P, R> = useCallback(async (props: P) => {
    return new Promise<R>((resolve) => {
      setDialogProps({
        ...props,
        closeDialog: (returnValue: R) => {
          resolve(returnValue);
          setDialogProps(null);
        },
      });
    });
  }, []);

  const dialog = useMemo<ReactNode>(() => {
    return dialogProps ? dialogTemplate(dialogProps) : null;
  }, [dialogProps, dialogTemplate]);

  return [openDialog, dialog];
}
