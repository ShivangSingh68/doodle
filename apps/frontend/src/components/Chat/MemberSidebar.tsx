import type { User } from "../../../../ws/src/types/types";
import { MemberCard } from "./MemberCard";
import { SketchyCard } from "./SketchyCard";
import {motion} from "framer-motion"

interface MembersSidebarProps {
    members: User[]
    className?: string
}
export const MembersSidebar: React.FC<MembersSidebarProps> = ({ members, className = "" }) => {
  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`m-4 left-4 top-24 bottom-4 w-full overflow-y-auto backdrop-blur-md  ${className}`}
      style={{ 
        scrollbarWidth: 'thin',
        scrollbarColor: '#ec4899 transparent'
      }}
    >
      <SketchyCard color="#8b5cf6" className="mb-4 ">
        <h3 className="text-xl font-bold text-[#1f2937] mb-2">Room Members</h3>
        <p className="text-sm text-gray-600">{members?.length ?? 0} online</p>
      </SketchyCard>
      
      {members?.map((member, index) => (
        <MemberCard key={member.id} member={member} index={index} />
      ))}
    </motion.div>
  );
};