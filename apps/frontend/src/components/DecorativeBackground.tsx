import { useEffect, useRef } from "react";
import rough from "roughjs";

export const DecorativeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // CSS size
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Actual pixel size
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const rc = rough.canvas(canvas);

    const colors = [
      "#FCD34D",
      "#F472B6",
      "#60A5FA",
      "#A78BFA",
      "#34D399",
      "#FB923C",
    ];

    // Circles
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = 30 + Math.random() * 60;
      const color = colors[Math.floor(Math.random() * colors.length)];

      rc.circle(x, y, size, {
        roughness: 2,
        strokeWidth: 2,
        stroke: color,
        fill: color,
        fillStyle: "cross-hatch",
        fillWeight: 0.5,
      });
    }

    // Stars
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = 15 + Math.random() * 25;
      const color = colors[Math.floor(Math.random() * colors.length)];

      rc.path(
        `M ${x} ${y - size}
         L ${x + size * 0.3} ${y - size * 0.3}
         L ${x + size} ${y}
         L ${x + size * 0.3} ${y + size * 0.3}
         L ${x} ${y + size}
         L ${x - size * 0.3} ${y + size * 0.3}
         L ${x - size} ${y}
         L ${x - size * 0.3} ${y - size * 0.3}
         Z`,
        {
          roughness: 2.5,
          strokeWidth: 2,
          stroke: color,
          fill: color,
          fillStyle: "solid",
        }
      );
    }

    // Scribbles
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const color = colors[Math.floor(Math.random() * colors.length)];

      rc.path(
        `M ${x} ${y}
         Q ${x + 60} ${y + 30}, ${x + 120} ${y}
         T ${x + 240} ${y}`,
        {
          roughness: 3,
          strokeWidth: 3,
          stroke: color,
        }
      );
    }
  }, []);

  return (
    <>
      {/* Gradient layer */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, #FEF3C7, #FBCFE8, #BFDBFE, #DDD6FE, #BBF7D0)",
        }}
      />

      {/* Sketch canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10 pointer-events-none block"
      />
    </>
  );
};
