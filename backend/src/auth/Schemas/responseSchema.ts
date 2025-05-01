const responseSchema = {
	$id: 'responseSchema',
	type: 'object',
	properties: {
		ok: {
			success: { type: 'boolean' },
			message: { type: 'string' },
			token: { type: 'string' },
		},
		created: {
			success: { type: 'boolean' },
			message: { type: 'string' },
			token: { type: 'string' },
		},
	},
};

export default responseSchema;
