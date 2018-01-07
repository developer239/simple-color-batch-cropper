# Simple Color Batch cropper

### Installation
```
$ npm yarn install
```

Make sure to have OpenCV 3+ (extra modules are optional) installed on your System https://github.com/opencv/opencv/releases/.

More info can be found here: [opencv4nodejs](https://github.com/justadudewhohacks/opencv4nodejs#how-to-install)

### How to use

* Put images that you want to use in `src/images` folder
* Create config variables in `src/config` folder. Every obect that you want to crop has its own config file. For example config for cropping apples: 
```
export const UPPER_COLOR = new Vec(200, 65, 255) // Upper color range
export const LOWER_COLOR = new Vec(10, 10, 130) // Lower color range
export const BLUR = 5 // Necessary for removing noise from image
export const OFFSET = -50 // Top/left for positive image preview
export const REGION_SIZE = 100 // Positive image preview size
export const PATH = './src/images/withAppleSmall.jpg' // Path to image that will be parsed
```

* Import correct config in `src/positive.js` and `src/negative.js` files
* Run either `yarn positive` or `yarn negative` in order to see result image

### Tips and Tricks

Use space to close image preview.

**Correct color calibration is important.**

**Correct blur settings is important.**
