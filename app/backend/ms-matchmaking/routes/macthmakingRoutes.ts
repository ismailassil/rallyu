import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const matchmakingRoutes = async function (app: FastifyInstance) {

    app.post("/join", function (req: FastifyRequest<{ Body: { id: number } }>, rep: FastifyReply) {
        const id: number = req.body.id;
        
       console.log(req.body.id);

        rep.code(201).send({ data: { id, state: "waiting" }, status: true });
    });
}

export default matchmakingRoutes;