import cv from 'opencv4nodejs';
import { drawSquareAroundCenter } from './utils/draw';
import { findMatches } from './utils/search';
import { getMask, getContour, getRegion, getContourCenterPoint } from './utils/image';
import {
  UPPER_COLOR,
  LOWER_COLOR,
  BLUR,
  OFFSET,
  REGION_SIZE,
  PATH,
} from './config/range';


const findPositive = async () => {
  const originalMat = await cv.imreadAsync(PATH);
  const originalMatMasked = getMask(originalMat, LOWER_COLOR, UPPER_COLOR, BLUR);

  cv.imshowWait('Original matrix', originalMat);
  cv.imshowWait('Masked original matrix', originalMatMasked);

  const matches = findMatches(originalMatMasked);
  console.log('Matches: ', matches);

  matches.forEach((match) => {
    const matchRegionMat = getRegion(originalMat, match, REGION_SIZE, REGION_SIZE, OFFSET, OFFSET);
    const matchRegionMatMasked = getMask(matchRegionMat, LOWER_COLOR, UPPER_COLOR, BLUR);
    const matchContours = getContour(matchRegionMatMasked);
    const contourCenter = getContourCenterPoint(matchContours);
    const matchRegionWithBoundingBox = drawSquareAroundCenter(matchRegionMat, contourCenter, 16);

    // Draw match on original matrix
    drawSquareAroundCenter(
      originalMat,
      {
        x: contourCenter.x + match.x + OFFSET,
        y: contourCenter.y + match.y + OFFSET,
      },
      16,
      false
    );

    cv.imshowWait('Match region with bounding box', matchRegionWithBoundingBox);
  });
  cv.imshowWait('Original matrix with matches in bounding boxes', originalMat);
};

findPositive();
