import { GUI } from 'dat.gui';

function createGui() {
  if (process.env.NODE_ENV === 'development') {
    const gui = new GUI({ width: 300 });

    return {
      get: (callback: (gui: GUI) => void) => {
        setTimeout(() => {
          return callback(gui);
        });
      },
    };
  }

  return {
    get: () => {},
  };
}

export const gui = createGui();
