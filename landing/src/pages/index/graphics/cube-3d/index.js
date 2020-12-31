import { mat4 } from 'gl-matrix';
import { createCamera } from './camera';
import { createContent, Types as ContentTypes } from './components/content';
import {
  createCube,
  Faces as CubeFaces,
  Masks as CubeMasks,
  Types as CubeTypes,
} from './components/cube';
import { createReflection } from './components/reflection';
import { createTexture } from './helpers/Texture';

export const animate = (regl, gui, stats) => {
  const CONFIG = {
    cameraX: 0,
    cameraY: 0,
    cameraZ: 5.7,
    rotation: 4.8,
    rotateX: 1,
    rotateY: 1,
    rotateZ: 1,
    velocity: 0.009,
  };

  if (gui) {
    const folder = gui.addFolder('Main');

    folder.add(CONFIG, 'cameraX', -20, 20).step(0.1);
    folder.add(CONFIG, 'cameraY', -20, 20).step(0.1);
    folder.add(CONFIG, 'cameraZ', -20, 20).step(0.1);
    folder.add(CONFIG, 'rotation', -5, 5).step(0.0001);
    folder.add(CONFIG, 'rotateX', 0, 10).step(0.1);
    folder.add(CONFIG, 'rotateY', 0, 10).step(0.1);
    folder.add(CONFIG, 'rotateZ', 0, 10).step(0.1);
    folder.add(CONFIG, 'velocity', 0, 0.05).step(0.0001);
  }

  /**
   * Fbos
   */
  const displacementFbo = regl.framebuffer();
  const maskFbo = regl.framebuffer();
  const contentFbo = regl.framebuffer();
  const reflectionFbo = regl.framebufferCube(1024);

  /**
   * Textures
   */
  const textures = [
    {
      texture: createTexture(regl, require('./assets/logo.png').default),
      typeId: ContentTypes.RAINBOW,
      maskId: CubeMasks.M1,
    },
    {
      texture: createTexture(regl, require('./assets/logo.png').default),
      typeId: ContentTypes.BLUE,
      maskId: CubeMasks.M2,
    },
    {
      texture: createTexture(regl, require('./assets/logo.png').default),
      typeId: ContentTypes.RED,
      maskId: CubeMasks.M3,
    },
    {
      texture: createTexture(regl, require('./assets/text-1.png').default),
      typeId: ContentTypes.BLUE,
      maskId: CubeMasks.M4,
    },
    {
      texture: createTexture(regl, require('./assets/text-2.png').default),
      typeId: ContentTypes.RED,
      maskId: CubeMasks.M5,
    },
  ];

  const content = createContent(regl, gui);
  const reflection = createReflection(regl, gui);
  const camera = createCamera(regl, gui);
  const cube = createCube(regl, gui);

  return ({ viewportWidth, viewportHeight, tick }) => {
    stats?.begin();

    const {
      rotation,
      rotateX,
      rotateY,
      rotateZ,
      velocity,
      cameraX,
      cameraY,
      cameraZ,
    } = CONFIG;

    /**
     * Resize Fbos
     */
    displacementFbo.resize(viewportWidth, viewportHeight);
    maskFbo.resize(viewportWidth, viewportHeight);
    contentFbo.resize(viewportWidth, viewportHeight);

    /**
     * Rotation Matrix
     */
    const factor = tick * velocity;
    const rotationMatrix = mat4.create();

    mat4.rotate(rotationMatrix, rotationMatrix, rotation, [
      rotateX,
      rotateY,
      rotateZ,
    ]);
    mat4.rotate(rotationMatrix, rotationMatrix, factor, [
      Math.cos(factor),
      Math.sin(factor),
      0.5,
    ]);

    /**
     * Camera config
     */
    const cameraConfig = {
      eye: [cameraX, cameraY, cameraZ],
      target: [0, 0, 0],
    };

    /**
     * Clear context
     */
    regl.clear({
      color: [0, 0, 0, 0],
      depth: 1,
    });

    camera(cameraConfig, () => {
      /**
       * Render the displacement into the displacementFbo
       * Render the mask into the displacementFbo
       */
      cube([
        {
          fbo: displacementFbo,
          cullFace: CubeFaces.BACK,
          typeId: CubeTypes.DISPLACEMENT,
          matrix: rotationMatrix,
        },
        {
          fbo: maskFbo,
          cullFace: CubeFaces.BACK,
          typeId: CubeTypes.MASK,
          matrix: rotationMatrix,
        },
      ]);

      /**
       * Render the content to print in the cube
       */
      contentFbo.use(() => {
        content({
          textures,
          displacement: displacementFbo,
          mask: maskFbo,
        });
      });
    });

    /**
     * Render the content reflection
     */
    reflection({
      reflectionFbo,
      cameraConfig,
      rotationMatrix,
      texture: contentFbo,
    });

    camera(cameraConfig, () => {
      /**
       * Render the back face of the cube
       * Render the front face of the cube
       */
      cube([
        {
          cullFace: CubeFaces.FRONT,
          typeId: CubeTypes.FINAL,
          reflection: reflectionFbo,
          matrix: rotationMatrix,
        },
        {
          cullFace: CubeFaces.BACK,
          typeId: CubeTypes.FINAL,
          texture: contentFbo,
          matrix: rotationMatrix,
        },
      ]);
    });

    stats?.end();
  };
};

//export const init = (regl) => {
//  play(regl, animate(regl));
//};
