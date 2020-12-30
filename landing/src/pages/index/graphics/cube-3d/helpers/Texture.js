export default (regl, src) => {
  const texture = regl.texture();
  
  const image = new Image();
  
  image.src = `${src}`;
  
  image.onload = function () {
    texture({
      data: image,
      flipY: true,
      min: 'mipmap',
    });
  };
  
  return texture;
}
