const changepwdSchema = {
	$id: 'changepwdSchema',
	body: {
		type: 'object',
		properties: {
			oldpwd: { type: 'string' },
			newpwd: { type: 'string' },
		},
		required: ['oldpwd', 'newpwd'],
	},
	response: {
		200: { $ref: 'responseSchema#/properties/ok' },
	},
};

export default changepwdSchema;
