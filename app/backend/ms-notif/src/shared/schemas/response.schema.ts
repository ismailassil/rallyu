const responseSchema = {
	$id: 'responseSchema',
	type: 'object',
	properties: {
		ok: {
			success: { type: 'boolean' },
			message: { type: 'string' },
		},
		created: {
			success: { type: 'boolean' },
			message: { type: 'string' },
		},
	},
};

export default responseSchema;
