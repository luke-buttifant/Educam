const drawMask = (
  ctx,
  keypoints,
  distance
) => {
  const points = [
    93,
    132,
    58,
    172,
    136,
    150,
    149,
    176,
    148,
    152,
    377,
    400,
    378,
    379,
    365,
    397,
    288,
    361,
    323,
  ];

  ctx.moveTo(keypoints[195][0], keypoints[195][1]);
  for (let i = 0; i < points.length; i++) {
    if (i < points.length / 2) {
      ctx.lineTo(
        keypoints[points[i]].x - distance,
        keypoints[points[i]].y + distance
      );
    } else {
      ctx.lineTo(
        keypoints[points[i]].x + distance,
        keypoints[points[i]].y + distance
      );
    }
  }
};

const viewerDraw = (
  predictions,
  ctx,
  width,
  height,
  colour
) => {
  if (predictions.length > 0) {
    predictions.forEach((prediction) => {
      const keypoints = prediction.keypoints;
      const boundingBox = prediction.box;
      const bottomRight = [boundingBox.xMax, boundingBox.yMax];
      const topLeft = [boundingBox.xMin, boundingBox.yMin];
      // make the drawing mask larger a bit
      const distance =
        Math.sqrt(
          Math.pow(bottomRight[0] - topLeft[0], 2) +
            Math.pow(topLeft[1] - topLeft[1], 2)
        ) * 0.02;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = colour;
      ctx.save();
      ctx.beginPath();
      drawMask(ctx, keypoints, distance);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });
  }
};

export default viewerDraw