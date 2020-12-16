import React from 'react';
import style from './button.module.scss';

export enum ButtonTypes {
  DEFAULT,
  PRIMARY,
  NEGATIVE,
}

interface ButtonProps {
  type: ButtonTypes;
  transactional?: boolean;
  disabled?: boolean;
  onClick?:
    | ((ev: React.SyntheticEvent) => Promise<boolean>)
    | ((ev: React.SyntheticEvent) => boolean)
    | ((ev: React.SyntheticEvent) => void);
}

const Button: React.FunctionComponent<ButtonProps> = ({
  type,
  onClick,
  transactional = false,
  disabled = false,
  children,
}) => {
  return (
    <button className={style.button} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
