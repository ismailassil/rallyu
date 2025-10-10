export const matchMakingRouteSchema = {
    params: {
        type: 'object',
        properties: {
            gameType : {
                type: 'string',
                enum: ['pingpong', 'tictactoe']
            }
        },
        required: ['gameType'],
        additionalProperties: false
    }
}