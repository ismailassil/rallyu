const notifySchema = {
	$id: 'notifySchema',
	body: {
		type: 'object',
		properties: {
			from_user: { type: 'string' },
			to_user: { type: 'string' },
			type: { type: 'string', enum: ['chat', 'game', 'friend_request'] },
			msg: { type: 'string' },
			action_url: { type: 'string' },
		},
		required: ['from_user', 'to_user', 'type'],
	},
	response: {
		201: { $ref: 'responseSchema#/properties/created' },
	},
};

export default notifySchema;
