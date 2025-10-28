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
            tournament: {
                type: 'object',
                properties: {
                    gameId: {
                        type: 'number',
                    },
                    tournamentURL: {
                        type: 'number',
                    }
                }
            }
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

export const pongInterfaceSchema = {
    params: {
        type: 'object',
        properties: {
            roomid: { type: 'string' },
            userid: { type: 'number' },
            dir: {
                type: 'string',
                enum: ['up', 'down', 'still']
            }
        },
        required: ['roomid', 'userid', 'dir'],
        additionalProperties: false
    },
}

export const xoInterfaceSchema = {
    params: {
        type: 'object',
        properties: {
            roomid: { type: 'string' },
            userid: { type: 'number' },
            cellnum: {
                type: 'number',
                minimum: 1,
                maximum: 9
            }
        },
        required: ['roomid', 'userid', 'action', 'dir'],
        additionalProperties: false
    },
}