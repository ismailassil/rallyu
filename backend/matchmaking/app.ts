import fastify from "fastify"

const serverOptions = {
    logger: true,
}

const app = fastify(serverOptions);

app.route({
    url: '/hello',
    method: "GET",
    handler: function myHandler(req, res) {
        
        res.send("World")
    }
});

app.get("/world", function handler(req, res) {

    return { helloFrom: this.server.address() }
})

export default app;