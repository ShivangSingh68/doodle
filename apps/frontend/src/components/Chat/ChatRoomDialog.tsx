import { useState } from "react";
import { AvatarPicker } from "../AvatarPicker";
import { SketchButton } from "../SketchButton";
import { Dialog } from "../Landing/Dialog";


export const ChatRoomDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, avatar: string) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [roomId, setRoomId] = useState('');
  const [name, setName] = useState(sessionStorage.getItem("name") ?? '');
  const [avatar, setAvatar] = useState(sessionStorage.getItem("avatar") ??'Felix');
  
  const handleSubmit = () => {
    if (name.trim() && avatar.trim()) {
      onSubmit(name, avatar);
      setRoomId('');
      setName('');
      setAvatar('Felix');
    }
  };
  
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Join Room 🚪">
      <div>
        <div className="mb-4">
          <label className="text-lg text-purple-800 mb-2 block font-bold">
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 text-lg border-3 border-purple-500 rounded-lg bg-amber-50 outline-none text-red-600 font-bold"
            style={{ transform: 'rotate(-0.5deg)' }}
            placeholder="Enter your name..."
          />
        </div>
        
        <AvatarPicker selected={avatar} onSelect={setAvatar} />
        
        <div className="flex gap-4 justify-center mt-5">
          <SketchButton onClick={handleSubmit} color="#10B981">
            Join!
          </SketchButton>
          <SketchButton onClick={onClose} color="#EF4444">
            Cancel
          </SketchButton>
        </div>
      </div>
    </Dialog>
  );
};