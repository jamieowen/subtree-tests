export const flatten = (arr, depth = 1) =>
  arr.reduce(
    (a, v) =>
      a.concat(depth > 1 && Array.isArray(v) ? flatten(v, depth - 1) : v),
    []
  );

export const mergeSpritesheets = (data) => {
  const merged = flatten(
    (Array.isArray(data) ? data : [data]).map((data) => {
      const { texture, json } = data;
      const frames = Object.entries(json.frames);

      return frames.map((frame) => {
        return {
          atlas: texture,
          atlasData: json,
          id: frame[0],
          frame: frame[1].frame,
          spriteSourceSize: frame[1].spriteSourceSize,
          sourceSize: frame[1].sourceSize,
          size: json.meta.size,
        };
      });
    }),
    1
  );

  if (Array.isArray(data) && data.length > 1) {
    return merged.sort((a, b) => a.id.localeCompare(b.id));
  }

  return merged;
};
