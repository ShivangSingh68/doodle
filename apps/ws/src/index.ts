import { WebSocket } from "ws";
import { RoomManager } from "./RoomManager";
import { IncomingMessage, OutgoingMessage } from "./types/types";

const wss = new WebSocket.Server({ port: 8080 });
const roomManager = RoomManager.getInstance();
type SocketMeta = {
  roomId?: string;
  userId?: string;
};
const socketMeta = new WeakMap<WebSocket, SocketMeta>();

wss.on("connection", (ws: WebSocket) => {
  console.log("✅ Client connected");
  socketMeta.set(ws, {});
  ws.on("message", (raw) => {
    const msg = JSON.parse(raw.toString()) as IncomingMessage;
    if (msg.type === "create-room") {
      const { roomId, user, maxParticipant } = msg;

      const created = roomManager.createRoom(roomId, maxParticipant, user, ws);
      const room = roomManager.getRoom(roomId);
      if (created && room) {
        const data: OutgoingMessage = {
          type: "room-created",
          roomId,
          user,
        };
        socketMeta.set(ws, { roomId, userId: user.id });
        ws.send(JSON.stringify(data));
        ws.send(JSON.stringify({
            type: "room-state",
            roomId,
            users: room.getUsers(),
        }))
        return;
      }
      const data: OutgoingMessage = {
        type: "error",
        code: "room-exists",
        message: "Failed to create room",
      };
      ws.send(JSON.stringify(data));
    }

    if (msg.type === "join-room") {
      const { roomId, user } = msg;
      const room = roomManager.getRoom(roomId);
      if (room) {
        const added = room.addUser(user, ws);
        if (added) {
          const data: OutgoingMessage = {
            type: "user-joined",
            roomId,
            user,
          };
          socketMeta.set(ws, { roomId, userId: user.id });
          room.broadcast(data, user.id);
          ws.send(
            JSON.stringify({
              type: "room-state",
              roomId,
              users: room.getUsers(),
            }),
          );
          return;
        } else {
          const data: OutgoingMessage = {
            type: "error",
            code: "room-full",
            message: "Room is full",
          };
          ws.send(JSON.stringify(data));
          return;
        }
      }
      const data: OutgoingMessage = {
        type: "error",
        code: "not-found",
        message: "Room not found",
      };
      ws.send(JSON.stringify(data));
    }

    if (msg.type === "leave-room") {
      const { roomId, userId } = msg;
      const room = roomManager.getRoom(roomId);
      if (room) {
        const removed = room.removeUser(userId);
        if (removed) {
          const data: OutgoingMessage = {
            type: "user-left",
            roomId,
            userId,
          };
          room.broadcast(data, userId);
          return;
        }
      }
      const data: OutgoingMessage = {
        type: "error",
        code: "not-found",
        message: "Failed to remove user",
      };
      ws.send(JSON.stringify(data));
    }

    if (msg.type === "send-drawing") {
      const { roomId, user, img, timestamp } = msg;
      const room = roomManager.getRoom(roomId);
      if (room) {
        const data: OutgoingMessage = {
          type: "drawing-broadcasted",
          user,
          roomId,
          img, 
          timestamp
        };
        room.broadcast(data);
        return;
      }

      const data: OutgoingMessage = {
        type: "error",
        code: "not-found",
        message: "Failed to broadcast drawing",
      };
      ws.send(JSON.stringify(data));
    }
  });
  ws.on("close", () => {
    const { roomId, userId } = socketMeta.get(ws)!;
    if (!userId || !roomId) return;
    const room = roomManager.getRoom(roomId);
    room?.removeUser(userId);
    const data: OutgoingMessage = {
      type: "user-left",
      roomId,
      userId,
    };
    room?.broadcast(data, userId);
    if (room?.isEmpty()) {
      roomManager.deleteRoom(roomId);
    }
  console.log("❌ Client disconnected");
    socketMeta.delete(ws);
  });
});
