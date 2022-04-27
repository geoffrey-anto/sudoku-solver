import { Point, ConnectedRegion } from "./largestConnectedConmonent";

export type ConnerPoints = {
    topLeft: Point,
    topRight: Point,
    bottomLeft: Point,
    bottomRight: Point
}

function getNearestPoints(points: Point[], x:number, y:number): Point{
    let closest = points[0];
    let min_dis = Number.MAX_SAFE_INTEGER;
    for(let i=0;i<points.length;i++){
        const x_dist = Math.abs(points[i].x - x);
        const y_dist = Math.abs(points[i].y - y);

        const dist = x_dist+y_dist;

        if(dist<min_dis){
            min_dis = dist;
            closest = points[i];
        }
    }
    return closest;
}

export default function getConnerPoints(region: ConnectedRegion){
    const x_min = region.bounds.topLeft.x;
    const y_min = region.bounds.topLeft.y;
    const x_max = region.bounds.bottomRight.x;
    const y_max = region.bounds.bottomRight.y;
    const {points} = region
    const res:ConnerPoints = {
        topLeft: getNearestPoints(points, x_min, y_min),
        topRight: getNearestPoints(points, x_max, y_min),
        bottomLeft: getNearestPoints(points, x_min, y_max),
        bottomRight: getNearestPoints(points, x_max, y_max)
    }
    return res;
}