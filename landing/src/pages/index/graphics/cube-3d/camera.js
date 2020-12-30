import { mat4 } from 'gl-matrix';
import { gui } from './helpers/gui';

const CONFIG = {
  fov: 45,
  near: 0.01,
  far: 1000,
};

gui.get((gui) => {
  const folder = gui.addFolder('Camera');

  folder.add(CONFIG, 'fov', 0, 200);
});

const cameraConfig = {
  eye: [0, 0, 6],
  target: [0, 0, 0],
  up: [0, 1, 0],
};

export const camera = (regl) => {
  return regl({
    context: {
      projection: ({ viewportWidth, viewportHeight }) => {
        const { fov, near, far } = CONFIG;
        const fovy = (fov * Math.PI) / 180;
        const aspect = viewportWidth / viewportHeight;

        return mat4.perspective([], fovy, aspect, near, far);
      },

      view: (context, props) => {
        const config = Object.assign({}, cameraConfig, props);

        const { eye, target, up } = config;

        return mat4.lookAt([], eye, target, up);
      },

      fov: () => {
        const { fov } = CONFIG;

        return fov;
      },
    },

    uniforms: {
      u_projection: regl.context('projection'),
      u_view: regl.context('view'),
      u_cameraPosition: regl.context('eye'),
      u_resolution: ({ viewportWidth, viewportHeight }) => {
        return [viewportWidth, viewportHeight];
      },
    },
  });
};
