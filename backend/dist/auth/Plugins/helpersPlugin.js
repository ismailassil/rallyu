import fp from 'fastify-plugin';
const helpersPlugin = fp(async function (fastify) {
    fastify.decorate('isEmpty', function (...vargs) {
        for (let i = 0; i < vargs.length; i++) {
            if (!vargs[i] || vargs[i].length === 0) {
                return true;
            }
        }
        return false;
    });
});
export default helpersPlugin;
