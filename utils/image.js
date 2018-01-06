import cv from "opencv4nodejs";
import { getMaxProperty, getMinProperty } from "./array";
import { lineIntersect } from "./math";


export const getMask = (matrix) => {
  const colorUpper = cv.Vec(255, 65, 255);
  const colorLower = cv.Vec(0, 0, 130);
  return matrix.inRange(colorLower, colorUpper);
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
                          offsetX = -50,
                          offsetY = -50) => {
  const matchRect = new cv.Rect(
    coordinates.x + offsetX,
    coordinates.y + offsetY,
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
