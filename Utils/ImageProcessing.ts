import Image from './Image'

const readImage = (video: HTMLVideoElement) => {
  const width = video.width;
  const height = video.height;
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  let data: ImageData | undefined = undefined
  if (ctx) {
    ctx.drawImage(video, 0, 0, width, height)
    data = ctx.getImageData(0, 0, width, height)
  }
  const bytes = new Uint8ClampedArray(width * height)

  if (typeof data !== 'undefined') {
    // console.log(data.data.length)
    for (let y = 0; y < height; y++) {
      const row = y * width

      for (let x = 0; x < width; x++) {
        const curr_row = row + x

        const r = data.data[curr_row * 4]
        const g = data.data[curr_row * 4 + 1]
        const b = data.data[curr_row * 4 + 2]
        const grey = 0.299 * r + 0.587 * g + 0.114 * b

        bytes[curr_row] = grey
      }
    }
  }
  return new Image(bytes, width, height)
}
export default readImage
