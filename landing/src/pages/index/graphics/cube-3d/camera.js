import { mat4 } from 'gl-matrix';

const cameraConfig = {
  eye: [0, 0, 6],
  target: [0, 0, 0],
  up: [0, 1, 0],
};

const CONFIG = {
  fov: 45,
  near: 0.01,
  far: 1000,
};

export const createCamera = (regl, gui) => {
  if (gui && !gui.__folders['Camera']) {
    const folder = gui.addFolder('Camera');

    folder.add(CONFIG, 'fov', 0, 200);
  }

  return regl({
    context: {
      projection: ({ viewportWidth, viewportHeight }) => {
        //console.log('camera.js..projection()', JSON.stringify(CONFIG));
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
