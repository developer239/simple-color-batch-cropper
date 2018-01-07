# Simple Color Batch cropper

### Installation
```
$ yarn install
```

Make sure to have OpenCV 3+ (extra modules are optional) installed on your System https://github.com/opencv/opencv/releases/.

More information can be found here: [opencv4nodejs](https://github.com/justadudewhohacks/opencv4nodejs#how-to-install)

### What does it do

#### Positive images

1) When you need to generate large amount of positive samples of all _shooting targets_ automatically
![1](https://github.com/developer239/simple-color-batch-cropper/blob/master/documentation/images/1.png?raw=true)
2) This script will generate binary image
![2](https://github.com/developer239/simple-color-batch-cropper/blob/master/documentation/images/2.png?raw=true)
3) Then it will find shooting target for you
![3](https://github.com/developer239/simple-color-batch-cropper/blob/master/documentation/images/3.png?raw=true)
4) Then it will draw bounding box around the target
![4](https://github.com/developer239/simple-color-batch-cropper/blob/master/documentation/images/4.png?raw=true)

#### Negative images

`src/negative.js` will crop random locations from the original image so that none of the locations contain matches that you found using the `src/positive.js` file. This is useful when you want to generate large number of negative samples.

### How to use

* Put images that you want to use in `src/images` folder
* Create config variables in `src/config` folder. Every obect that you want to crop has its own config file. For example config for cropping apples: 
```
export const UPPER_COLOR = new Vec(200, 65, 255) // Upper color range !! IMPORTANT
export const LOWER_COLOR = new Vec(10, 10, 130) // Lower color range !! IMPORTANT
export const BLUR = 5 // Necessary for removing noise from image !! IMPORTANT
export const OFFSET = -50 // Top/left for positive image preview
export const REGION_SIZE = 100 // Positive image preview size
export const PATH = './src/images/withAppleSmall.jpg' // Path to image that will be parsed
```

* Import correct config in `src/positive.js` and `src/negative.js` files
* Run either `yarn positive` or `yarn negative` in order to see result image

### Todo

- [ ] Read multiple images from folder and save generate results into output folder
