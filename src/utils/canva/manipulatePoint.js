import ROSLIB from "roslib";

export function filterPointArray(points) {
  const uniquePoints = [];

  points.forEach((point) => {
    if (!uniquePoints.some(([x, y]) => x === point[0] && y === point[1])) {
      uniquePoints.push(point);
    }
  });

  return uniquePoints;
}

export function rosToGlobalPoints(points, map, canvas, type, mapMetaData) {
  const scaledPoints = [];

  // this scaleFactor does not have effect on the position/locaiton of the polygon. It is only for size of polygon.
  const scaleFactorX = canvas.width / (map.width * mapMetaData?.resolution);
  const scaleFactorY = canvas.height / (map.height * mapMetaData?.resolution);

  const theta = 180;
  const radianAngle = (Math.PI / 180) * theta; // Convert angle to radian

  if (type !== "home") {
    points?.forEach((pt) => {
      const { x, y } = pt;

      var gX = (x - mapMetaData.origin[0]) * scaleFactorX;
      var gY =
        (map.height * mapMetaData.resolution + mapMetaData.origin[1] - y) *
        scaleFactorY; // top to bottom
      scaledPoints.push({ x: gX, y: gY });
    });
  } else {
    const { x, y } = points[0];
    scaledPoints.push((x - mapMetaData.origin[0]) * scaleFactorX);
    scaledPoints.push(
      (map.height * mapMetaData.resolution + mapMetaData.origin[1] - y) *
        scaleFactorY
    );

    const angle = y / (Math.PI / 180);
    console.log(angle);
    scaledPoints.push(-angle);
  }

  return scaledPoints;
}

export function globalToRosPoints(
  points,
  map,
  canvas,
  type,
  mapMetaData,
  displayMap
) {
  // Convert the raw canvas X and Y coordinates to ros X and Y coordinates
  const scaledPoints = [];

  const scaleFactorX = canvas.width / map.width / mapMetaData.resolution;
  const scaleFactorY = canvas.height / map.height / mapMetaData.resolution;

  const theta = 180;
  const radianAngle = (Math.PI / 180) * theta; // Convert angle to radian
  points.forEach((pt) => {
    const { x, y, z } = pt;
    var rosX = x / scaleFactorX + mapMetaData.origin[0];
    var rosY =
      map.height * mapMetaData.resolution +
      mapMetaData.origin[1] -
      y / scaleFactorY; // from the bottom to top

    var original_angle = Math.atan(rosX / rosY);

    var cosine_angle = Math.cos(radianAngle + original_angle);
    var sin_angle = Math.sin(radianAngle + original_angle);
    var absolute_distance = Math.sqrt(Math.pow(rosX, 2) + Math.pow(rosY, 2));

    // Calculate the X and Y according to how the canvas was flipped
    var new_rosX = absolute_distance * sin_angle;
    var new_rosY = absolute_distance * cosine_angle;

    if ((theta < 270.0 && theta > 180.0) || theta <= 0.0) {
      new_rosY *= -1.0;
      new_rosX *= -1.0;
    } else if (theta < 90.0 && theta > 0.0) {
      new_rosX =
        (absolute_distance + 0.3) *
        Math.sin(((theta - 90.0) / 180) * Math.PI + original_angle);
      new_rosY =
        (absolute_distance + 0.3) *
        Math.cos(((theta - 90.0) / 180) * Math.PI + original_angle);
      new_rosY *= -1.0;
      new_rosX *= -1.0;
      var intermediate_y = new_rosY;
      new_rosY = new_rosX;
      new_rosX = intermediate_y;
    }
    // Correct the X and Y
    if (rosY > 0) {
      new_rosY *= -1.0;
      new_rosX *= -1.0;
    }

    let resultXY;
    if (type === "home") {
      const angle = -(z * Math.PI) / 180;
      resultXY = new ROSLIB.Vector3({
        x: new_rosX,
        y: new_rosY,
      });
      scaledPoints.push([resultXY.x, resultXY.y, angle]);
    } else {
      resultXY = new ROSLIB.Vector3({
        x: new_rosX,
        y: new_rosY,
      });
      scaledPoints.push({ x: resultXY.x, y: resultXY.y });
    }
  });

  return scaledPoints;
}
