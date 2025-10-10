// import TicTacToeRoom from '../tictactoe/ticTacToeRoom'
import { PingPongRoom } from '../pingpong/pingPongRoom'
import { v4 as uuidv4 } from 'uuid'
import type { Room } from '../types/types'
import { TicTacToeRoom } from '../tictactoe/ticTacToeRoom';

class RoomManager {
    private rooms: Map<string, Room<any, any>>;

    constructor() {
        this.rooms = new Map<string, Room<any, any>>() // <roomid, room>
    }

    createRoom(type: string, mode: string): { roomid: string, room: Room<any, any> } {
        const roomid = uuidv4();
        const room = type === 'pingpong'
            ? new PingPongRoom(roomid, mode)
            : new TicTacToeRoom(roomid, mode);

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