import { useState } from "react";
import { motion } from "framer-motion"
import { SketchyCard } from "./SketchyCard";
import { SketchyButton } from "./SketchyButton";
import {Copy, Github} from "lucide-react"


interface ChatHeaderProps {
    roomId?: string,
}
export const ChatHeader: React.FC<ChatHeaderProps> = ({ roomId }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    const url: string = `http://localhost:5173/chat/${roomId}`
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
      style={{ transform: 'translateX(-50%) rotate(-0.5deg)' }}
    >
      <SketchyCard color="#ec4899" className="shadow-lg">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-sm text-gray-600 font-medium">Room ID</p>
            <p className="text-2xl font-bold text-[#1f2937]">{roomId}</p>
          </div>
          
          <SketchyButton
            onClick={handleCopy}
            color="#ec4899"
            icon={Copy}
          >
            {copied ? 'Copied!' : 'Copy'}
          </SketchyButton>
          
          <a href="https://github.com/ShivangSingh68/doodle" target="_blank" rel="noopener noreferrer">
            <motion.div whileHover={{ rotate: 10, scale: 1.1 }}>
              <Github size={28} className="text-[#1f2937]" />
            </motion.div>
          </a>
        </div>
      </SketchyCard>
    </motion.div>
  );
};