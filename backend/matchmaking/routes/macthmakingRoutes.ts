import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const matchmakingRoutes = async function (app: FastifyInstance) {

    app.post("/join", function (req: FastifyRequest<{ Body: { id:number } }>, rep: FastifyReply) {
        const id: number = req.body.id;

        

        rep.send(JSON.stringify({id, status: "waiting"}));
    });


}

export default matchmakingRoutes;