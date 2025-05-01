import AuthController from '../Controllers/AuthControllers.js';
import loginSchema from '../Schemas/loginSchema.js';
import registerSchema from '../Schemas/registerSchema.js';
const routes = {
    login: '/login',
    register: '/register',
    logout: '/logout',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    verifyEmail: '/verify-email',
    changePassword: '/change-password',
};
async function authRoutes(fastify) {
    const authController = new AuthController();
    fastify.post(routes.login, { schema: loginSchema }, authController.login.bind(authController));
    fastify.post(routes.register, { schema: registerSchema }, authController.register.bind(authController));
    fastify.post(routes.logout, { preHandler: fastify.jwtAuth }, authController.logout.bind(authController));
    fastify.post(routes.verifyEmail, authController.verifyEmail.bind(authController));
    fastify.post(routes.forgotPassword, authController.forgotPassword.bind(authController));
    fastify.post(routes.changePassword, authController.changePassword.bind(authController));
}
export default authRoutes;
