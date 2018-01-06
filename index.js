import cv from 'opencv4nodejs';
import { drawSquareAroundCenter } from './utils/draw';
import { findMatches as findMatchesInMatrix } from './utils/search';
import { getMask, getContour, getRegion, getContourCenterPoint } from './utils/image';


const UPPER_COLOR = cv.Vec(200, 65, 255);
const LOWER_COLOR = cv.Vec(10, 10, 130);

const findMatches = async () => {
  const originalMat = await cv.imreadAsync('./images/newSmall.jpg');
  const originalMatMasked = getMask(originalMat, LOWER_COLOR, UPPER_COLOR);

  cv.imshowWait('Original matrix', originalMat);
  cv.imshowWait('Masked original matrix', originalMatMasked);

  const matches = findMatchesInMatrix(originalMatMasked);
  console.log('Matches: ', matches);

  matches.forEach((match) => {
    const matchRegionMat = getRegion(originalMat, match);
    const matchRegionMatMasked = getMask(matchRegionMat, LOWER_COLOR, UPPER_COLOR);
    const matchContours = getContour(matchRegionMatMasked);
    const contourCenter = getContourCenterPoint(matchContours);
    const matchRegionWithBoundingBox = drawSquareAroundCenter(matchRegionMat, contourCenter, 16);

    // Draw match on original matrix
    drawSquareAroundCenter(
      originalMat,
      {
        x: contourCenter.x + match.x - 50,
        y: contourCenter.y + match.y - 50,
      },
      16,
      false
    );

    cv.imshowWait('Match region with bounding box', matchRegionWithBoundingBox);
  });
  cv.imshowWait('Original matrix with matches in bounding boxes', originalMat);
};

findMatches();
