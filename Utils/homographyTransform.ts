import { ConnerPoints } from './getConnerPoints'
import * as math from 'mathjs'
import Image from './Image'

export interface Transform {
  a: number
  b: number
  c: number
  d: number
  e: number
  f: number
  g: number
  h: number
}

export function applyHomographicTransform(
  img: Image,
  transform: Transform,
  size: number
) {
  const { a, b, c, d, e, f, g, h } = transform
  const res = Image.withSize(size, size)
  const wdth = img.width
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const l = b * i + c
      const m = h * i + 1
      const n = e * i + f
      const o = h * i + 1

      const sx = Math.floor((a * j + l) / (g * j + m))
      const sy = Math.floor((d * j + n) / (g * j + o))

      res.bytes[i * size + j] = img.bytes[sy * wdth + sx]
    }
  }
  return res
}

export function homographicTransform(
  size: number,
  corners: ConnerPoints
) {
  const A: math.Matrix = math.zeros(8, 8) as math.Matrix
  A.set([0, 2], 1)
  A.set([1, 5], 1)
  A.set([2, 0], size)
  A.set([2, 2], 1)
  A.set([2, 6], -size * corners.topRight.x)
  A.set([3, 3], size)
  A.set([3, 5], 1)
  A.set([3, 6], -size * corners.topRight.y)
  A.set([4, 1], size)
  A.set([4, 2], 1)
  A.set([4, 7], -size * corners.bottomLeft.x)
  A.set([5, 4], size)
  A.set([5, 5], 1)
  A.set([5, 7], -size * corners.bottomLeft.y)
  A.set([6, 0], size)
  A.set([6, 1], size)
  A.set([6, 2], 1)
  A.set([6, 6], -size * corners.bottomRight.x)
  A.set([6, 7], -size * corners.bottomRight.x)
  A.set([7, 3], size)
  A.set([7, 4], size)
  A.set([7, 5], 1)
  A.set([7, 6], -size * corners.bottomRight.y)
  A.set([7, 7], -size * corners.bottomRight.y)

  const matB = [
    corners.topLeft.x,
    corners.topLeft.y,
    corners.topRight.x,
    corners.topRight.y,
    corners.bottomLeft.x,
    corners.bottomLeft.y,
    corners.bottomRight.x,
    corners.bottomRight.y,
  ]
  const B = math.matrix(matB) as math.Matrix
  const aT = math.transpose(A) as math.Matrix

  const H = math.multiply(math.inv(math.multiply(aT, A)), math.multiply(aT, B))
  const transform = {
    a: H.get([0]),
    b: H.get([1]),
    c: H.get([2]),
    d: H.get([3]),
    e: H.get([4]),
    f: H.get([5]),
    g: H.get([6]),
    h: H.get([7]),
  } as Transform
  return transform;
}
