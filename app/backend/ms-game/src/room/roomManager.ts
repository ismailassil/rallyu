// import TicTacToeRoom from '../tictactoe/ticTacToeRoom'
import { PingPongRoom } from './pingPongRoom'
import { v4 as uuidv4 } from 'uuid'
import type { Room } from '../types/types'
import { TicTacToeRoom } from './ticTacToeRoom';

export const userSessions = new Map<number, string>() // Map<userid, roomid>

export const closeRoom = (room: Room<any, any>, code: number, msg: string): void => {
	room.players.forEach(p => {
		userSessions.delete(p.id);
		if (p.socket?.readyState === WebSocket.OPEN)
			p.socket.close(code, msg);
	})
	room.cleanUp();
	roomManager.deleteRoom(room.id);
}

class RoomManager {
    private rooms: Map<string, Room<any, any>>;

    constructor() {
        this.rooms = new Map<string, Room<any, any>>() // <roomid, room>
    }

    createRoom(type: string): { roomid: string, room: Room<any, any> } {
        const roomid = uuidv4();
        const room = type === 'pingpong'
            ? new PingPongRoom(roomid)
            : new TicTacToeRoom(roomid);

        this.rooms.set(roomid, room);
        return { roomid, room };
    }

    deleteRoom(id: string) {
        this.rooms.delete(id);
    }

    getRoom(id: string) {
        return (this.rooms.get(id));
    }
}

export const roomManager = new RoomManager();