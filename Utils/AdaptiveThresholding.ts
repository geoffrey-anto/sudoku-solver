import Image from './Image'

function preCompute(img: Image) {
  const { bytes, width, height } = img
  const res: number[] = new Array(bytes.length)
  let pos: number = 0
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      let total = bytes[pos]
      if (j > 0) total += res[pos - 1]
      if (i > 0) total += res[pos - width]
      if (i > 0 && j > 0) total -= res[pos - width - 1]

      res[pos] = total
      pos++
    }
  }
  return res
}

function getPixelValue(
  img: number[],
  w: number,
  h: number,
  x: number,
  y: number
) {
  if (x < 0) x = 0
  else if (x >= w) x = w - 1

  if (y < 0) y = 0
  else if (y >= h) y = h - 1

  return img[x + y * w]
}

function boxBlur(img: Image, boxSize: number[]) {
  const boxw: number = boxSize[0]
  const boxh: number = boxSize[1]
  const array: number[] = preCompute(img)

  const { bytes, width, height } = img
  let pos = 0
  const avg_value: number = 1.0 / ((boxw * 2 + 1) * (boxh * 2 + 1))
  const res: Uint8ClampedArray = new Uint8ClampedArray(width * height)
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const total =
        getPixelValue(array, width, height, j + boxw, i + boxh) +
        getPixelValue(array, width, height, boxw - j, boxh - i) +
        getPixelValue(array, width, height, boxw - j, boxh + i) +
        getPixelValue(array, width, height, boxw + j, boxh - i)
      res[pos] = total * (avg_value * 2.5)
      pos++
    }
  }
  return new Image(res, width, height)
}

export default function adaptiveThreshold(
  img: Image,
  threshold: number,
  boxSize: number
) {
  const { bytes, width, height } = img
  const blurredImage = boxBlur(img, [boxSize, boxSize])
  const blurredImageBytes = blurredImage.bytes
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (
        blurredImageBytes[i * width + j] - bytes[i * width + width + j] >
        threshold
      ) {
        bytes[i * width + width + j] = 255
      } else {
        bytes[i * width + width + j] = 0;
      }
    }
  }
  return img;
}
