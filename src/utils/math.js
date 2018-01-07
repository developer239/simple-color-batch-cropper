import { getMaxProperty, getMinProperty } from './array'


export const lineIntersect = (x1, y1, x2, y2, x3, y3, x4, y4) => {
  let ua, ub,
    denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)
  if (denom === 0) {
    return null
  }
  ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom
  ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom
  return {
    x: x1 + ua * (x2 - x1),
    y: y1 + ua * (y2 - y1),
    seg1: ua >= 0 && ua <= 1,
    seg2: ub >= 0 && ub <= 1,
  }
}

export const positiveNumber = number => Math.max(0, number)

export const randomNumberBetween = (min, max) => Math.floor(min + Math.random() * (max + 1 - min))

/**
 * This thing is little bit too complicated.
 *
 * THIS IS CARTESIAN SYSTEM. WE HAVE TO DE/NORMALIZE VALUES.
 *
 * Matrix uses rows and cols.
 * This function uses x/y. (y is inverse)
 *
 * We want:
 * - generate random {x, y}
 * - generate random {height, width}
 * - we don't want that region to contain any matches
 *
 * What do we do:
 * - define minimum size
 * - define offset (so that we don't crop part of the match near border of the returned region)
 * - define border offset (so that we don't crop too close to the border)
 * - generate random {x, y}
 * - generate random {targetHeight, targetWidth}
 * - check if there are any matches
 * -- if there are matches then filter those matches and keep only matches
 * ---- that are in bottom right section of the cartesian system
 * --- find out how near matches are
 * --- if there is a match closer than target width/height and if it is not too close
 * ---- (if the difference is lower than minimum size) then change target width/height to the
 * ---- difference between x/y and closest x/y
 * -- if there are no matches
 * --- check if bottom/right border is closer than target width/height and if it is not too close
 * --- (if the difference is lower than minimum size) then change target width/height to the
 * --- difference between x/y and closest right/bottom border
 *
 * -- if close matches or close border is too close (if the difference is lower than minimum size)
 * --- generate new x, y
 *
 * -- we want to return square image so when we calculate target width/height
 * --- we choose the lower value and return it as width and height
 */
export const calculateTargetWidthHeight = (matrix, matches, opts = {}) => {
  let shouldGenerateRegion = true

  const matrixWidth = matrix.cols
  const matrixHeight = matrix.rows
  const minSize = opts.minSize ? opts.minSize : 100
  const offset = opts.offset ? opts.offset : 25

  // We have to normalize y value because matrix uses rows and cols and this
  // function uses cartesian system
  // x is same
  // y is inverse
  const normalizedMatches = matches.map(match => ({
    x: match.x,
    y: matrixHeight - match.y,
  }))

  const randomWidth = randomNumberBetween(minSize, minSize + 200)
  const randomHeight = randomNumberBetween(minSize, minSize + 200)

  let targetWidth = randomWidth
  let targetHeight = randomHeight

  const randomX = randomNumberBetween(1, matrixWidth)
  const randomY = randomNumberBetween(1, matrixHeight)

  const bottomRightMatches = normalizedMatches
    .filter(match => match.x + offset > randomX && match.y - offset < randomY)

  if (bottomRightMatches.length) {
    const closestX = getMinProperty(bottomRightMatches, 'x')
    const closestY = getMaxProperty(bottomRightMatches, 'y')

    const differenceClosestX = closestX - offset - randomX
    // If x too close
    if (closestX > randomX || differenceClosestX - targetWidth < 0) {
      // If x too close we are able to generate min sized region
      if (differenceClosestX > minSize) {
        targetWidth = differenceClosestX
      } else {
        targetHeight = 0
        targetWidth = 0
        shouldGenerateRegion = false
      }
    }

    const differenceClosestY = randomY - offset - closestY
    // If y too close
    if (closestY < randomY || differenceClosestY - targetHeight < 0) {
      // If x too close we are able to generate min sized region
      if (differenceClosestY > minSize) {
        targetHeight = differenceClosestY
      } else {
        targetHeight = 0
        targetWidth = 0
        shouldGenerateRegion = false
      }
    }
  } else {
    const differenceFromTop = matrixHeight - randomY
    const differenceFromLeft = randomX
    const offsetFromBorder = 10

    // id too close to right border
    if (matrixWidth - differenceFromLeft - targetWidth < 0) {
      // If too close but we are able to generate min sized region
      if (matrixWidth - differenceFromLeft - offsetFromBorder > minSize) {
        targetWidth = matrixWidth - differenceFromLeft - offsetFromBorder
      } else {
        targetHeight = 0
        targetWidth = 0
        shouldGenerateRegion = false
      }
    }

    // id too close to bottom border
    if (matrixHeight - differenceFromTop - targetHeight < 0) {
      // If too close but we are able to generate min sized region
      if (matrixHeight - differenceFromTop - offsetFromBorder > minSize) {
        targetHeight = matrixHeight - differenceFromTop - offsetFromBorder
      } else {
        targetHeight = 0
        targetWidth = 0
        shouldGenerateRegion = false
      }
    }
  }


  // Make it square
  const finalSize = targetWidth < targetHeight ? targetWidth : targetHeight

  return {
    shouldGenerateRegion,
    x: randomX,
    y: matrixHeight - randomY, // !! De-normalize y value !!
    targetHeight: finalSize,
    targetWidth: finalSize,
  }
}
