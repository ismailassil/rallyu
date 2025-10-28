import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { pongInterfaceSchema, xoInterfaceSchema } from "../schemas/schemas";
import { roomManager, userSessions } from "../room/roomManager";
import { TicTacToeRoom } from "../room/ticTacToeRoom";
import { PingPongRoom } from "../room/pingPongRoom";

const apiInterface = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {

    fastify.patch('/pingpong/:roomid/:userid/move/:dir', { schema: pongInterfaceSchema }, (req: FastifyRequest, res: FastifyReply) => {
		const { roomid, userid, dir } = req.params as { roomid: string, userid: number, dir: "up" | "down" | "still" };
		const room = roomManager.getRoom(roomid) as PingPongRoom;
		if (!room) {
			return res.code(404).send({
				message: 'no active rooms with the specified ID currently active'
			})
		}

        const session = userSessions.get(userid);
        if (!session) {
            return res.code(404).send({
                message: 'user not currently in an active room'
            })
        }

        if (session !== room.id) {
            return res.code(400).send({
                message: "user session doesn't match the provided room ID"
            })
        }

        const useridHeader = Number(req.headers['x-user-id']);
        if (!useridHeader || useridHeader !== userid) {
            return res.code(403).send({
                message: "userid doesn't match the access token's userid"
            })
        }

        const index = room.players.find(p => p.id === userid)?.index;
        room.state.players[index!].movement = dir;
	})

    fastify.patch('/tictactoe/:roomid/:userid/mark/:cellnum', { schema: xoInterfaceSchema }, (req, res) => {
		const { roomid, userid, cellnum } = req.params as { roomid: string, userid: number, cellnum: number };
		const room = roomManager.getRoom(roomid) as TicTacToeRoom;
		if (!room) {
			return res.code(404).send({
				message: 'no active rooms with the specified ID currently active'
			})
		}

        const session = userSessions.get(userid);
        if (!session) {
            return res.code(404).send({
                message: 'user not currently in an active room'
            })
        }

        if (session !== room.id) {
            return res.code(400).send({
                message: "user session doesn't match the provided room ID"
            })
        }

        const useridHeader = Number(req.headers['x-user-id']);
        if (!useridHeader || useridHeader !== userid) {
            return res.code(403).send({
                message: "params userid doesn't match the access-token's userid"
            })
        }

        const sign = room.players.find(player => player.id === userid)!.sign;
        room.playMove(cellnum, sign);
	})
}

export default apiInterface;