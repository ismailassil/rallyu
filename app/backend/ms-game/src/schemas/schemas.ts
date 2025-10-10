export const joinRoomSchema = {
    querystring: {
        type: 'object',
        properties: {
            user: { type: 'string' }
        },
        required: ['user']
    },
    params: {
        type: 'object',
        properties: {
            roomid: { type: 'number' }
        },
        required: ['roomid'],
        additionalProperties: false
    }
}

export const createRoomSchema = {
    headers: {
        type: 'object',
        properties: {
            authorization: { type: 'string' }
        },
        required: ['authorization']
    },
    body: {
        type: 'object',
        properties: {
            playersIds: {
                type: 'array',
                items: { type: 'number' }
            },
            gameType: {
                type: 'string',
                enum: ['pingpong', 'tictactoe']
            },
            gameMode: {
                type: 'string',
                enum: ['online', 'local']
            }
        },
        required: ['playerIds', 'gameType', 'gameMode'],
        additionalProperties: false
    }
}

export const roomStatusSchema = {
    params: {
        type: 'object',
        properties: {
            roomid: { type: 'string' }
        },
        required: ['roomid'],
        additionalProperties: false
    },
}

export const userStatusSchema = {
    params: {
        type: 'object',
        properties: {
            user: { type: 'number' }
        },
        required: ['user'],
        additionalProperties: false
    },
}