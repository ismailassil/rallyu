import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import { ZodSchema } from "zod";

function zodFormValidationHandler(zodSchema: ZodSchema) {
	return async function (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) {
		try {
			const zodResult = zodSchema.safeParse(request.body);
			if (!zodResult.success) {
				const zodErrors = zodResult.error.flatten(); // fieldErrors, formErrors
				return reply.status(400).send({
					success: false,
					error: {
						code: 'VALIDATION_ERROR',
						message: 'Invalid request data',
						details: zodErrors
					}
				});
			}

			request.body = zodResult.data; // assign the parsed and validated data back to request.body

			done();
		} catch (err) {
			done(err as Error);
		}
	}
}

// i could enahnce this to accept options for different parts of the request (body, query, params, headers)
// currently only supports body validation
export function zodFormValidator(zodSchema: ZodSchema) {
	return { preHandler: zodFormValidationHandler(zodSchema) };
}
