const updateSchema = {
	$id: 'updateSchema',
	body: {
		type: 'object',
		properties: {
			username: { type: 'string' },
			notificationId: { type: 'number' },
			status: { type: 'string', enum: ['unread', 'read', 'dismissed'] },
			all: { type: 'boolean' },
		},
		required: ['username', 'status'],
		oneOf: [
			{ required: ['notificationId'], not: { required: ['all'] } },
			{ required: ['all'], not: { required: ['notificationId'] } },
		],
	},
	response: {
		201: { $ref: 'responseSchema#/properties/created' },
		404: { $ref: 'responseSchema#/properties/not_found' },
		500: { $ref: 'responseSchema#/properties/server_error' },
	},
};

export default updateSchema;
