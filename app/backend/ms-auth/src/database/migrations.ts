import { db } from "./index";

const MIGRATIONS = [
	{
		id: 1,
		name: 'create-users-table',
		sql: `
			CREATE TABLE IF NOT EXISTS users (
				id INTEGER PRIMARY KEY AUTOINCREMENT,

				first_name TEXT NOT NULL,
				last_name TEXT NOT NULL,
				email TEXT UNIQUE NOT NULL,
				username TEXT UNIQUE NOT NULL,
				password TEXT,
				bio TEXT DEFAULT 'DFK',
				avatar_url TEXT DEFAULT '/users/avatars/default.png',

				phone TEXT,

				email_verified BOOLEAN DEFAULT FALSE,
				phone_verified BOOLEAN DEFAULT FALSE,

				auth_provider TEXT DEFAULT 'Local',
				auth_provider_id INTEGER,
				role TEXT DEFAULT 'user',

				created_at INTEGER DEFAULT (strftime('%s','now')),
				updated_at INTEGER DEFAULT (strftime('%s','now'))
			)
		`
	},
	{
		id: 2,
		name: 'create-sessions-table',
		sql: `
			CREATE TABLE IF NOT EXISTS sessions (
				session_id TEXT PRIMARY KEY NOT NULL,

				version INTEGER DEFAULT 1,
				is_revoked BOOLEAN DEFAULT FALSE,
				reason TEXT,

				device TEXT NOT NULL,
				browser TEXT NOT NULL,
				ip_address TEXT NOT NULL,

				created_at INTEGER DEFAULT (strftime('%s','now')),
				updated_at INTEGER DEFAULT (strftime('%s','now')),
				expires_at INTEGER NOT NULL,

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
				id INTEGER PRIMARY KEY AUTOINCREMENT,

				method TEXT NOT NULL,
				totp_secret TEXT,

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

				created_at INTEGER DEFAULT (strftime('%s','now')),
				updated_at INTEGER DEFAULT (strftime('%s','now')),

				FOREIGN KEY (requester_user_id) REFERENCES users(id), -- ON DELETE CASCADE?
				FOREIGN KEY (receiver_user_id) REFERENCES users(id)   -- ON DELETE CASCADE?
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
				player_home_xp_gain INTEGER NOT NULL,
				player_away_xp_gain INTEGER NOT NULL,

				game_type TEXT NOT NULL,
				started_at INTEGER DEFAULT (strftime('%s','now')),
				finished_at INTEGER DEFAULT (strftime('%s','now')),

				player_home_id INTEGER NOT NULL,
				player_away_id INTEGER NOT NULL,
				FOREIGN KEY (player_home_id) REFERENCES users(id), -- ON DELETE CASCADE?
				FOREIGN KEY (player_away_id) REFERENCES users(id)   -- ON DELETE CASCADE?
			)
		`
	},
	{
		id: 11,
		name: 'create-auth-challenges-table',
		sql: `
			CREATE TABLE IF NOT EXISTS auth_challenges (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				user_id INTEGER NOT NULL,
				challenge_type TEXT NOT NULL,
				method TEXT CHECK (method IN ('SMS', 'EMAIL', 'TOTP')),
				status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VERIFIED', 'COMPLETED', 'EXPIRED', 'FAILED')),

				token TEXT NOT NULL UNIQUE,      -- frontend state
				target TEXT,                     -- email or phone number
				secret TEXT,            		-- OTP or TOTP Secret

				verify_attempts INTEGER NOT NULL DEFAULT 0,
				resend_attempts INTEGER NOT NULL DEFAULT 0,

				created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
				updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
				expires_at INTEGER NOT NULL
			);
		`
	},
];

const TRIGGERS = [
	{
		id: 1,
		name: 'trigger_create_user_stats_after_insert',
		sql: `
			CREATE TRIGGER IF NOT EXISTS create_user_stats_after_insert
			AFTER INSERT
			ON users
			FOR EACH ROW
			BEGIN
				INSERT INTO users_stats (user_id)
				VALUES (NEW.id);
			END;
		`
	},
	{
		id: 2,
		name: 'trigger_invalidate_2fa_challenges_on_method_delete',
		sql: `
			CREATE TRIGGER IF NOT EXISTS invalidate_2fa_challenges_on_method_delete
			AFTER DELETE
			ON _2fa_methods
			FOR EACH ROW
			BEGIN
				UPDATE auth_challenges
				SET status = 'FAILED',
					updated_at = strftime('%s', 'now')
				WHERE user_id = OLD.user_id
					AND method = OLD.method
					AND challenge_type = '2fa_login'
					AND (status = 'PENDING' OR status = 'VERIFIED');
			END;
		`
	},
	{
		id: 3,
		name: 'trigger_invalidate_password_reset_on_email_change',
		sql: `
			CREATE TRIGGER IF NOT EXISTS invalidate_password_reset_on_email_change
			AFTER UPDATE ON users
			FOR EACH ROW
			WHEN OLD.email != NEW.email
			BEGIN
				UPDATE auth_challenges
				SET status = 'FAILED',
					updated_at = strftime('%s','now')
				WHERE user_id = NEW.id
					AND method = 'EMAIL'
					AND challenge_type = 'password_reset'
					AND (status = 'PENDING' OR status = 'VERIFIED');
			END;
		`
	}
];

async function runMigrations() {

	try {
		for (const migration of MIGRATIONS) {
			await db.run(migration.sql);
			console.log(`Completed migration: ${migration.name}`);
		}
		console.log(`Completed all migrations successfully.`);

		for (const trigger of TRIGGERS) {
			await db.run(trigger.sql);
			console.log(`Completed trigger: ${trigger.name}`);
		}
		console.log(`Completed all trigger successfully.`);
	} catch (err) {
		await db.close();
		console.log(`Migration failed: ${err}`);
		process.exit(1);
	}
}

export default runMigrations;
