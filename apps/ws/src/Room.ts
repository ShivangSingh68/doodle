import { WebSocket } from "ws";
import { User, MaxParticipants, WSMessage, IncomingMessage} from "./types/types";

export class Room {
    private clients: Map<string, {user: User, ws: WebSocket}>;
    private adminId!: string;
    private maxParticipants: MaxParticipants;

    constructor(maxParticipants: MaxParticipants) {
        this.clients = new Map<string, {user: User, ws: WebSocket}>();
        this.maxParticipants = maxParticipants
    }

    addUser(user: User, ws: WebSocket): boolean {
        if(this.clients.size >= this.maxParticipants) return false;
        if(!this.clients.has(user.id)) {
            this.clients.set(user.id, {user, ws});
            return true;
        }
        return false;
    }

    removeUser(userId: string): boolean {
        if(this.clients.has(userId)) {
            this.clients.delete(userId);
            return true;
        }
        return false;
    }

    getAdmin() {
        return this.clients.get(this.adminId)?.user;
    }

    setAdmin( newAdminId: string) {
        this.adminId = newAdminId;
    }

    isEmpty() {
        return this.clients.size === 0;
    }

    getUsers() {
        return [...this.clients.values()].map(c => c.user);
    }
    broadcast(msg: WSMessage, exceptUserId?: string) {
        this.clients.forEach(({user, ws}) => {
            if(user.id !== exceptUserId)
                ws.send(JSON.stringify(msg));
        })
    }
}