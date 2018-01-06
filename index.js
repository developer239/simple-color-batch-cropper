import cv from 'opencv4nodejs';
import { drawSquareAroundCenter } from './utils/draw';
import { findNonZeroMatches } from './utils/search';
import { getMask, getContour, getRegion, getContourCenterPoint } from './utils/image';


const findMatch = async () => {
  const originalMat = await cv.imreadAsync('./images/originalSmall.jpg');
  const originalMatMasked = getMask(originalMat);
  const matches = findNonZeroMatches(originalMatMasked);

  matches.forEach((match) => {
    const matchRegionMat = getRegion(originalMat, match);
    const matchRegionMatMasked = getMask(matchRegionMat);
    const matchContours = getContour(matchRegionMatMasked);
    const contourCenter = getContourCenterPoint(matchContours);
    const matchRegionWithBoundingBox = drawSquareAroundCenter(matchRegionMat, contourCenter);
    cv.imshowWait('Matched!', matchRegionWithBoundingBox);
  });
};

findMatch();
