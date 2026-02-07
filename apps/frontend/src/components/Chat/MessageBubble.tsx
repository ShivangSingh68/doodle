import type { User } from "../../../../ws/src/types/types";
import type { Message } from "../../types/types";
import { SketchyCard } from "./SketchyCard";
import { motion } from "framer-motion";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  index: number;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  index,
}) => {
  const colors = ["#ec4899", "#8b5cf6", "#06b6d4", "#f59e0b", "#10b981"];
  const color = isOwn
    ? "#4f46e5"
    : colors[Math.abs(message.userId.length) % colors.length];

  const isImage =
    typeof message.content === "string" &&
    message.content.startsWith("data:image");

  return (
    <motion.div
      initial={{ y: 50, opacity: 0, scale: 0.8 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={` flex-col max-w-md ${isOwn ? "ml-auto" : "mr-auto"}`}
        style={{ transform: `rotate(${isOwn ? 0.5 : -0.5}deg)` }}
      >      <img
        src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${message.avatar.seed}`}
        alt={message.avatar.seed}
        className={`h-10 w-10 rounded-full ${isOwn ? "ml-auto" : "mr-auto"}}`}
      />
        {/* Username */}
        {!isOwn && (
          <p className="text-sm font-bold mb-1 ml-2" style={{ color }}>
            {message.userName}
          </p>
          
        )}

        {/* Bubble */}
        <SketchyCard color={color}>
          {isImage && (
            <img
              src={message.content}
              alt="Drawing"
              className="rounded-lg max-w-full"
            />
          )}
        </SketchyCard>

        {/* Timestamp */}
        <p className="text-xs text-gray-500 mt-1 ml-2">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </motion.div>
  );
};
