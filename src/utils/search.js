export const findNonZeroMatches = (matrix, neighbourSize = 20) => {
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

export const findMatches = (matrix, probability = 0.95, neighbourSize = 50) => {
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
