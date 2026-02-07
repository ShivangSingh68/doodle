import React, { useEffect, useRef } from "react";
import rough from "roughjs"

interface SketchyCardProps {
    children: React.ReactNode,
    className?: string,
    color?: string,
}
export const SketchyCard: React.FC<SketchyCardProps> = ({ children, className = '', color = '#8b5cf6' } ) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rc = rough.canvas(canvas);
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx!.scale(dpr, dpr);
    ctx!.clearRect(0, 0, rect.width, rect.height);
    
    rc.rectangle(4, 4, rect.width - 8, rect.height - 8, {
      stroke: color,
      strokeWidth: 2.5,
      roughness: 1.5,
      bowing: 2,
      fill: 'rgba(255, 255, 255, 0.95)',
      fillStyle: 'solid',
    });
  }, [color]);
  
  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      <div className="relative z-10 p-4">
        {children}
      </div>
    </div>
  );
};