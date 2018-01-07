import cv from 'opencv4nodejs';
import { findMatches as findMatchesInMatrix } from './utils/search';
import { getMask, getRegionsWithoutMatch } from './utils/image';


// -- APPLE --
// const UPPER_COLOR = cv.Vec(200, 65, 255);
// const LOWER_COLOR = cv.Vec(10, 10, 130);
// const BLUR = 5;
// const OFFSET = -50;
// const REGION_SIZE = 100;
// const PATH = './images/withAppleSmall.jpg';

// -- STAR --
// const UPPER_COLOR = cv.Vec(130, 255, 255);
// const LOWER_COLOR = cv.Vec(0, 100, 200);
// const BLUR = 5;
// const OFFSET = -20;
// const REGION_SIZE = 100;
// const PATH = './images/withStarSmall.jpg';

// -- Range --
const UPPER_COLOR = cv.Vec(255, 255, 255);
const LOWER_COLOR = cv.Vec(230, 230, 230);
const BLUR = 8;
const OFFSET = -20;
const REGION_SIZE = 100;
const PATH = './images/withRangeSmall.jpg';

const findMatches = async () => {
  const originalMat = await cv.imreadAsync(PATH);
  const originalMatMasked = getMask(originalMat, LOWER_COLOR, UPPER_COLOR, BLUR);

  cv.imshowWait('Original matrix', originalMat);
  cv.imshowWait('Masked original matrix', originalMatMasked);

  const matches = findMatchesInMatrix(originalMatMasked);
  const generatedRegions = getRegionsWithoutMatch(originalMat, matches);

  generatedRegions.forEach((region, index) => {
    cv.imshowWait(`Generated region ${index + 1}`, region);
  });
};

findMatches();
