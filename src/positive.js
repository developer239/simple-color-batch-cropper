import cv from 'opencv4nodejs';
import { drawSquareAroundCenter } from './utils/draw';
import { findMatches as findMatchesInMatrix } from './utils/search';
import { getMask, getContour, getRegion, getContourCenterPoint } from './utils/image';


// -- APPLE --
// const UPPER_COLOR = cv.Vec(200, 65, 255);
// const LOWER_COLOR = cv.Vec(10, 10, 130);
// const BLUR = 5;
// const OFFSET = -50;
// const REGION_SIZE = 100;
// const PATH = './src/images/withAppleSmall.jpg';

// -- STAR --
// const UPPER_COLOR = cv.Vec(130, 255, 255);
// const LOWER_COLOR = cv.Vec(0, 100, 200);
// const BLUR = 5;
// const OFFSET = -20;
// const REGION_SIZE = 100;
// const PATH = './src/images/withStarSmall.jpg';

// -- Range --
const UPPER_COLOR = cv.Vec(255, 255, 255);
const LOWER_COLOR = cv.Vec(230, 230, 230);
const BLUR = 8;
const OFFSET = -20;
const REGION_SIZE = 100;
const PATH = './src/images/withRangeSmall.jpg';

const findMatches = async () => {
  const originalMat = await cv.imreadAsync(PATH);
  const originalMatMasked = getMask(originalMat, LOWER_COLOR, UPPER_COLOR, BLUR);

  cv.imshowWait('Original matrix', originalMat);
  cv.imshowWait('Masked original matrix', originalMatMasked);

  const matches = findMatchesInMatrix(originalMatMasked);
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

findMatches();
