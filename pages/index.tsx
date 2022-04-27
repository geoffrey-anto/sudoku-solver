import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useRef } from 'react'
import readImage from '../Utils/ImageProcessing'
import Webcam from 'react-webcam'
import Image from '../Utils/Image'
import adaptiveThreshold from '../Utils/AdaptiveThresholding'
import getLargestConnectedComponent from '../Utils/largestConnectedConmonent'
import getConnerPoints, { ConnerPoints } from '../Utils/getConnerPoints'
import {
  applyHomographicTransform,
  homographicTransform,
  Transform,
} from '../Utils/homographyTransform'
import splitIntogrids, { PuzzleBox } from '../Utils/makeGrids'

const Home: NextPage = () => {
  const videoConstraints = {
    // facingMode: { exact: "environment" }
  }
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    setInterval(() => {
      if (
        webcamRef &&
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState == 4
      ) {
        webcamRef.current.video.width = 400
        webcamRef.current.video.height = 400
        const img: Image = readImage(webcamRef.current.video, 400, 400)
        const transformed = adaptiveThreshold(img.clone(), 160, 20)
        const largestConnectedComponent = getLargestConnectedComponent(
          transformed.clone(),
          {
            minAspectRatio: 0.5,
            maxAspectRatio: 1.5,
            minSize:
              Math.min(
                webcamRef.current.video.videoWidth,
                webcamRef.current.video.videoHeight
              ) * 0.3,
            maxSize:
              Math.min(
                webcamRef.current.video.videoWidth,
                webcamRef.current.video.videoHeight
              ) * 0.9,
          }
        )
        const topLeft = largestConnectedComponent?.bounds.topLeft
        const bottomRight = largestConnectedComponent?.bounds.bottomRight
        let nearest: ConnerPoints | null = null
        if (largestConnectedComponent) {
          nearest = getConnerPoints(largestConnectedComponent)
        }
        let H: Transform
        let aplied: Image | null = null
        if (nearest) {
          H = homographicTransform(400, nearest)
          aplied = applyHomographicTransform(img, H, 400)
        }
        let grids: PuzzleBox[] | null = null
        if(aplied){
          grids = splitIntogrids(aplied, transformed);
        }
        // const temp = new findLargesConnectedComponent(transformed.height, transformed.width)
        // const largestGrid = temp.computeLargestConnectedGrid(img.to2DMatrix())
        // const bytes = new Uint8ClampedArray(largestGrid.length*largestGrid[0].length)
        // const by_height = largestGrid.length
        // const by_width = largestGrid[0].length
        // for (let i = 0; i < by_height; i++) {
        //   for (let j = 0; j < by_width; j++) {
        //     bytes[i*by_height + j] = largestGrid[i][j]
        //   }
        // }
        // const lrg = new Image(bytes, by_width, by_height)
        if (canvasRef && canvasRef.current && aplied && grids) {
          canvasRef.current.width = 400
          canvasRef.current.height = 400
          const ctx = canvasRef.current.getContext('2d')
          if (
            ctx &&
            topLeft?.x &&
            topLeft?.y &&
            largestConnectedComponent?.width &&
            largestConnectedComponent?.height &&
            nearest
          ) {
            ctx.beginPath()
            ctx.fillStyle = "red";
            ctx.lineWidth = 3;
            console.log(grids.length)
            // for(let i=0; i< 81; i++){
            //   // console.log(grids[i].height);
            //   if(grids && grids[i] && grids[i].numberImage && grids[i].numberImage.width && grids[i].numberImage.height){
            //     ctx.putImageData(grids[i].numberImage.toImageData(), grids[i].numberImage.height*i, grids[i].numberImage.width*i)
            //   }
            // }
            // ctx.rect(topLeft?.x, topLeft?.y, largestConnectedComponent?.width, largestConnectedComponent?.height);
            ctx.fillRect(100, 100, 10, 10);
            // ctx.fillRect(nearest.topRight.x, nearest.topRight.y, 10, 10);
            // ctx.fillRect(nearest.bottomLeft.x, nearest.bottomLeft.y, 10, 10);
            // ctx.fillRect(nearest.bottomRight.x, nearest.bottomRight.y, 10, 10);
            // ctx.stroke()
          }
        }
      }
    }, 2000)
  }, [])
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
// find largest connected component > --DONE
// Clean non connnected objects > --DONE
// Find Conner Points (Manhattan distnace) --DONE
// Find the Homography Matrix > --DONE
// Apply the Homography Matrix to the image > --DONE
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
