import cv from "opencv4nodejs";


export const drawSquareAroundCenter = (region, center, r = 18) => {
  const x = Math.floor(center.x);
  const y = Math.floor(center.y);

  return region.copy().drawRectangle(
    new cv.Point(x - r, y - r),
    new cv.Point(x + r, y + r),
    new cv.Vec(0, 255, 0),
    cv.LINE_8,
    1
  );
};
