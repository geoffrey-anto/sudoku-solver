import * as tf from '@tensorflow/tfjs'

const x = tf.tensor([1, 2, 3, 4])
const y = tf.tensor([2, 3, 4, 5])

const z = x.add(y)

z.print()