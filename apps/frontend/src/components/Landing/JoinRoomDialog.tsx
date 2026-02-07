import { useState } from "react";
import { AvatarPicker } from "../AvatarPicker";
import { Dialog } from "./Dialog";
import { SketchButton } from "../SketchButton";


export const JoinRoomDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (roomId: string, name: string, avatar: string) => void;
  errorMessage?: string; // 👈 NEW
}> = ({ isOpen, onClose, onSubmit, errorMessage }) => {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState(sessionStorage.getItem("name") ?? "");
  const [avatar, setAvatar] = useState(
    sessionStorage.getItem("avatar") ?? "Felix"
  );

  const handleSubmit = () => {
    if (name.trim() && roomId.trim()) {
      onSubmit(roomId, name, avatar);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Join Room 🚪">
      <div>
        {/* ROOM ID */}
        <div className="mb-2">
          <label className="text-lg text-purple-800 mb-2 block font-bold">
            Room ID
          </label>

          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className={`
              w-full p-3 text-lg rounded-lg outline-none font-bold
              bg-amber-50
              border-3
              ${
                errorMessage
                  ? "border-red-500 text-red-700"
                  : "border-purple-500 text-red-600"
              }
            `}
            style={{ transform: "rotate(0.5deg)" }}
            placeholder="Enter room ID..."
          />

          {/* 🔴 ERROR MESSAGE */}
          {errorMessage && (
            <p
              className="mt-2 text-sm font-bold text-red-600"
              style={{ transform: "rotate(-0.5deg)" }}
            >
              ⚠ {errorMessage}
            </p>
          )}
        </div>

        {/* NAME */}
        <div className="mb-4">
          <label className="text-lg text-purple-800 mb-2 block font-bold">
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="
              w-full p-3 text-lg border-3 border-purple-500
              rounded-lg bg-amber-50 outline-none text-red-600 font-bold
            "
            style={{ transform: "rotate(-0.5deg)" }}
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
