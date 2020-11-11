import React from 'react'

export enum ButtonTypes {
  DEFAULT,
  PRIMARY,
  NEGATIVE,
}

interface ButtonProps {
  type: ButtonTypes
  transactional?: boolean
  disabled?: boolean,
  onClick?: (
    ((ev: React.SyntheticEvent) => Promise<boolean>) |
    ((ev: React.SyntheticEvent) => boolean)
  )
}

const Button: React.FunctionComponent<ButtonProps> = ({
  type,
  onClick,
  transactional = false,
  disabled = false,
  children
}) => {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  )
}

export default Button