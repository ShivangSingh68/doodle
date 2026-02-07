import { useNavigate } from "react-router-dom";
import { CreateRoomDialog } from "./CreateRoomDialog";
import { JoinRoomDialog } from "./JoinRoomDialog";
import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import { motion } from "framer-motion";
import { SketchButton } from "../SketchButton";
import type {
  IncomingMessage,
  MaxParticipants,
  User,
} from "../../../../ws/src/types/types";
import { useWs } from "../../utils/useWs";

export const LandingPage: React.FC = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const heroCanvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const { send, lastMessage } = useWs();
  const userIdRef = useRef<string>(
    sessionStorage.getItem("userId") ?? crypto.randomUUID(),
  );

  useEffect(() => {
    sessionStorage.setItem("userId", userIdRef.current);
  }, []);

  useEffect(() => {
    if (heroCanvasRef.current) {
      const rc = rough.canvas(heroCanvasRef.current);
      const width = heroCanvasRef.current.width;
      const height = heroCanvasRef.current.height;

      rc.rectangle(15, 15, width - 30, height - 30, {
        roughness: 2.8,
        strokeWidth: 6,
        stroke: "#EC4899",
        fill: "rgba(254, 243, 199, 0.95)",
        fillStyle: "solid",
      });
    }
  }, []);

  useEffect(() => {
    if (!lastMessage) return;

    console.log("WS message:", lastMessage);

    switch (lastMessage.type) {
      case "room-created":
      case "room-state":
        navigate((`/chat/${lastMessage.roomId}`),{
          state: {fromLanding: true,
            members: lastMessage.type === "room-state" ? lastMessage.users : []
          },
          },
        );
        break;

      case "error":
        // alert(
        //   lastMessage.code === "not-found" ? "Room not found" : "Room full",
        // );
        break;
    }
  }, [lastMessage, navigate]);

  const handleCreateRoomWS = (
    roomId: string,
    name: string,
    maxParticipants: MaxParticipants,
    avatar: string,
  ) => {
    const user: User = {
      id: userIdRef.current,
      name,
      avatar: {
        seed: avatar,
      },
      isAdmin: true,
    };

    const data: IncomingMessage = {
      type: "create-room",
      maxParticipant: maxParticipants,
      roomId,
      user,
    };
    send(data);
  };

  const handleJoinRoomWS = (roomId: string, name: string, avatar: string) => {
    const user: User = {
      id: userIdRef.current,
      name,
      avatar: {
        seed: avatar,
      },
    };
    const data: IncomingMessage = {
      type: "join-room",
      roomId,
      user,
    };
    send(data);
  };

  const handleCreateRoom = (
    name: string,
    maxParticipants: MaxParticipants,
    avatar: string,
  ) => {
    const newRoomId = crypto.randomUUID();
    setRoomId(newRoomId);
    sessionStorage.setItem("avatar", avatar);
    sessionStorage.setItem("name", name);

    setShowCreateDialog(false);
    handleCreateRoomWS(newRoomId, name, maxParticipants, avatar);
  };

  const handleJoinRoom = (roomId: string, name: string, avatar: string) => {
    setRoomId(roomId);
    sessionStorage.setItem("avatar", avatar);
    sessionStorage.setItem("name", name);

    setShowJoinDialog(false);
    handleJoinRoomWS(roomId, name, avatar);
  };

  if (roomId) {
    return (
        <JoinRoomDialog
        isOpen={true}
        onClose={() => setShowJoinDialog(false)}
        onSubmit={handleJoinRoom}
        //@ts-ignore
        errorMessage={`${lastMessage?.code === "not-found" ? "Room not found" : "Room full"}`}
      />
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-1 ">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring", damping: 12 }}
            className="relative max-w-3xl w-180"
          >
            {/* HERO CANVAS */}
            <canvas
              ref={heroCanvasRef}
              width={720}
              height={560}
              className="absolute inset-0 pointer-events-none "
              style={{ transform: "rotate(-1deg) " }}
            />

            {/* HERO CONTENT */}
            <div className="relative px-14 py-16 text-center">
              <motion.h1
                className="text-7xl text-purple-600 mb-6 font-bold leading-tight"
                style={{
                  transform: "rotate(-2deg)",
                  textShadow: "4px 4px 0 #EC4899, 8px 8px 0 #FCD34D",
                }}
                animate={{ rotate: [-2, 1, -2] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                DrawChat! 🎨✨
              </motion.h1>

              <p
                className="text-2xl text-purple-800 mb-14 leading-relaxed font-bold"
                style={{ transform: "rotate(1deg)" }}
              >
                Create rooms, doodle together, and chat in real-time with
                friends!
              </p>

              <div className="flex gap-9 justify-center flex-wrap flex-col items-center">
                <SketchButton
                  onClick={() => setShowCreateDialog(true)}
                  color="#8B5CF6"
                >
                  Create Room
                </SketchButton>
                <SketchButton
                  onClick={() => setShowJoinDialog(true)}
                  color="#14B8A6"
                >
                  Join Room
                </SketchButton>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <CreateRoomDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSubmit={handleCreateRoom}
      />

      <JoinRoomDialog
        isOpen={showJoinDialog}
        onClose={() => setShowJoinDialog(false)}
        onSubmit={handleJoinRoom}
      />
    </>
  );
};
