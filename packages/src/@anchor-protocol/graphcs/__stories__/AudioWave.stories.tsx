import { useEffect, useRef } from 'react';

export default {
  title: 'graphics/AudioWave',
};

export const AudioWave_View = () => {
  return <AudioWave />;
};

function AudioWave() {
  const width = 600 * 2;
  const height = 300 * 2;
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const context = ref.current?.getContext('2d');

    let t = 0;

    function draw() {
      if (!context) return;

      //const x = t;
      //const y = t;

      context.clearRect(0, 0, width, height);

      const xScale = 0.3;

      let i: number = -1;
      const max: number = width / xScale;
      while (i < max) {
        const x = i * xScale;
        const y =
          Math.sin(((i + t) * Math.PI) / 180) * (height / 2) + height / 2;

        context.fillRect(x, y, 10, 10);

        i += 8;
      }

      t += 2;
      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }, [height, width]);

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      style={{
        width: width / devicePixelRatio,
        height: height / devicePixelRatio,
        backgroundColor: 'darkgray',
      }}
    />
  );
}
