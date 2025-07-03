const historySchema = {
	$id: 'historySchema',
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
		200: { $ref: 'responseSchema#/properties/ok' },
		404: { $ref: 'responseSchema#/properties/not_found' },
		500: { $ref: 'responseSchema#/properties/server_error' },
	},
};

export default historySchema;
