import cv from 'opencv4nodejs';
import { findMatches as findMatchesInMatrix } from './utils/search';
import { getMask, getRegionsWithoutMatch } from './utils/image';
import {
  UPPER_COLOR,
  LOWER_COLOR,
  BLUR,
  PATH,
} from './config/range';


const findNegative = async () => {
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

findNegative();
