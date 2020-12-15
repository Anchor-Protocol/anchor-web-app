interface Options {
  color: string;
  distance: number;
  intensity: number;
}

export function getDarkBox({
  distance,
  intensity,
}: Pick<Options, 'distance' | 'intensity'>): {
  blur: number;
  luminance: number;
} {
  return {
    blur: 10 + 2 * (distance - 5),
    luminance: intensity / 100,
  };
}

export function getLightBox({
  distance,
  intensity,
}: Pick<Options, 'distance' | 'intensity'>): {
  blur: number;
  luminance: number;
} {
  return {
    blur: 10 + 2 * (distance - 5),
    luminance: (intensity / 100) * -1,
  };
}

export function flat({ color, distance, intensity }: Options) {}

export function concave({}: Options) {}

export function convex({}: Options) {}

export function pressed({}: Options) {}
