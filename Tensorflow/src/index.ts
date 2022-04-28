import * as tf from '@tensorflow/tfjs'

const model = tf.sequential()

const xTrain = tf.randomUniform([2, 28, 28, 1])
const yTrain = tf.randomUniform([2, 10])

model.add(tf.layers.conv2d({inputShape: [28, 28, 1],kernelSize: 3,filters: 8,strides: 1,}))
model.add(tf.layers.conv2d({ kernelSize: 3, filters: 16, strides: 1 }))
model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }))
model.add(tf.layers.conv2d({ kernelSize: 3, filters: 32, strides: 1 }))
model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }))
model.add(tf.layers.flatten())
model.add(tf.layers.dense({ units: 10, activation: 'softmax' }))

model.summary()

model.compile({ optimizer: "adam", loss: "categoricalCrossentropy", metrics: ["accuracy"] });

const his = model.evaluate(xTrain, yTrain, { batchSize: 2 })
console.log(his)