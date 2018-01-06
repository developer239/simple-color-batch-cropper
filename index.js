const cv = require('opencv4nodejs');


const findNonZeroMatches = (matrix, neighbourSize = 100) => {
  const matches = [];
  const nonZeroMatches = matrix.findNonZero();

  nonZeroMatches.forEach((nonZeroMatch) => {
    let hasNoNeighbours = true;

    matches.forEach((match) => {
      if (
        nonZeroMatch.x - match.x - neighbourSize < 0
        && nonZeroMatch.y - match.y - neighbourSize < 0
      ) {
        hasNoNeighbours = false;
      }
    });

    if (hasNoNeighbours) {
      matches.push({
        x: nonZeroMatch.x,
        y: nonZeroMatch.y,
      });
    }
  });

  return matches;
};

const findMatches = (matrix, probability = 0.95, neighbourSize = 100) => {
  const matches = [];
  for (let matX = 0; matX < matrix.cols; matX += 1) {
    for (let matY = 0; matY < matrix.rows; matY += 1) {
      // Get raw value at coordinates
      const rawValue = matrix.atRaw(matY, matX);

      if (rawValue >= probability) {
        // By default there are no neighbours
        let hasNoNeighbours = true;

        // Loop through existing matches
        matches.forEach((match) => {
          // If we added neighbour earlier
          if (
            matX - match.x - neighbourSize < 0
            && matY - match.y - neighbourSize < 0
          ) {
            hasNoNeighbours = false;
          }
        });

        // If there are no neighbours add match into matches
        if (hasNoNeighbours) {
          matches.push({
            x: matX,
            y: matY,
          });
        }
      }
    }
  }
  return matches;
};

// TODO: Make sure that you removed noise
const makeMask = (matrix) => {
  // Filter by color
  const colorUpper = cv.Vec(255, 65, 255);
  const colorLower = cv.Vec(0, 0, 130);
  return matrix.inRange(colorLower, colorUpper);
};

const getContour = (mask) => {
  const contours = mask.findContours(
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE
  );
  // largest contour
  return contours.sort((c0, c1) => c1.area - c0.area)[0];
};

function getMaxProperty(arrayOfObjects, property) {
  const arrayOfValues = arrayOfObjects.map(obj => obj[property]);
  return Math.max(...arrayOfValues);
}

function getMinProperty(arrayOfObjects, property) {
  const arrayOfValues = arrayOfObjects.map(obj => obj[property]);
  return Math.min(...arrayOfValues);
}

function lineIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  let ua, ub, denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (denom === 0) {
    return null;
  }
  ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
  ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
  return {
    x: x1 + ua * (x2 - x1),
    y: y1 + ua * (y2 - y1),
    seg1: ua >= 0 && ua <= 1,
    seg2: ub >= 0 && ub <= 1
  };
}

function getMatchRegion(match, matrix) {
  const matchRect = new cv.Rect(
    match.x - 50,
    match.y - 50,
    130,
    130
  );
  return matrix.getRegion(matchRect);
}

function getContourCenterPoint(region) {
  const matchMask = makeMask(region);
  const matchContours = getContour(matchMask);
  const contourPoints = matchContours.getPoints();

  const minX = getMinProperty(contourPoints, 'x');
  const maxX = getMaxProperty(contourPoints, 'x');
  const minY = getMinProperty(contourPoints, 'y');
  const maxY = getMaxProperty(contourPoints, 'y');


  return lineIntersect(minX, minY, maxX, maxY, minX, maxY, maxX, minY);
}

function drawSquareAroundCenter(region, center) {
  const r = 33;
  const rectX = Math.floor(center.x);
  const rectY = Math.floor(center.y);


  return region.copy().drawRectangle(
    new cv.Point(rectX - r, rectY - r),
    new cv.Point(rectX + r, rectY + r),
    new cv.Vec(0, 255, 0),
    cv.LINE_8,
    1
  );
}

const findMatch = async () => {
  // Load images
  const originalMat = await cv.imreadAsync('./templateMatching/originalSmall.jpg');

  // Match template (the brightest locations indicate the highest match)
  const matched = makeMask(originalMat);
  const matches = findNonZeroMatches(matched);
  const matchRegion = getMatchRegion(matches[0], originalMat);
  const contourCenter = getContourCenterPoint(matchRegion);
  const matchRegionWithBoundingBox = drawSquareAroundCenter(matchRegion, contourCenter);
  cv.imshowWait('Matched!', matchRegionWithBoundingBox);
};

console.time('start');
findMatch().then(() => {
  console.timeEnd('start');
});
