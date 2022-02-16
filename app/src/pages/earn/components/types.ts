import { UIElementProps } from '@libs/ui';
import type { DialogProps } from '@libs/use-dialog';

export interface FormParams extends UIElementProps, DialogProps<{}, void> {}

export type FormReturn = void;
