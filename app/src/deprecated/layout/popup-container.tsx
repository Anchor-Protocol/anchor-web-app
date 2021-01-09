import React from 'react';
import style from 'deprecated/layout/popup-container.module.scss';

type PopupClose = () => void;
interface PopupContainerProps {
  render: (close: PopupClose) => React.ReactElement;
  onClose: () => void;
}

export interface PopupChild {
  close: PopupClose;
}

const PopupContainer: React.FunctionComponent<PopupContainerProps> = ({
  render,
  onClose,
}) => {
  return (
    <div className={style['popup-container']}>
      <div>
        <div>
          <header>
            <button onClick={() => onClose()}>close</button>
          </header>
          <article>{render(onClose)}</article>
        </div>
      </div>
    </div>
  );
};

export default PopupContainer;
