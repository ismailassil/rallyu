import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import UserController from "../controllers/userController";
import StatsController from "../controllers/statsController";
import RelationsController from "../controllers/userRelationsContoller";
import RelationsRepository from "../repositories/relationsRepository";
import { matchesRequestSchema, relationsRequestSchema, statsRequestSchema, userMatchesSchema, userProfileSchema, userUpdateSchema } from "../schemas/users.schema";
import Authenticate from "../middleware/Authenticate";
import MatchesRepository from "../repositories/matchesRepository";
import multipart from '@fastify/multipart';

async function userRouter(fastify: FastifyInstance) {
	const userController: UserController = new UserController();
	const statsController: StatsController = new StatsController();
	const relationsController: RelationsController = new RelationsController();
	const relRepo: RelationsRepository = new RelationsRepository();
	const statsRepo: MatchesRepository = new MatchesRepository();

	await fastify.register(multipart, {
		limits: {
			files: 1,
			fileSize: 2 * 1024 * 1024,
			fields: 0
		}
	});

	fastify.decorate('authenticate', Authenticate); // auth middleware for protected routes
	fastify.decorate('requireAuth', { preHandler: fastify.authenticate }); // preHandler hook
	fastify.decorateRequest('user', null);

	fastify.get('/available', userController.UsernameEmailAvailable.bind(userController));

	/*-------------------------------------------- USER MANAGEMENT --------------------------------------------*/
	fastify.get('/me', {
		// schema: userProfileSchema,
		preHandler: fastify.authenticate,
		handler: userController.fetchMe.bind(userController)
	});

	fastify.get('/:username', {
		schema: userProfileSchema,
		preHandler: fastify.authenticate,
		handler: userController.getUser.bind(userController)
	});
	
	fastify.put('/:username', {
		schema: userProfileSchema,
		preHandler: fastify.authenticate,
		handler: userController.updateUser.bind(userController)
	});
	
	fastify.delete('/:username', {
		schema: userProfileSchema,
		preHandler: fastify.authenticate,
		handler: userController.deleteUser.bind(userController)
	});
	
	fastify.get('/:username/stats', {
		schema: userProfileSchema,
		preHandler: fastify.authenticate,
		handler: userController.getUserStats.bind(userController)
	});
	
	fastify.get('/:username/matches', {
		schema: userMatchesSchema,
		preHandler: fastify.authenticate,
		handler: userController.getUserMatches.bind(userController)
	});

	fastify.post('/:username/avatar', {
		preHandler: fastify.authenticate,
		handler: userController.uploadAvatar.bind(userController)
	});


	/*-------------------------------------------- USER RELATIONS --------------------------------------------*/

	fastify.post('/:user_id/friends/requests', {
		preHandler: fastify.authenticate,
		schema: relationsRequestSchema,
		handler: relationsController.sendFriendRequest.bind(relationsController)
	});

	fastify.delete('/:user_id/friends/requests', {
		preHandler: fastify.authenticate,
		schema: relationsRequestSchema,
		handler: relationsController.cancelFriendRequest.bind(relationsController)
	});

	fastify.put('/:user_id/friends/accept', {
		preHandler: fastify.authenticate,
		schema: relationsRequestSchema,
		handler: relationsController.acceptFriendRequest.bind(relationsController)
	});

	fastify.put('/:user_id/friends/reject', {
		preHandler: fastify.authenticate,
		schema: relationsRequestSchema,
		handler: relationsController.acceptFriendRequest.bind(relationsController)
	});

	fastify.delete('/:user_id/friends', {
		preHandler: fastify.authenticate,
		schema: relationsRequestSchema,
		handler: relationsController.unfriend.bind(relationsController)
	});

	fastify.post('/:user_id/block', {
		preHandler: fastify.authenticate,
		schema: relationsRequestSchema,
		handler: relationsController.blockUser.bind(relationsController)
	});

	fastify.delete('/:user_id/block', {
		preHandler: fastify.authenticate,
		schema: relationsRequestSchema,
		handler: relationsController.unblockUser.bind(relationsController)
	});

	// fastify.get('/me/friends', {
	// 	preHandler: fastify.authenticate,
	// 	schema: relationsRequestSchema,
	// 	handler: relationsController.unblockUser.bind(relationsController)
	// });

	// fastify.get('/me/blocked', {
	// 	preHandler: fastify.authenticate,
	// 	schema: relationsRequestSchema,
	// 	handler: relationsController.unblockUser.bind(relationsController)
	// });

	// fastify.get('/me/friends/requests/incoming', {
	// 	preHandler: fastify.authenticate,
	// 	schema: relationsRequestSchema,
	// 	handler: relationsController.unblockUser.bind(relationsController)
	// });

	// fastify.get('/me/friends/requests/outgoing', {
	// 	preHandler: fastify.authenticate,
	// 	schema: relationsRequestSchema,
	// 	handler: relationsController.unblockUser.bind(relationsController)
	// });




	// fastify.delete('/relations', async () => {
	// 	await relRepo.clean();
	// });

	// USER MANAGEMENT (admin or self-service)
	// GET /users — List users (admin only)
	// POST /users — Create user (admin creating users directly)
	// GET /users/:id — Get user by ID
	// PUT /users/:id — Full update of user info
	// PATCH /users/:id — Partial update of user info
	// DELETE /users/:id — Delete user

	// POST /reset-password/setup - Reset password (check if a account exists + send OTP to email)
	// POST /reset-password/verify - Check if OTP is valid
	// POST /reset-password/update - Update password

	// ACCOUNT MANAGEMENT (self-service)
	// GET /account — Get own profile (alias for /auth/me)
	// PATCH /account — Update own profile
	// DELETE /account — Delete own account (optional)
}

export default userRouter;