const updateSchema = {
	$id: 'updateSchema',
	body: {
		type: 'object',
		properties: {
			notificationId: { type: 'number' },
			status: { type: 'string', enum: ['unread', 'read', 'dismissed'] },
			scope: { type: 'string', enum: ['all', 'single'] },
		},
		required: ['scope', 'status'],
	},
	response: {
		201: { $ref: 'responseSchema#/properties/created' },
		404: { $ref: 'responseSchema#/properties/not_found' },
		500: { $ref: 'responseSchema#/properties/server_error' },
	},
};

export default updateSchema;
