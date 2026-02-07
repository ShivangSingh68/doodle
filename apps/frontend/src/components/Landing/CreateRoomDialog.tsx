import { useState } from "react";
import type { MaxParticipants } from "../../../../ws/src/types/types";
import { Dialog } from "./Dialog";
import { AvatarPicker } from "../AvatarPicker";
import { SketchButton } from "../SketchButton";

export const CreateRoomDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, maxParticipants: MaxParticipants, avatar: string) => void;
}> = ({ isOpen, onClose, onSubmit}) => {
  const [name, setName] = useState(sessionStorage.getItem("name") ?? "");
  const [maxParticipants, setMaxParticipants] = useState<MaxParticipants>(4);
  const [avatar, setAvatar] = useState(sessionStorage.getItem("avatar") ?? 'Felix');

  
  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name, maxParticipants, avatar);
      setName('');
      setMaxParticipants(4);
      setAvatar('Felix');
    }
  };
  
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Create Room 🎨">
      <div>
        <div className="mb-4">
          <label className="text-lg text-purple-800 mb-2 block font-bold">
            Your Name
          </label>
          <input
            type="text"
            value={name}
            spellCheck={false}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 text-lg border-3 border-purple-500 rounded-lg bg-amber-50 outline-none text-red-600 font-bold"
            style={{ transform: 'rotate(-0.5deg)' }}
            placeholder="Enter your name..."
          />
        </div>
        
        <div className="mb-4">
          <label className="text-lg text-purple-800 mb-2 block font-bold">
            Max Participants (1-5)
          </label>
          <input
            type="number"
            min="1"
            max="5"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(Math.min(5, Math.max(1, parseInt(e.target.value) || 1)) as MaxParticipants)}
            className="w-full p-3 text-lg border-3 border-purple-500 rounded-lg bg-amber-50 outline-none text-red-600 font-bold"
            style={{ transform: 'rotate(0.5deg)' }}
          />
        </div>
        
        <AvatarPicker selected={avatar} onSelect={setAvatar} />
        
        <div className="flex gap-4 justify-center mt-5">
          <SketchButton onClick={handleSubmit} color="#10B981">
            Create!
          </SketchButton>
          <SketchButton onClick={onClose} color="#EF4444">
            Cancel
          </SketchButton>
        </div>
      </div>
    </Dialog>
  );
};