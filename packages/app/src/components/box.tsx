import React from 'react'
import style from './box.module.css'

interface BoxProps {
  
}

const Box: React.FunctionComponent<BoxProps> = ({
  children,
}) => {
  return (
    <div className={style.box}>
      {children}
    </div>
  )
}

export default Box