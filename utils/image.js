import cv from "opencv4nodejs";
import { getMaxProperty, getMinProperty } from "./array";
import { lineIntersect, positiveNumber } from "./math";


export const getMask = (matrix, colorLower, colorUpper, blur) => {
  const rangeMask = matrix.inRange(colorLower, colorUpper);

  const blurred = rangeMask.blur(new cv.Size(blur, blur));
  return blurred.threshold(
    200,
    255,
    cv.THRESH_BINARY
  );
};

export const getContour = (matrix) => {
  const contours = matrix.findContours(
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE
  );
  // get largest contour
  return contours.sort((c0, c1) => c1.area - c0.area)[0];
};

export const getRegion = (matrix,
                          coordinates,
                          width = 100,
                          height = 100,
                          offsetX,
                          offsetY) => {
  const matchRect = new cv.Rect(
    positiveNumber(coordinates.x + offsetX),
    positiveNumber(coordinates.y + offsetY),
    width,
    height
  );
  return matrix.getRegion(matchRect);
};

export const getContourCenterPoint = (contours) => {
  const contourPoints = contours.getPoints();

  const minX = getMinProperty(contourPoints, 'x');
  const maxX = getMaxProperty(contourPoints, 'x');
  const minY = getMinProperty(contourPoints, 'y');
  const maxY = getMaxProperty(contourPoints, 'y');

  return lineIntersect(minX, minY, maxX, maxY, minX, maxY, maxX, minY);
};
