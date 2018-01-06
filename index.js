import cv from 'opencv4nodejs';
import { drawSquareAroundCenter } from './utils/draw';
import { findNonZeroMatches } from './utils/search';
import { getMask, getContour, getRegion, getContourCenterPoint } from './utils/image';


const UPPER_COLOR = cv.Vec(255, 65, 255);
const LOWER_COLOR = cv.Vec(0, 0, 130);

const findMatches = async () => {
  const originalMat = await cv.imreadAsync('./images/originalSmall.jpg');
  const originalMatMasked = getMask(originalMat, LOWER_COLOR, UPPER_COLOR);
  const matches = findNonZeroMatches(originalMatMasked);

  matches.forEach((match) => {
    const matchRegionMat = getRegion(originalMat, match);
    const matchRegionMatMasked = getMask(matchRegionMat, LOWER_COLOR, UPPER_COLOR);
    const matchContours = getContour(matchRegionMatMasked);
    const contourCenter = getContourCenterPoint(matchContours);
    const matchRegionWithBoundingBox = drawSquareAroundCenter(matchRegionMat, contourCenter);

    // Draw match on original matrix
    drawSquareAroundCenter(
      originalMat,
      {
        x: contourCenter.x + match.x - 50,
        y: contourCenter.y + match.y - 50,
      },
      18,
      false
    );

    cv.imshowWait('Matched!', matchRegionWithBoundingBox);
  });
  cv.imshowWait('Matched!', originalMat);
};

findMatches();
