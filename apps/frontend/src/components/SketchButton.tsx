import React, { useEffect, useRef } from "react";
import rough from "roughjs";
import { motion } from "framer-motion";

export const SketchButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  color?: string;
}> = ({ children, onClick, color = "#A78BFA" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const WIDTH = 260;
  const HEIGHT = 80;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;

    // Proper DPR scaling (CRITICAL)
    canvas.width = WIDTH * dpr;
    canvas.height = HEIGHT * dpr;
    canvas.style.width = `${WIDTH}px`;
    canvas.style.height = `${HEIGHT}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    const rc = rough.canvas(canvas);

    rc.rectangle(6, 6, WIDTH - 12, HEIGHT - 12, {
      roughness: 2.4,
      strokeWidth: 4,
      stroke: color,
      fill: color,
      fillStyle: "solid",
      bowing: 1.5,
    });
  }, [color]);

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.1, rotate: 4 }}
      whileTap={{ scale: 0.96 }}
      style={{
        width: WIDTH,
        height: HEIGHT,
        position: "relative",
        cursor: "pointer",
        transform: "rotate(-1deg)",
      }}
    >
      {/* Sketch background */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      />

      {/* Button text */}
      <span
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          fontWeight: 700,
          color: "#ffffff",
          textShadow: "1px 1px 0 rgba(0,0,0,0.15)",
          userSelect: "none",
        }}
      >
        {children}
      </span>
    </motion.div>
  );
};
