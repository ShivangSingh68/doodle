import { AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import type { Message } from "../../types/types";

interface ChatFeedProps {
    messages: Message[],
    currentUserId: string
}
export const ChatFeed: React.FC<ChatFeedProps> = ({ messages, currentUserId }) => {
  const feedRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages]);
  
  return (
    <div 
      ref={feedRef}
      className="h-full overflow-y-auto px-6 py-4"
      style={{ 
        scrollbarWidth: 'thin',
        scrollbarColor: '#8b5cf6 transparent'
      }}
    >
      <AnimatePresence>
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.userId === currentUserId}
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};