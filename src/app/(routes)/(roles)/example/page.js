"use client";
import { useEffect, useMemo, useRef, useState } from "react";

import "./canva.css";

export default function App() {
  const colors = useMemo(
    () => ["black", "red", "green", "orange", "blue", "yellow"],
    []
  );

  const canvasReference = useRef(null);
  const contextReference = useRef(null);

  const [isPressed, setIsPressed] = useState(false);
  const [scale, setScale] = useState(1);

  const clearCanvas = () => {
    const canvas = canvasReference.current;
    const context = canvas.getContext("2d");
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0); // Reset transform to identity
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
  };

  const beginDraw = (e) => {
    contextReference.current.beginPath();
    contextReference.current.moveTo(
      e.nativeEvent.offsetX / scale,
      e.nativeEvent.offsetY / scale
    );
    setIsPressed(true);
  };

  const updateDraw = (e) => {
    if (!isPressed) return;

    contextReference.current.lineTo(
      e.nativeEvent.offsetX / scale,
      e.nativeEvent.offsetY / scale
    );
    contextReference.current.stroke();
  };

  const endDraw = () => {
    contextReference.current.closePath();
    setIsPressed(false);
  };

  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale * 1.2, 5)); // Limit max scale
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale / 1.2, 0.2)); // Limit min scale
  };

  useEffect(() => {
    const canvas = canvasReference.current;
    canvas.width = 800;
    canvas.height = 800;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = colors[0];
    context.lineWidth = 5;
    contextReference.current = context;
  }, [colors]);

  useEffect(() => {
    const canvas = canvasReference.current;
    const context = canvas.getContext("2d");

    context.save();
    context.setTransform(scale, 0, 0, scale, 0, 0); // Apply scale transformation
    context.restore();
  }, [scale]);

  const setColor = (color) => {
    contextReference.current.strokeStyle = color;
  };
  console.log(scale);

  return (
    <div className="flex justify-between">
      <div className="App">
        <canvas
          ref={canvasReference}
          onMouseDown={beginDraw}
          onMouseMove={updateDraw}
          onMouseUp={endDraw}
          style={{ transform: `scale(${scale})` }}
        />
      </div>
      <div className={`buttons z-10000 bg-blue-100 w-[400px]`}>
        <button onClick={clearCanvas}>CLR</button>
        {colors.map((color, index) => (
          <button
            key={index}
            onClick={() => setColor(color)}
            style={{ backgroundColor: color }}
          ></button>
        ))}
        <button onClick={zoomIn}>Zoom In</button>
        <button onClick={zoomOut}>Zoom Out</button>
      </div>
    </div>
  );
}
