const notifyGameSchema = {
	$id: 'notifyGameSchema',
	body: {
		type: 'object',
		properties: {
			receiver_id: { type: 'number' },
		},
		required: ['receiver_id'],
	},
	response: {
		200: { $ref: 'responseSchema#/properties/ok' },
		404: { $ref: 'responseSchema#/properties/not_found' },
		500: { $ref: 'responseSchema#/properties/server_error' },
	},
};

export default notifyGameSchema;
