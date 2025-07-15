const fetchSchema = {
	$id: 'fetchSchema',
	params: {
		type: 'object',
		properties: {
			username: { type: 'string' },
		},
		required: ['username'],
	},
	querystring: {
		type: 'object',
		properties: {
			page: { type: 'number', minimum: 1 },
		},
		required: ['page'],
	},
	response: {
		200: {
			type: 'object',
			properties: {
				status: { type: 'string' },
				message: { type: 'string' },
				data: { type: ['array', 'object'] },
			},
			required: ['status', 'message', 'data'],
		},
		500: {
			type: 'object',
			properties: {
				status: { type: 'string' },
				message: { type: 'string' },
				error: { type: ['object', 'string'] },
			},
			required: ['status', 'message', 'error'],
		},
	},
};

export default fetchSchema;
