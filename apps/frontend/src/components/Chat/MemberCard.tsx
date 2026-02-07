import { motion } from "framer-motion";
import { SketchyCard } from "./SketchyCard";
import type { User } from "../../../../ws/src/types/types";

interface MemberCardProps {
    member: User,
    index: number,
}
export const MemberCard: React.FC<MemberCardProps> = ({ member, index }) => {
  const colors = ['#ec4899', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981'];
  const color = colors[index % colors.length];
  
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 150 }}
      whileHover={{ scale: 1.05, rotate: 2 }}
      style={{ transform: `rotate(${Math.random() * 2 - 1}deg)` }}
    >
      <SketchyCard color={color} className="mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: color }}
          >
              <img
              src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${member.avatar.seed}`}
              alt={member.avatar.seed}
              
            />
          </div>
          <div className="flex-1">
            <p className="font-bold text-[#1f2937]">{member.name}</p>
            <p className="text-xs font-medium" style={{ color }}>
              {member.isAdmin ? 'Admin' : 'Member'}
            </p>
          </div>
        </div>
      </SketchyCard>
    </motion.div>
  );
};