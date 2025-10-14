export const joinRoomSchema = {
    querystring: {
        type: 'object',
        properties: {
            userid: { type: 'number' }
        },
        required: ['userid']
    },
    params: {
        type: 'object',
        properties: {
            roomid: { type: 'string' }
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
        },
        required: ['playersIds', 'gameType'],
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
            userid: { type: 'number' }
        },
        required: ['userid'],
        additionalProperties: false
    },
}