// import TicTacToeRoom from '../tictactoe/ticTacToeRoom'
import { PingPongRoom } from './pingPongRoom'
import { v4 as uuidv4 } from 'uuid'
import type { GameMode, Room } from '../types/types'
import { TicTacToeRoom } from './ticTacToeRoom';

class RoomManager {
    private rooms: Map<string, Room<any, any>>;

    constructor() {
        this.rooms = new Map<string, Room<any, any>>() // <roomid, room>
    }

    createRoom(type: string, mode: GameMode): { roomid: string, room: Room<any, any> } {
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