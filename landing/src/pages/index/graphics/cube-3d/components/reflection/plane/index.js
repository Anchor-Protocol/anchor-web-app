import { mat4 } from 'gl-matrix';
import { positions } from './config';
import frag from './shader.frag';
import vert from './shader.vert';

export const createPlane = (regl) => {
  return regl({
    vert,
    frag,
    attributes: {
      a_position: positions,
    },
    context: {
      world: (context, { uvRotation }) => {
        const world = mat4.create();

        mat4.rotate(world, world, uvRotation, [0, 0, 1]);

        return world;
      },
    },
    uniforms: {
      u_world: regl.context('world'),
      u_texture: regl.prop('texture'),
      u_textureMatrix: regl.prop('textureMatrix'),
    },
    count: 6,
  });
};
