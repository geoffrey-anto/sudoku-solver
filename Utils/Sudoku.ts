import {
  applyHomographicTransform,
  homographicTransform,
  Transform,
  transformPoint,
} from './homographyTransform'
import getConnerPoints, { ConnerPoints } from './getConnerPoints'
import getLargestConnectedComponent, {
  Point,
} from './largestConnectedConmonent'
import readImage from './ImageProcessing'
import adaptiveThreshold from './AdaptiveThresholding'
import extractBoxes from './makeGrids'
import classifyGrids from './makePredictions'

const Min_Boxes = 15
const sizeOfPuzzle = 900

type SolvedBox = {
  isKnown: boolean
  digit: number
  digitHeight: number
  digitRotation: number
  position: Point
}

export default class Sudoku {
  video: HTMLVideoElement | null = null
  isVideoRunning: boolean = false
  isSolving: boolean = false
  conners: ConnerPoints | null = null
  grid_lines: { p1: Point; p2: Point }[] | null = []
  solved_puzzle: number[][] | null = []

  async startVideo(video: HTMLVideoElement) {
    this.video = video
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: 640 },
      audio: false,
    })
    if (this.video.readyState == 4) {
      this.video.srcObject = stream
      this.video.onloadedmetadata = function (e) {
        video.play()
      }
    }
  }

  createGridLines(transform: Transform) {
    const boxSize = sizeOfPuzzle / 9
    const gridLines: { p1: Point; p2: Point }[] = []
    for (let i = 0; i < 9; i++) {
      gridLines.push({
        p1: transformPoint(transform, { x: 0, y: 1 * boxSize }),
        p2: transformPoint(transform, { x: sizeOfPuzzle, y: 1 * boxSize }),
      })

      gridLines.push({
        p1: transformPoint(transform, { y: 0, x: 1 * boxSize }),
        p2: transformPoint(transform, { y: sizeOfPuzzle, x: 1 * boxSize }),
      })
    }
    return gridLines
  }

  getTextDetailsForBox(
    x: number,
    y: number,
    digit: number,
    isKnown: boolean,
    transform: Transform
  ): SolvedBox {
    const boxSize = sizeOfPuzzle / 9
    // work out the line that runs vertically through the box in the original image space
    const p1 = transformPoint(transform, {
      x: (x + 0.5) * boxSize,
      y: y * boxSize,
    })
    const p2 = transformPoint(transform, {
      x: (x + 0.5) * boxSize,
      y: (y + 1) * boxSize,
    })
    // the center of the box
    const textPosition = transformPoint(transform, {
      x: (x + 0.5) * boxSize,
      y: (y + 0.5) * boxSize,
    })
    // approximate angle of the text in the box
    const dx = p1.x - p2.x
    const dy = p1.y - p2.y
    const digitRotation = Math.atan2(dx, dy)

    // appriximate height of the text in the box
    const digitHeight = 0.8 * Math.sqrt(dx * dx + dy * dy)

    return {
      digit,
      digitHeight,
      digitRotation,
      isKnown: isKnown,
      position: textPosition,
    }
  }

  sanityCheckCorners({
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
  }: {
    topLeft: Point
    topRight: Point
    bottomLeft: Point
    bottomRight: Point
  }) {
    function length(p1: Point, p2: Point) {
      const dx = p1.x - p2.x
      const dy = p1.y - p2.y
      return Math.sqrt(dx * dx + dy * dy)
    }
    const topLineLength = length(topLeft, topRight)
    const leftLineLength = length(topLeft, bottomLeft)
    const rightLineLength = length(topRight, bottomRight)
    const bottomLineLength = length(bottomLeft, bottomRight)
    if (
      topLineLength < 0.5 * bottomLineLength ||
      topLineLength > 1.5 * bottomLineLength
    )
      return false
    if (
      leftLineLength < 0.7 * rightLineLength ||
      leftLineLength > 1.3 * rightLineLength
    )
      return false
    if (
      leftLineLength < 0.5 * bottomLineLength ||
      leftLineLength > 1.5 * bottomLineLength
    )
      return false
    return true
  }

  async processStep() {
    if (this.isVideoRunning == false) {
      return
    }
    if (this.isSolving) {
      return
    }
    if (!this.video) {
      return
    }
    try {
      const image = readImage(this.video)
      const thresholded = adaptiveThreshold(image.clone(), 160, 20)
      const LCC = getLargestConnectedComponent(thresholded, {
        minAspectRatio: 0.5,
        maxAspectRatio: 1.5,
        minSize: Math.min(this.video.videoWidth, this.video.videoHeight) * 0.3,
        maxSize: Math.min(this.video.videoWidth, this.video.videoHeight) * 0.9,
      })
      if (LCC) {
        const corners = getConnerPoints(LCC)
        if (this.sanityCheckCorners(corners)) {
          const transform: Transform = homographicTransform(
            sizeOfPuzzle,
            corners
          )

          this.grid_lines = this.createGridLines(transform)

          const applied_grascale = applyHomographicTransform(
            thresholded,
            transform,
            sizeOfPuzzle
          )

          const applied_threshold = applyHomographicTransform(
            thresholded,
            transform,
            sizeOfPuzzle
          )

          const boxes = extractBoxes(applied_grascale, applied_threshold)

          if (boxes.length > Min_Boxes) {
            await classifyGrids(boxes)
          }
        } else {
          this.conners = null
          this.grid_lines = null
          this.solved_puzzle = null
        }
      } else {
        this.conners = null
        this.grid_lines = null
        this.solved_puzzle = null
      }
    } catch (error) {
      console.log(error)
    }
    this.isSolving = false
    setTimeout(this.processStep, 100)
  }
}
