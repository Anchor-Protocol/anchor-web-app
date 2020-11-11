import React from 'react'

type PopupClose = () => void
interface PopupContainerProps {
  children: (close: PopupClose) => React.ReactElement
  onClose: () => void
}

export interface PopupChild {
  close: PopupClose
}

const PopupContainer: React.FunctionComponent<PopupContainerProps> = ({
  children,
  onClose,
}) => {
  return (
    <div>
      {children(onClose)}
    </div>
  )
}

export default PopupContainer