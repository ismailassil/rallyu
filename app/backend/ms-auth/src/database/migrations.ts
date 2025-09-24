import { db } from "./index";

const MIGRATIONS = [
	{
		// TODO
			// ACCOUNT STATUS
			// IS DELETED
		id: 1,
		name: 'create-users-table',
		sql: `
			CREATE TABLE IF NOT EXISTS users (
				id INTEGER PRIMARY KEY AUTOINCREMENT,

				-- PROFILE
				first_name TEXT NOT NULL,
				last_name TEXT NOT NULL,
				email TEXT UNIQUE NOT NULL,
				username TEXT UNIQUE NOT NULL,
				password TEXT,
				bio TEXT DEFAULT 'DFK',
				avatar_url TEXT DEFAULT '/users/avatars/default.png',

				-- EXTRA
				auth_provider TEXT DEFAULT 'local',
				role TEXT DEFAULT 'user',

				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
			)
		`
	},
	{
		id: 2,
		name: 'create-refresh-tokens-table',
		sql: `
			CREATE TABLE IF NOT EXISTS refresh_tokens (
				session_id TEXT PRIMARY KEY,

				version INTEGER DEFAULT 1,
				is_revoked BOOLEAN DEFAULT FALSE,
				reason TEXT,

				device_name TEXT NOT NULL,
				browser_version TEXT NOT NULL,
				ip_address TEXT NOT NULL,

				created_at DATETIME NOT NULL,
				expires_at DATETIME NOT NULL,

				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

				user_id INTEGER NOT NULL,
				FOREIGN KEY (user_id) REFERENCES users(id)
			)
		`
	},
	{
		id: 3,
		name: 'create-two-factor-auth-table',
		sql: `
			CREATE TABLE IF NOT EXISTS _2fa_methods (
				id INTEGER PRIMARY KEY AUTOINCREMENT, -- 2FA ID
				
				method TEXT NOT NULL, -- email, sms, totp,
				totp_secret TEXT,

				user_id INTEGER NOT NULL,
				FOREIGN KEY (user_id) REFERENCES users(id)
			)
		`
	},
	{
		id: 4,
		name: 'create-pending-2fa-table',
		sql: `
			CREATE TABLE IF NOT EXISTS pending_2fa (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				
				method TEXT NOT NULL,
				temp_value TEXT,

				expires_at DATETIME,

				user_id INTEGER NOT NULL,
				FOREIGN KEY (user_id) REFERENCES users(id)
			);
		`
	},
	{
		id: 5,
		name: 'create-otps-table',
		sql: `
			CREATE TABLE IF NOT EXISTS otps (
				id INTEGER PRIMARY KEY AUTOINCREMENT, -- OTP ID
				
				method TEXT NOT NULL, -- email, sms,
				code TEXT,

				expires_at DATETIME,

				user_id INTEGER NOT NULL,
				FOREIGN KEY (user_id) REFERENCES users(id)
			)
		`
	},
	{
		id: 6,
		name: 'create-relations-table',
		sql: `
			CREATE TABLE IF NOT EXISTS relations (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
  
				requester_user_id INTEGER NOT NULL, -- USER WHO DID THE FIRST ACTION
				receiver_user_id INTEGER NOT NULL,  -- USER REQUESTED TO REPLY TO ACTION
				
				relation_status TEXT NOT NULL,    -- VALUES (PENDING, ACCEPTED, BLOCKED)
				
				updated_by_user_id INTEGER,         -- USER WHO PERFORMED LAST ACTION
																							-- EX:
																								-- ADD FRIEND => PENDING
																								-- UNFRIEND   => DELETE
																								-- BLOCK      => BLOCKED
				
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				
				FOREIGN KEY (requester_user_id) REFERENCES users(id), -- ON DELETE CASCADE?
				FOREIGN KEY (receiver_user_id) REFERENCES users(id),   -- ON DELETE CASCADE?
  				FOREIGN KEY (updated_by_user_id) REFERENCES users(id) -- ON DELETE CASCADE?
			)
		`
	},
	{
		id: 7,
		name: 'create-reset-password-table',
		sql: `
			CREATE TABLE IF NOT EXISTS reset_password (
				id INTEGER PRIMARY KEY AUTOINCREMENT, 
				
				code TEXT,

				expires_at DATETIME,
				
				user_id INTEGER NOT NULL,
				FOREIGN KEY (user_id) REFERENCES users(id)
			)
		`
	},
	{
		id: 8,
		name: 'create-users-stats-table',
		sql: `
			CREATE TABLE IF NOT EXISTS users_stats (
				id INTEGER PRIMARY KEY AUTOINCREMENT, 
				
				level INTEGER DEFAULT 0,
				total_xp INTEGER DEFAULT 0,
				current_streak INTEGER DEFAULT 0,
				longest_streak INTEGER DEFAULT 0,

				user_id INTEGER NOT NULL,
				FOREIGN KEY (user_id) REFERENCES users(id)
			)
		`
	},
	{
		id: 9,
		name: 'create-matches-table',
		sql: `
			CREATE TABLE IF NOT EXISTS matches (
				id INTEGER PRIMARY KEY AUTOINCREMENT, 
				
				player_home_score INTEGER NOT NULL,
				player_away_score INTEGER NOT NULL,

				game_type TEXT NOT NULL, -- (CHECK PING PONG OR TICTACTOE)
				started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				finished_at DATETIME DEFAULT CURRENT_TIMESTAMP,

				player_home_id INTEGER NOT NULL,
				player_away_id INTEGER NOT NULL,
				FOREIGN KEY (player_home_id) REFERENCES users(id), -- ON DELETE CASCADE?
				FOREIGN KEY (player_away_id) REFERENCES users(id)   -- ON DELETE CASCADE?
			)
		`
	},
	{
		id: 10,
		name: 'create-pending-2fa-login-table',
		sql: `
			CREATE TABLE IF NOT EXISTS pending_2fa_login (
				id INTEGER PRIMARY KEY AUTOINCREMENT, -- 2FA ID
				
				method TEXT, -- email, sms, totp,
				code TEXT,
				remaining_attempts INTEGER,
				remaining_resends INTEGER,

				expires_at DATETIME,

				user_id INTEGER NOT NULL,
				FOREIGN KEY (user_id) REFERENCES users(id)
			)
		`
	},
];

// {
// 	id: 2,
// 	name: 'create-refresh-tokens-table',
// 	sql: `
// 		CREATE TABLE refresh_tokens (
// 			id INTEGER PRIMARY KEY AUTOINCREMENT,

// 			token_hash TEXT NOT NULL,
// 			device_name TEXT DEFAULT NULL,
// 			ip_address TEXT DEFAULT NULL,
// 			user_agent TEXT DEFAULT NULL,
// 			is_revoked BOOLEAN DEFAULT FALSE,
// 			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
// 			expires_at DATETIME NOT NULL,
// 			last_used DATETIME DEFAULT CURRENT_TIMESTAMP,

// 			user_id INTEGER NOT NULL,
// 			FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
// 		)
// 	`
// }

async function runMigrations() {

	try {
		for (const migration of MIGRATIONS) {
			await db.run(migration.sql);
			console.log(`Completed migration: ${migration.name}`);
		}

		console.log(`Completed all migrations successfully.`);
	} catch (err) {
		await db.close();
		console.log(`Migration failed: ${err}`);
		process.exit(1);
	}
}

export default runMigrations;