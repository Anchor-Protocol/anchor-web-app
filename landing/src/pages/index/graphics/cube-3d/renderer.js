let tick;

export const play = (regl, action) => {
  if (!tick) {
    tick = regl.frame(action);
  }
};

export const stop = () => {
  if (tick) {
    tick.cancel();
    tick = null;
  }
};
