import { useEffect, useRef, useState, type ComponentType } from "react";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { SketchyButton } from "./SketchyButton";
import { motion } from "framer-motion";
import {
  Circle,
  Square,
  Minus,
  Eraser,
  Upload,
  Send,
  Paintbrush,
} from "lucide-react";
import { PencilBrush, FabricImage } from "fabric";
import rough from "roughjs";
import { UploadDialog } from "./UploadDialog";

interface DrawSketchyButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  color?: string;
  className?: string;
  icon?: ComponentType<{
    className?: string;
    size?: number;
    color?: string;
  }>;
  isActive: boolean;
}

export const DrawSketchyButton: React.FC<DrawSketchyButtonProps> = ({
  children,
  onClick,
  color = "#4f46e5",
  className = "",
  icon: Icon,
  isActive,
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
      fill: isHovered || isActive ? color : "white",
      fillStyle: "solid",
      stroke: color,
      strokeWidth: 2.5,
      roughness: 1.5,
      bowing: 2,
    });
  }, [color, isHovered, isActive]);

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
        className={`relative z-10 flex items-center gap-2 px-4 py-2 font-bold ${isHovered ? "text-white" : ""} ${isActive || isHovered ? "text-white" : "text-indigo-600"}`}
        // style={{ color: isHovered ? "white" : color }}
      >
        {Icon && <Icon size={18} />}
        {children}
      </span>
    </motion.button>
  );
};
interface CanvasComposerProps {
  onSend: (img: string) => void;
}
export const CanvasComposer: React.FC<CanvasComposerProps> = ({onSend}) => {
  const [brushColor, setBrushColor] = useState("#1f2937");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [brushSize, setBrushSize] = useState(5);
  const { editor, onReady } = useFabricJSEditor();
  const [isDrawingMode, setisDrawingMode] = useState<boolean>(true);
  const [brushBtnActive, setBrushBtnActive] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const handleSend = () => {
    if (!editor) return;
    const imgData = editor.canvas.toDataURL();
    onSend(imgData);
  };

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    if (!file.type.startsWith("image/")) return;

    const canvas = editor.canvas;

    const url = URL.createObjectURL(file);

    try {
      const img = await FabricImage.fromURL(url, {
        crossOrigin: "anonymous",
      });

      img.set({
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2,
        originX: "center",
        originY: "center",
        selectable: true,
      });

      img.scaleToWidth(canvas.getWidth() * 0.5);

      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.requestRenderAll();
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }

  const applyColorToActiveObject = () => {
    if (!editor) return;

    const obj = editor.canvas.getActiveObject();
    if (!obj) return;

    if (obj.type === "line") {
      obj.set({
        stroke: brushColor,
        strokeWidth: brushSize,
      });
    } else {
      obj.set({
        fill: brushColor,
        stroke: brushColor,
        strokeWidth: 2,
      });
    }

    editor.canvas.renderAll();
  };
  const eraseBtn = () => {
    if (!editor) return;

    const active = editor?.canvas.getActiveObject();
    //@ts-ignore
    editor?.canvas.remove(active);
  };
  const brushBtn = () => {
    if (!editor) return;
    setisDrawingMode((prev) => !prev);
    setBrushBtnActive((prev) => !prev);

    editor.canvas.isDrawingMode = isDrawingMode;
    if (editor.canvas.isDrawingMode) {
      editor.canvas.freeDrawingBrush = new PencilBrush(editor.canvas);
      editor.canvas.freeDrawingBrush.width = brushSize;
      editor.canvas.freeDrawingBrush.color = brushColor;
    }
  };
  const squareBtn = () => {
    if (!editor) return;
    editor.addRectangle();
  };
  const circleBtn = () => {
    if (!editor) return;
    editor.addCircle();
  };
  const lineBtn = () => {
    if (!editor) return;
    editor.addLine();
  };
  const onbgColorChange = (e: any) => {
    setBgColor(e.target.value);
    editor!.canvas.backgroundColor = bgColor;
    editor?.canvas.renderAll();
  };
  const onBrushColorChange = (e: any) => {
    const newColor = e.target.value;
    setBrushColor(newColor);

    if (editor?.canvas.freeDrawingBrush) {
      editor.canvas.freeDrawingBrush.color = newColor;
    }

    // Also recolor selected shape live
    applyColorToActiveObject();
  };
  const onBrushSizeChange = (e: any) => {
    setBrushSize(parseInt(e.target.value));
    editor!.canvas.freeDrawingBrush!.width = brushSize;
    editor?.canvas.renderAll();
  };
  const ClearCanvasBtn = () => {
    editor!.canvas._objects.forEach((o) => editor?.canvas.remove(o));
  };
  return (
    <motion.div
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 20 }}
      className="bottom-0 z-40 h-65"
    >
      <div
        className="
      absolute inset-0
      bg-amber-100
      rounded-lg
    "
      />

      {/* CONTENT */}
      <div className="relative z-10 flex gap-3 p-3 rounded-2xl">
        {/* CANVAS */}
        <div className="flex-2 rounded-md  bg-white shadow-lg">
          <FabricJSCanvas
            onReady={onReady}
            className="sample-canvas w-full h-full rounded-lg cursor-crosshair"
          />
        </div>

        {/* TOOLS */}
        <div className="w-65 flex flex-col gap-2 text-sm">
          {/* TOOL ROW */}
          <div className="grid grid-cols-3 grid-rows-2 gap-1">
            <DrawSketchyButton
              icon={Paintbrush}
              color="#4f46e5"
              onClick={brushBtn}
              isActive={brushBtnActive}
            />
            <SketchyButton icon={Eraser} color="#f59e0b" onClick={eraseBtn} />
            <SketchyButton icon={Square} color="#ec4899" onClick={squareBtn} />
            <SketchyButton icon={Circle} color="#06b6d4" onClick={circleBtn} />
            <SketchyButton icon={Minus} color="#10b981" onClick={lineBtn} />
          </div>

          {/* SIZE */}
          <div className="flex items-center gap-2 text-xs">
            <span
              className="font-bobody {
                            margin: 0;
                            padding: 0;
                            width: 100%;
                            height: 100%;
                          }ld text-green-700"
            >
              Size
            </span>
            <input
              type="range"
              min={1}
              max={50}
              value={brushSize}
              onChange={onBrushSizeChange}
              className="flex-1 h-1"
            />
            <span className="w-6 text-right">{brushSize}</span>
          </div>

          {/* COLORS */}
          <div className="flex items-center gap-3 text-xs">
            <label className="flex items-center gap-1">
              🎨
              <input
                type="color"
                value={brushColor}
                onChange={onBrushColorChange}
              />
            </label>

            <label className="flex items-center gap-1">
              🧻
              <input type="color" value={bgColor} onChange={onbgColorChange} />
            </label>

            <SketchyButton onClick={ClearCanvasBtn}>Clear</SketchyButton>
          </div>

          {/* ACTIONS */}
          <div className="mt-auto flex gap-2">
            <SketchyButton
              icon={Upload}
              color="#10b981"
              className="flex-1"
              onClick={() => setOpen(true)}
            >
              Upload
            </SketchyButton>
            <UploadDialog
              open={open}
              onClose={() => setOpen(false)}
              onSelect={handleImage}
            />
            <SketchyButton
              icon={Send}
              color="#4f46e5"
              onClick={handleSend}
              className="flex-1"
            >
              Send
            </SketchyButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
