const responseSchema = {
	$id: 'responseSchema',
	type: 'object',
	properties: {
		ok: {
			type: 'object',
			properties: {
				status: { type: 'string', default: 'success' },
				message: { type: ['array', 'object', 'string'] },
			},
			required: ['status', 'message'],
		},
		created: {
			type: 'object',
			properties: {
				status: { type: 'string', default: 'success' },
				message: { type: ['array', 'object', 'string'] },
			},
			required: ['status', 'message'],
		},
		not_found: {
			type: 'object',
			properties: {
				status: { type: 'string', default: 'error' },
				message: { type: 'string' },
				details: { type: ['object', 'string'] },
			},
			required: ['status', 'message'],
		},
		server_error: {
			type: 'object',
			properties: {
				status: { type: 'string', default: 'error' },
				message: { type: 'string' },
				details: { type: ['object', 'string'] },
			},
			required: ['status', 'message'],
		},
	},
};

export default responseSchema;
