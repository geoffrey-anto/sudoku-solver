export default class Image {
  public bytes: Uint8ClampedArray
  public width: number
  public height: number

  constructor(bytes: Uint8ClampedArray, w: number, h: number) {
    this.bytes = bytes
    this.width = w
    this.height = h
  }

  static withSize(w: number, h: number) {
    return new Image(new Uint8ClampedArray(w * h), w, h)
  }
  public clone() {
    const bytes = new Uint8ClampedArray(this.bytes)
    return new Image(bytes, this.width, this.height)
  }
  public subImage(x1: number, y1: number, x2: number, y2: number) {
    const width = x2 - x1
    const height = y2 - y1
    const bytes = new Uint8ClampedArray(width * height)
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        bytes[i * width + j] = this.bytes[(i + y1) * this.width + j + x1]
      }
    }
    return new Image(bytes, width, height)
  }
  public toImageData() {
    const data = new ImageData(this.width, this.height)
    for (let i = 0; i < this.height; i++) {
      const row = i * this.width
      for (let j = 0; j < this.width; j++) {
        const value = this.bytes[row + j]
        ;[
          data.data[(row + j) * 4],
          data.data[(row + j) * 4 + 1],
          data.data[(row + j) * 4 + 3],
        ] = [value, value, value]
        data.data[(row + j) * 4 + 3] = 255
      }
    }
    return data
  }
  public to2DMatrix(){
    const res: number[][] = new Array(this.height)
    for(let i=0; i<this.height;i++){
      const row = i*this.width;
      for(let j=0;j<this.width;j++){
        res[i] = new Array(this.width);
        res[i][j] = this.bytes[row+j];
      }
    }
    return res;
  }
}
