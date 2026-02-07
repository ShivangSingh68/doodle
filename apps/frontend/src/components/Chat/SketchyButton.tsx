import React, { useEffect, useRef, useState, type ComponentType } from "react";
import rough from "roughjs";
import { motion } from "framer-motion";

interface SketchyButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  color?: string;
  className?: string;
  icon?: ComponentType<{
    className?: string;
    size?: number;
    color?: string;
  }>;
}

export const SketchyButton: React.FC<SketchyButtonProps> = ({
  children,
  onClick,
  color = "#06b6d4",
  className = "",
  icon: Icon,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rc = rough.canvas(canvas);
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx!.scale(dpr, dpr);
    ctx!.clearRect(0, 0, rect.width, rect.height);

    rc.rectangle(2, 2, rect.width - 4, rect.height - 4, {
      fill: isHovered ? color : "white",
      fillStyle: "solid",
      stroke: color,
      strokeWidth: 2.5,
      roughness: 1.5,
      bowing: 2,
    });
  }, [color, isHovered]);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05, rotate: isHovered ? 2 : 0 }}
      whileTap={{ scale: 0.95 }}
      className={`relative ${className} `}
      // style={{ transform: `rotate(${Math.random() * 2 - 1}deg)` }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full " />
      <span
        className={`relative z-10 flex items-center gap-2 px-4 py-2 font-bold ${isHovered ? "text-white" : ""}`}
        style={{ color: isHovered ? "white" : color }}
      >
        {Icon && <Icon size={18} />}
        {children}
      </span>
    </motion.button>
  );
};
