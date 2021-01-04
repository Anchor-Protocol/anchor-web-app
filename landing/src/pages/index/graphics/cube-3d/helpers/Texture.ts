import { Regl, Texture2D } from 'regl';

export const createTexture = (regl: Regl, src: string) => {
  const texture: Texture2D = regl.texture();

  const image = new Image();

  image.src = src;

  image.onload = () => {
    texture({
      data: image,
      flipY: true,
      min: 'mipmap',
    });
  };

  return texture;
};
