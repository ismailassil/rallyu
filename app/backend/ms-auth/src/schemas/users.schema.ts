const usernameavailability = {
	querystring: {
		type: 'object',
		properties: {
			username: { type: 'string' }
		},
		required: ['username'],
		additionalProperties: false
	}
};

const emailavailability = {
	querystring: {
		type: 'object',
		properties: {
			email: { type: 'string' }
		},
		required: ['email'],
		additionalProperties: false
	}
};

const userusername = {
	querystring: {
		type: 'object',
		properties: {
			username: { type: 'string' }
		},
		required: ['username'],
		additionalProperties: false
	}
}

const useruserid = {
	params: {
		type: 'object',
		properties: {
			id: { type: 'number' }
		},
		required: ['id'],
		additionalProperties: false
	}
}

const usersearchbyquery = {
	querystring: {
		type: 'object',
		properties: {
			query: { type: 'string' }
		},
		required: ['query'],
		additionalProperties: false
	}
}

const userupdate = {
	params: {
		type: 'object',
		properties: {
			id: { type: 'number' }
		},
		required: ['id'],
		additionalProperties: false
	},
	body: {
		type: 'object',
		properties: {
			first_name: { type: 'string' },
			last_name: { type: 'string' },
			username: { type: 'string' },
			email: { type: 'string' },
			phone: { type: 'string' },
			bio: { type: 'string' }
		},
		required: [],
		additionalProperties: false
	}
};

const usermatches = {
	params: {
		type: 'object',
		properties: {
			id: { type: 'number' }
		},
		required: ['id'],
		additionalProperties: false
	},
	querystring: {
		type: 'object',
		properties: {
			page: { type: 'number' },
			limit: { type: 'number' },
			gameTypeFilter: { type: 'string' },
			timeFilter: { type: 'string' }
		},
		required: ['page', 'limit', 'gameTypeFilter', 'timeFilter'],
		additionalProperties: false
	}
}

const usersleaderboard = {
	querystring: {
		type: 'object',
		properties: {
			page: { type: 'number' },
			limit: { type: 'number' }
		},
		required: ['page', 'limit'],
		additionalProperties: false
	}
}

const userrelations = {
	params: {
		type: 'object',
		properties: {
			targetUserId: { type: 'string' }
		},
		required: ['targetUserId'],
		additionalProperties: false
	}
};

const internalmatchespost = {
	body: {
		type: 'object',
		required: [
			'player_home_score',
			'player_away_score',
			'game_type',
			'player_home_id',
			'player_away_id',
			'started_at',
			'finished_at'
		],
		properties: {
			player_home_score: { type: 'number' },
			player_away_score: { type: 'number' },
			player_home_id: { type: 'number' },
			player_away_id: { type: 'number' },
			started_at: { type: 'number' },
			finished_at: { type: 'number' },
			game_type: { type: 'string', enum: ['XO', 'PONG'] }
		},
		additionalProperties: false
	}
}

export const usersRoutesSchemas = {
	availability: {
		username: usernameavailability,
		email: emailavailability
	},
	users: {
		fetch: {
			byUsername: userusername,
			byId: useruserid,
			search: usersearchbyquery,
			leaderboard: usersleaderboard,
			matches: usermatches
		},
		update: userupdate,
		delete: useruserid
	},
	relations: {
		actions: userrelations
	},
	matches: {
		internal: {
			create: internalmatchespost
		}
	}
};
