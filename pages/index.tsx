import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useRef } from 'react'
import readImage from '../Utils/ImageProcessing'
import Webcam from 'react-webcam'
import Image from '../Utils/Image'
import adaptiveThreshold from '../Utils/AdaptiveThresholding'
import getLargestConnectedComponent from '../Utils/largestConnectedConmonent'

const Home: NextPage = () => {
  const videoConstraints = {
    // facingMode: { exact: "environment" }
  }
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // useEffect(() => {
  //   setInterval(() => {
  //     if (
  //       webcamRef &&
  //       webcamRef.current &&
  //       webcamRef.current.video &&
  //       webcamRef.current.video.readyState == 4
  //     ) {
  //       webcamRef.current.video.width = 400  // set video width, heigh
  //       webcamRef.current.video.height = 400 
  //       const img: Image = readImage(webcamRef.current.video, 400 , 400 )
  //       const transformed = adaptiveThreshold(img.clone(), 160, 20)
  //       const largestConnectedComponent = getLargestConnectedComponent(
  //         transformed,
  //         {
  //           minAspectRatio: 0.5,
  //           maxAspectRatio: 1.5,
  //           minSize:
  //             Math.min(webcamRef.current.video.videoWidth, webcamRef.current.video.videoHeight) * 0.3,
  //           maxSize:
  //             Math.min(webcamRef.current.video.videoWidth, webcamRef.current.video.videoHeight) * 0.9,
  //         }
  //       );
  //       const topLeft = largestConnectedComponent?.bounds.topLeft
  //       const bottomRight = largestConnectedComponent?.bounds.bottomRight
  //       // const temp = new findLargesConnectedComponent(transformed.height, transformed.width)
  //       // const largestGrid = temp.computeLargestConnectedGrid(img.to2DMatrix())
  //       // const bytes = new Uint8ClampedArray(largestGrid.length*largestGrid[0].length)
  //       // const by_height = largestGrid.length
  //       // const by_width = largestGrid[0].length
  //       // for (let i = 0; i < by_height; i++) {
  //       //   for (let j = 0; j < by_width; j++) {
  //       //     bytes[i*by_height + j] = largestGrid[i][j]
  //       //   }
  //       // }
  //       // const lrg = new Image(bytes, by_width, by_height)
  //       if (canvasRef && canvasRef.current) {
  //         canvasRef.current.width = 400 
  //         canvasRef.current.height = 400 
  //         const ctx = canvasRef.current.getContext('2d')
  //         if (ctx && topLeft?.x && topLeft?.y && largestConnectedComponent?.width &&largestConnectedComponent?.height) {
  //           ctx.beginPath()
  //           ctx.fillStyle = "red";
  //           ctx.lineWidth = 3;
  //           ctx.rect(topLeft?.x, topLeft?.y, largestConnectedComponent?.width, largestConnectedComponent?.height);
  //           ctx.stroke()
  //           // ctx.putImageData(transformed.toImageData(), 0, 0)
  //         }
  //       }  
  //     }
  //   }, 50)
  // }, [])
  return (
    <div className="">
      <Head>
        <title>Create Next App</title>
      </Head>
      <Webcam ref={webcamRef} videoConstraints={videoConstraints} />
      <canvas ref={canvasRef}></canvas>
    </div>
  )
}

export default Home

// --------------------------------------------------------------------------- TODO ------------------------------------------------------------------------------------

// Setup cam and video stream --DONE
// Create Image class --DONE
// Read Image and convert --DONE
// Adpative thresholding --Done threshold = 160, blur = 20
// find largest connected component > --Done
// Clean non connnected objects > --Done
// Find Conner Points (Manhattan distnace)
// Find the Homography Matrix
// Apply the Homography Matrix to the image
// divide the image by 9 rows and colums
// Make a array each small grid
// Predict each small grid from 1 to 9 or none
// Fill up the matrix with the prediction
// solve the sodoku puzzle (Matrix we just computed)
// Draw it on a canvas with the original image after multiplying it with the homography matrix
// Draw the grid on the canvas
// align the coordinates of the canvas with the original image's coordinates
// Print the canvas on the screen
// Done.
