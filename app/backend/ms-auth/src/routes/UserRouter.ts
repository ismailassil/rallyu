import { FastifyInstance } from "fastify";
import UserController from "../controllers/UserController";
import RelationsController from "../controllers/RelationsContoller";
import Authenticate from "../middleware/Authenticate";
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from "path";
import { usersRoutesSchemas as schemas } from "../schemas/users.schema";
import { usersRoutesZodSchemas as zodSchemas } from "../schemas/zod/users.zod.schema";
import MatchesController from "../controllers/MatchesController";
import { zodPreHandler } from "../utils/validation/zodFormValidator";

async function userRouter(fastify: FastifyInstance, opts: {
	userController: UserController,
	relationsController: RelationsController,
	matchesController: MatchesController
}) {

	await fastify.register(fastifyMultipart, {
		limits: {
			files: 1,
			fileSize: 2 * 1024 * 1024,
			fields: 0
		}
	});

	await fastify.register(fastifyStatic, {
		root: path.join(process.cwd(), 'uploads'),
		prefix: '/avatars'
	});

	fastify.decorate('authenticate', Authenticate); // auth middleware for protected routes
	fastify.decorate('requireAuth', { preHandler: fastify.authenticate }); // preHandler hook
	fastify.decorateRequest('user', null);


	/*-------------------------------------------- AVAILABILITY --------------------------------------------*/
	fastify.get('/username-available', {
		schema: schemas.availability.username,
		handler: opts.userController.usernameAvailableHandler.bind(opts.userController)
	});
	fastify.get('/email-available', {
		schema: schemas.availability.email,
		handler: opts.userController.emailAvailableHandler.bind(opts.userController)
	});


	/*------------------------------------------------ USERS ------------------------------------------------*/
	fastify.get('/', {
		schema: schemas.users.fetch.byUsername,
		preHandler: fastify.authenticate,
		handler: opts.userController.fetchUserByUsernameQueryHandler.bind(opts.userController)
	});
	fastify.get('/:id', {
		schema: schemas.users.fetch.byId,
		preHandler: fastify.authenticate,
		handler: opts.userController.fetchUserHandler.bind(opts.userController)
	});
	fastify.put('/:id', {
		schema: schemas.users.update,
		preHandler: [
			fastify.authenticate,
			zodPreHandler(zodSchemas.users.update)
		],
		handler: opts.userController.updateUserHandler.bind(opts.userController)
	});
	fastify.delete('/:id', {
		schema: schemas.users.delete,
		preHandler: fastify.authenticate,
		handler: opts.userController.deleteUserHandler.bind(opts.userController)
	});

	fastify.get('/leaderboard', {
		schema: schemas.users.fetch.leaderboard,
		preHandler: fastify.authenticate,
		handler: opts.userController.fetchRankLeaderboardHandler.bind(opts.userController)
	});
	fastify.get('/:id/matches', {
		schema: schemas.users.fetch.matches,
		preHandler: fastify.authenticate,
		handler: opts.userController.fetchUserMatchesHandler.bind(opts.userController)
	});
	fastify.get('/:id/analytics', {
		schema: schemas.users.fetch.byId,
		preHandler: fastify.authenticate,
		handler: opts.userController.fetchUserAnalyticsHandler.bind(opts.userController)
	});
	fastify.get('/:id/analytics-by-day', {
		schema: schemas.users.fetch.byId,
		preHandler: fastify.authenticate,
		handler: opts.userController.fetchUserAnalyticsByDayHandler.bind(opts.userController)
	});

	fastify.post('/:id/avatar', {
		schema: schemas.users.fetch.byId,
		preHandler: fastify.authenticate,
		handler: opts.userController.uploadAvatarHandler.bind(opts.userController)
	});

	fastify.get('/lookup', {
		schema: schemas.users.fetch.search,
		preHandler: fastify.authenticate,
		handler: opts.userController.lookupUsersHandler.bind(opts.userController)
	});



	/*-------------------------------------------- USER RELATIONS --------------------------------------------*/
	fastify.get('/friends', {
		preHandler: fastify.authenticate,
		handler: opts.relationsController.fetchFriendsHandler.bind(opts.relationsController)
	});
	fastify.get('/blocked', {
		preHandler: fastify.authenticate,
		handler: opts.relationsController.fetchBlockedHandler.bind(opts.relationsController)
	});
	fastify.get('/friends/requests/incoming', {
		preHandler: fastify.authenticate,
		handler: opts.relationsController.fetchIncomingFriendRequestsHandler.bind(opts.relationsController)
	});
	fastify.get('/friends/requests/outgoing', {
		preHandler: fastify.authenticate,
		handler: opts.relationsController.fetchOutgoingFriendRequestsHandler.bind(opts.relationsController)
	});

	fastify.post('/:targetUserId/friends/requests', {
		schema: schemas.relations.actions,
		preHandler: fastify.authenticate,
		handler: opts.relationsController.sendFriendRequestHandler.bind(opts.relationsController)
	});
	fastify.delete('/:targetUserId/friends/requests', {
		schema: schemas.relations.actions,
		preHandler: fastify.authenticate,
		handler: opts.relationsController.cancelFriendRequestHandler.bind(opts.relationsController)
	});
	fastify.put('/:targetUserId/friends/accept', {
		schema: schemas.relations.actions,
		preHandler: fastify.authenticate,
		handler: opts.relationsController.acceptFriendRequestHandler.bind(opts.relationsController)
	});
	fastify.put('/:targetUserId/friends/reject', {
		schema: schemas.relations.actions,
		preHandler: fastify.authenticate,
		handler: opts.relationsController.rejectFriendRequestHandler.bind(opts.relationsController)
	});
	fastify.delete('/:targetUserId/friends', {
		schema: schemas.relations.actions,
		preHandler: fastify.authenticate,
		handler: opts.relationsController.unfriendHandler.bind(opts.relationsController)
	});
	fastify.post('/:targetUserId/block', {
		schema: schemas.relations.actions,
		preHandler: fastify.authenticate,
		handler: opts.relationsController.blockUserHandler.bind(opts.relationsController)
	});
	fastify.delete('/:targetUserId/block', {
		schema: schemas.relations.actions,
		preHandler: fastify.authenticate,
		handler: opts.relationsController.unblockUserHandler.bind(opts.relationsController)
	});

	/*-------------------------------------------- EXTERNAL ENDPOINTS --------------------------------------------*/
	fastify.post('/matches', {
		schema: schemas.matches.internal.create,
		handler: opts.matchesController.createGameHandler.bind(opts.matchesController)
	});
}

export default userRouter;
