import { Room } from "./Room";
import { MaxParticipants, User } from "./types/types";
import { WebSocket } from "ws";

export class RoomManager {
    static instance: RoomManager;
    private rooms: Map<string, Room>;
    private constructor() {
        this.rooms = new Map<string, Room>();
    }
    static getInstance(): RoomManager{
        if(!this.instance) {
            this.instance = new RoomManager();
        }

        return this.instance;
    }

    createRoom(roomId: string, maxParticipants: MaxParticipants, admin: User, adminWs: WebSocket): boolean {
        try {
            let room: Room = new Room(maxParticipants);
            room.addUser(admin, adminWs);
            room.setAdmin(admin.id);
            if(!this.rooms.has(roomId)){
                this.rooms.set(roomId, room);
                return true;
            }
            else {
                throw new Error("Room with same roomId already exists");
            }
        } catch (error) {
            console.log("Error Creating Room: ", error);
            return false;
        }
    }

    getRoom(roomId: string) {
        if(!roomId || roomId.trim() === "")
            return;
        if(this.rooms.has(roomId)) {
            return this.rooms.get(roomId);
        }
        return;
    }

    deleteRoom(roomId: string): boolean {
        if(!roomId || roomId.trim() === "") {
            return false;
        }

        if(this.rooms.has(roomId)) {
            this.rooms.delete(roomId);
            return true;
        }
        return false;
    }

    cleanup() {
        this.rooms.forEach((room: Room, roomId: string) => {
            if(room.isEmpty()) {
                this.rooms.delete(roomId);
            }   
        })
    }
}