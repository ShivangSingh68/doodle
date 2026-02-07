import { useEffect, useState } from "react";
import type { IncomingMessage, User } from "../../../../ws/src/types/types";
import { DecorativeBackground } from "../DecorativeBackground";
import { ChatFeed } from "./ChatFeed";
import { MembersSidebar } from "./MemberSidebar";
import { ChatHeader } from "./ChatHeader";
import { CanvasComposer } from "./canvas";
import { useParams } from "react-router-dom";
import { useWs } from "../../utils/useWs";
import type { Message } from "../../types/types";
import { ChatRoomDialog } from "./ChatRoomDialog";
import { useLocation } from "react-router-dom";

export const ChatRoom = () => {
  const { roomId } = useParams();
  let currentUserId = sessionStorage.getItem("userId") ?? "";
  let currentUserName = sessionStorage.getItem("name") ?? "";
  let currentUserAvatar = sessionStorage.getItem("avatar") ?? "felix";

  const { send, lastMessage} = useWs();
  let location = useLocation();
  const [fromLanding, setFromLanding] = useState<boolean>(location.state?.fromLanding === true)
  const [members, setMembers] = useState<User[]>(location?.state?.members ?? []);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string>("");
  
  useEffect(() => {
    if (!lastMessage) return;

    const type = lastMessage.type;
    switch (type) {
      case "room-state":
        const prevMembers: User[] = [...lastMessage.users];
        setMembers(prevMembers);
        break;
      case "user-joined":
        const newMember: User = lastMessage.user;
        setMembers((prev: User[]) => [...prev, newMember]);
        break;
      case "user-left":
        const updatedMembers = members.filter(
          (x) => x.id !== lastMessage.userId,
        );
        setMembers(updatedMembers);
        break;
      case "drawing-broadcasted":
        const newMsg: Message = {
          userName: lastMessage.user.name,
          content: lastMessage.img,
          id: crypto.randomUUID(),
          userId: lastMessage.user.id,
          roomId: lastMessage.roomId,
          timestamp: lastMessage.timestamp!,
          avatar: lastMessage.user.avatar,
        };
        setMessages((prev) => [...prev, newMsg]);
        break;
      case "error":
        
        // alert("Room Not found");
        break;
    }
  }, [lastMessage]);

  const handleSendMessage = (img: string) => {
    if (!roomId) return;
    const user: User = {
      id: currentUserId!,
      name: currentUserName!,
      avatar: {
        seed: currentUserAvatar!,
      },
    };
    const data: IncomingMessage = {
      type: "send-drawing",
      roomId: roomId,
      user,
      img,
      timestamp: Date.now(),
    };
    send(data);
  };

  if (!fromLanding) {
    return (
      <>
        <ChatRoomDialog
          isOpen={!fromLanding}
          onClose={() => setFromLanding(true)}
          onSubmit={(name: string, avatar: string) => {
            sessionStorage.setItem("userId", crypto.randomUUID());
            sessionStorage.setItem("name", name);
            sessionStorage.setItem("avatar", avatar);

            setFromLanding(true);
            const user: User = {
              id: sessionStorage.getItem("userId")!,
              name,
              avatar: {
                seed: avatar,
              },
            };
            const data: IncomingMessage = {
              type: "join-room",
              roomId: roomId!,
              user,
            };
            send(data);
          }}
        />
        <DecorativeBackground />
      </>
    );
  }
  return (
    <div
      className="h-screen grid grid-cols-18 gap-4 overflow-hidden min-w-screen"
      style={{ fontFamily: "'Patrick Hand', 'Comic Sans MS', cursive" }}
    >
      <div className="absolute inset-0 -z-10 ">
        <DecorativeBackground />
      </div>
      <ChatHeader  roomId={roomId} />

      <MembersSidebar
        className="col-span-4 p-6 h-full bg-amber-100 rounded-lg"
        members={members}
      />

      <div className="grid grid-rows-6 col-start-5 col-end-19 w-full h-screen ">
        <div className="row-span-4">
          <ChatFeed messages={messages} currentUserId={currentUserId} />
        </div>
        <div className="relative  row-span-2 row-start rounded-md right-4">
          <CanvasComposer onSend={handleSendMessage} />
        </div>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap");

        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: #8b5cf6;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #7c3aed;
        }
      `}</style>
    </div>
  );
};
