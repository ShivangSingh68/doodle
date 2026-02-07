
export interface User {
    id: string,
    name: string,
    avatar: Avatar,
    isAdmin?: boolean, 
}

export type MaxParticipants = 1 | 2 | 3 | 4 | 5;

export interface Avatar {
    seed: string,
}

export interface CreateRoom {
    type: "create-room",
    roomId: string,
    user: User,
    maxParticipant: MaxParticipants,
}

export interface JoinRoom {
    type: "join-room",
    roomId: string,
    user: User,
}

export interface DrawingMessage {
    type: "send-drawing",
    roomId: string,
    user: User,
    img: string,
    timestamp: number,
}

export interface LeaveRoom {
    type: "leave-room",
    roomId: string,
    userId: string,
}

export interface CreateRoomEvent {
    type: "room-created",
    roomId: string,
    user: User,
    timestamp?: number,
}

export interface UserJoinedEvent{
    type: "user-joined",
    roomId: string,
    user: User,
    timestamp?: number,
}

export interface UserLeftEvent {
    type: "user-left",
    roomId: string,
    userId: string,
    timestamp?: number,
}

export interface ErrorEvent {
    type: "error",
    code: "room-exists" | "room-full" | "not-found",
    message: string
    timestamp?: number,
}

export interface DrawingBroadcast {
    type: "drawing-broadcasted",
    roomId: string,
    user: User,
    img: string,
    timestamp?: number,
}

export interface RoomStateEvent {
  type: "room-state";
  roomId: string;
  users: User[];
  timestamp?: number,
}

export type IncomingMessage = CreateRoom | JoinRoom | DrawingMessage | LeaveRoom
export type OutgoingMessage = CreateRoomEvent | UserJoinedEvent | UserLeftEvent | DrawingBroadcast | ErrorEvent | RoomStateEvent;
export type WSMessage = IncomingMessage | OutgoingMessage;