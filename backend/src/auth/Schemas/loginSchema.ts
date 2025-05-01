const loginSchema = {
	$id: 'loginSchema',
	body: {
		type: 'object',
		properties: {
			username: { type: 'string', minLength: 3 },
			password: { type: 'string', minLength: 10 },
		},
		required: ['username', 'password'],
	},
	response: {
		200: { $ref: 'responseSchema#/properties/ok' },
	},
};

export default loginSchema;
