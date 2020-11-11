import React from 'react'

interface InputProps {
  textLeft?: string
  textRight?: string
  disabled?: boolean
  onChange?: (nextValue: string) => void
  validation?: (input: string) => boolean | string // self-correcting if non-boolean is returned
}

const Input: React.FunctionComponent<InputProps> = ({
  textLeft,
  textRight,
  disabled = false,
}) => {
  return (
    <div>
      <aside>{textLeft}</aside>
      <input />
      <aside>{textRight}</aside>
    </div>
  )
}

export default Input