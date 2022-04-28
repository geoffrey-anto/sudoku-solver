import { PuzzleBox } from './makeGrids'
import * as tf from '@tensorflow/tfjs'

let model: tf.LayersModel | null = null
let modelLoadingPromise: Promise<tf.LayersModel> | undefined = undefined

const MODEL_URL = 'http://localhost:3000/tfjs_model/model.json'

const CLASSES = [1, 2, 3, 4, 5, 6, 7, 8, 9]

async function loadModel(): Promise<tf.LayersModel | null | void> {
  if (model != null) {
    return
  }
  if (modelLoadingPromise) {
    return modelLoadingPromise
  }
  modelLoadingPromise = new Promise(async function (resolve, reject) {
    model = await tf.loadLayersModel(MODEL_URL)
    resolve(model)
  })
}

export async function getClasses(logits: tf.Tensor<tf.Rank>) {
  const logitsArray = (await logits.array()) as number[][]
  const classes = logitsArray.map((values) => {
    let maxProb = 0
    let maxIndex = 0
    values.forEach((value, index) => {
      if (value > maxProb) {
        maxProb = value
        maxIndex = index
      }
    })
    return CLASSES[maxIndex]
  })
  return classes
}

export default async function classifyGrids(grids: PuzzleBox[] | null) {
  const model = await loadModel()
  if (model && grids) {
    const logits = tf.tidy(function () {
      const images = grids.map((grid) => {
        const img = tf.browser
          .fromPixels(grid.numberImage.toImageData(), 1)
          .resizeBilinear([20, 20])
          .toFloat()

        const mean = img.mean()
        const stdDev = tf.moments(img).variance.sqrt()
        const norm = img.sub(mean).div(stdDev)
        const expandDims = norm.expandDims(1)
        return expandDims
      })
      const X = tf.concat(images)
      return model.predict(X, {
        batchSize: grids.length,
      })
    })
    const classes = await getClasses(logits as tf.Tensor<tf.Rank>)
    classes.forEach((classPred, id) => (grids[id].contents = classPred))
  }
}
