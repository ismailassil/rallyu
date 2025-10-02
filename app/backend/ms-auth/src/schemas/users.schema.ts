// get user by id
const userIdParams = {
	type: 'object',
	properties: {
		id: { type: 'number' }
	},
	required: ['id'],
	additionalProperties: false
};

// get user by username
const userUsernameQuery = {
	type: 'object',
	properties: {
		username: { type: 'string' }
	},
	additionalProperties: false
}

// update
const userUpdateBody = {
	type: 'object',
	properties: {
		first_name: { type: 'string' },
		last_name: { type: 'string' },
		email: { type: 'string' },
		username: { type: 'string' },
		bio: { type: 'string' },
	},
	additionalProperties: false,
	minProperties: 1
}

// availability
const usernameAvailabilityQuery = {
	type: 'object',
	properties: {
		username: { type: 'string' }
	},
	required: ['username'],
	additionalProperties: false
};

const emailAvailabilityQuery = {
	type: 'object',
	properties: {
		email: { type: 'string' }
	},
	required: ['email'],
	additionalProperties: false
};

// relations
const relationsRequestParams = {
	type: 'object',
	properties: {
		targetUserId: { type: 'number' }
	},
	required: ['targetUserId'],
	additionalProperties: false
};

// search user by username
const userSearchByUsernameQuery = {
	type: 'object',
	properties: {
		username: { type: 'string' }
	},
	required: ['username'],
	additionalProperties: false
};

// matches
const matchesRequestQuery = {
	type: 'object',
	properties: {
		page: { type: 'number' },
		limit: { type: 'number' }
	},
	required: ['page', 'limit'],
	additionalProperties: false
};

// leaderboard
const leaderboardQuery = {
	type: 'object',
	properties: {
		page: { type: 'number' },
		limit: { type: 'number' }
	},
	required: ['page', 'limit'],
	additionalProperties: false
};

export const userUsernameSchema = {
	querystring: userUsernameQuery
};

export const userIdSchema = {
	params: userIdParams
};

export const leaderboardSchema = {
	querystring: leaderboardQuery
};

export const userSearchByUsernameSchema = {
	querystring: userSearchByUsernameQuery
};

export const usernameAvailabilitySchema = {
	querystring: usernameAvailabilityQuery
};

export const emailAvailabilitySchema = {
	querystring: emailAvailabilityQuery
};

export const userUpdateSchema = {
	params: userIdParams,
	body: userUpdateBody
}

export const relationsRequestSchema = {
	params: relationsRequestParams
};

export const matchesRequestSchema = {
	params: userIdParams,
	querystring: matchesRequestQuery
};