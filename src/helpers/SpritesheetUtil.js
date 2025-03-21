export const setSpriteSheetFrameUniforms = function (
  uniforms,
  frame,
  numFrames,
  numCols,
  frameBlending,
  blendEase
) {
  if (frameBlending) {
    const cellOffsets = getSpriteSheetBlendedCellOffsets(
      frame,
      numFrames,
      numCols,
      blendEase
    );
    uniforms.cellOffset.value = cellOffsets.cellOffset;
    uniforms.cellOffsetB.value = cellOffsets.cellOffsetB;
    uniforms.cellBlendAmount.value = cellOffsets.cellBlendAmount;
  } else {
    uniforms.cellOffset.value = getSpriteSheetCellOffset(
      frame,
      numFrames,
      numCols
    );
  }
};

export const getSpriteSheetCellOffset = function (frame, numFrames, numCols) {
  frame = Math.floor(frame) % numFrames;
  const cellOffsetX = frame % numCols;
  const cellOffsetY = Math.floor(frame / numCols);
  return [cellOffsetX, cellOffsetY];
};

export const getSpriteSheetBlendedCellOffsets = function (
  frame,
  numFrames,
  numCols,
  blendEase
) {
  const cellOffset = getSpriteSheetCellOffset(frame, numFrames, numCols);
  const cellOffsetB = getSpriteSheetCellOffset(frame + 1, numFrames, numCols);

  let cellBlendAmount = frame - Math.floor(frame);
  if (blendEase) {
    cellBlendAmount = blendEase.getRatio(cellBlendAmount);
  }

  const result = {};
  result.cellOffset = cellOffset;
  result.cellOffsetB = cellOffsetB;
  result.cellBlendAmount = cellBlendAmount;

  return result;
};
