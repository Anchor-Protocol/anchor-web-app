import React from 'react'

interface BoxProps {
  
}

const Box: React.FunctionComponent<BoxProps> = ({
  children,
}) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default Box