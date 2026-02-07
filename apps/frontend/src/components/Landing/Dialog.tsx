import {AnimatePresence, motion} from "framer-motion"
import { createPortal } from "react-dom";
import React, {useRef, useEffect} from "react"
import rough from "roughjs"

export const Dialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}> = ({ isOpen, onClose, children, title }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (canvasRef.current && isOpen) {
      const rc = rough.canvas(canvasRef.current);
      const width = canvasRef.current.width;
      const height = canvasRef.current.height;
      
      rc.rectangle(10, 10, width - 20, height - 20, {
        roughness: 2.5,
        strokeWidth: 5,
        stroke: '#8B5CF6',
        fill: '#FFFBEB',
        fillStyle: 'solid',
      });
    }
  }, [isOpen]);
  
const getModalRoot = () => {
  if (typeof document === 'undefined') return null;

  let root = document.getElementById('modal-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'modal-root';
    document.body.appendChild(root);
  }
  return root;
};

const modalRoot = getModalRoot();
  if (!isOpen || !modalRoot) return null;
  
  const dialogContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-[9999]"
      style={{
        backgroundColor: 'rgba(139, 92, 246, 0.4)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: 50 }}
        animate={{ 
          scale: 1, 
          opacity: 1, 
          y: 0,
          transition: { type: 'spring', damping: 15, stiffness: 200 }
        }}
        exit={{ scale: 0.7, opacity: 0, y: 50 }}
        className="relative animate-[wobble_3s_ease-in-out_infinite]"
        style={{ transform: 'rotate(1.5deg)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <canvas
          ref={canvasRef}
          width={520}
          height={540}
          className="absolute top-0 left-0"
        />
        <div className="relative p-8 w-[440px] overflow-hidden" style={{ maxHeight: 'calc(100vh - 80px)' }}>
          <h2 
            className="text-3xl text-purple-600 mb-5 text-center font-bold"
            style={{ 
              transform: 'rotate(-1deg)',
              textShadow: '2px 2px 0 #FCD34D',
            }}
          >
            {title}
          </h2>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
  
  return createPortal(dialogContent, modalRoot);
};