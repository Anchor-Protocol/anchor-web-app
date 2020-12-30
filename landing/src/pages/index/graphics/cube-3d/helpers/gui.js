import * as dat from 'dat.gui';

function createGui() {
  if (process.env.NODE_ENV === 'development') {
    const gui = new dat.GUI({ width: 300 });

    return {
      get: (callback) => {
        setTimeout(() => {
          return gui;
        });
      },
    };
  }

  return {
    get: () => {},
  };
}

export const gui = createGui();
