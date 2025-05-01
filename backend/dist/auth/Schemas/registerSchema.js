const registerSchema = {
    $id: 'registerSchema',
    body: {
        type: 'object',
        properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            usename: { type: 'string', minLength: 3, maxLength: 20 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
        },
        required: ['firstName', 'lastName', 'username', 'email', 'password'],
    },
    response: {
        201: { $ref: 'responseSchema#/properties/created' },
    },
};
export default registerSchema;
