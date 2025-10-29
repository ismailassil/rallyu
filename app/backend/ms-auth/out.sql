PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE users (
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
			);
INSERT INTO users VALUES(1,'Nabil','AZOUZ','nabilos.fb@gmail.com','xezzuz','$2b$12$AKYCOT37/2jG3sRqAOmove4oG6rvDFf5IPzKHsODTPZ2Yvwlfj9hS','DFK: DIHA F KERREK','/users/avatars/58686305-b902-4d90-b95c-5cadcf587491.png',NULL,0,0,'Local',NULL,'user',1751628510,1761556558);
INSERT INTO users VALUES(2,'Ismail','Assil','ismailassil@duck.com','moul_chi','$2b$12$.rlBZ0tOndYMQ8trvITr0OiKCGTQy94rpschWwzibPzeXD5CRikWC','DFK','/users/avatars/default.png',NULL,0,0,'Local',NULL,'user',1753775221,1761313080);
INSERT INTO users VALUES(3,'Salah','Demnati','terex881@gmail.com','terex881','$2b$12$VjOxkjmWTetPLW06jDW4w.yTuY/L.7KfW9U90XClj9teFiLqY6m9i','DFK','/users/avatars/default.png',NULL,0,0,'Local',NULL,'user',1754212180,1761313080);
INSERT INTO users VALUES(4,'Mohammed','Maila','mmaila@gmail.com','mmaila','$2b$12$nlJQkh6pIUu0WRkhXMJCb.DLYfSIz0DEluYUBMF/RYd8ZOktZT/9.','DFK','/users/avatars/default.png',NULL,0,0,'Local',NULL,'user',1751470256,1761313080);
INSERT INTO users VALUES(5,'Amine','Maila','dawda@dawda.com','mmaila0','$2b$12$ojTPatwuoTA8Asp5sAz3CO4YMsj1wKgPeImxbygxoEUSMCl1m7fM2','DFK','/users/avatars/default.png',NULL,0,0,'Local',NULL,'user',1760346893,1761313080);
INSERT INTO users VALUES(6,'Amine','Maila','dwad@dwad.com','mmaila1','$2b$12$gFE.6sh1Al7d86fpMZuKOObSy7lDyP7O6ufCPwxIn48r.QRbBb1EO','DFK','/users/avatars/default.png',NULL,0,0,'Local',NULL,'user',1760865437,1761313080);
INSERT INTO users VALUES(7,'Hamza','El Omrani','hamza-elomrani@gmail.com','sabona','$2b$12$l4hLUBketXYNBprvgwP4w.xFxilOlVbzLuBddf19kob2LvZV/xbOy','DFK','/users/avatars/default.png',NULL,0,0,'Local',NULL,'user',1750949162,1761313080);
INSERT INTO users VALUES(8,'Taha','Besbess','besbesstaha@gmail.com','tbesbess','$2b$12$fdangg2FS8RUuENtMcHyBuYYTuRUYNKXsbIR61n.JBMps1Vr2Wp36','DFK','/users/avatars/default.png',NULL,0,0,'Local',NULL,'user',1751470000,1761313080);
INSERT INTO users VALUES(9,'Achraf','Ibn Cheikh','aibn-che@gmail.com','aibn_che','$2b$12$KnqV0iEVoq/k/N830PrAZOhGQFIYw746xpc58sjZ0lYt1M3DKm8vW','DFK','/users/avatars/default.png',NULL,0,0,'Local',NULL,'user',1758913163,1761313100);
INSERT INTO users VALUES(10,'test','user','testuser@gmail.com','testuser','$2b$12$Basxhc6xYCkWrZY/9gxZ.utWmmRClAgJoE34B1f2KagIFhZQByUze','DFK','/users/avatars/default.png',NULL,0,0,'Local',NULL,'user',1761645886,1761645886);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('users',10);
CREATE TRIGGER trg_create_user_stats_after_insert
			AFTER INSERT ON users
			FOR EACH ROW
			BEGIN
				INSERT INTO users_stats (user_id)
				VALUES (NEW.id);
			END;
CREATE TRIGGER trg_on_email_change
			BEFORE UPDATE OF email ON users
			FOR EACH ROW
			WHEN OLD.email IS NOT NEW.email
			BEGIN
				UPDATE users
				SET email_verified = FALSE
				WHERE id = NEW.id;

				UPDATE auth_challenges
				SET status = 'EXPIRED'
				WHERE user_id = NEW.id
				AND challenge_type != 'email_verification'
				AND method = 'EMAIL'
				AND (status = 'PENDING' OR status = 'VERIFIED');

				DELETE FROM _2fa_methods
				WHERE user_id = NEW.id
				AND method = 'EMAIL';
			END;
CREATE TRIGGER trg_on_phone_change
			BEFORE UPDATE OF phone ON users
			FOR EACH ROW
			WHEN OLD.phone IS NOT NEW.phone
			BEGIN
				UPDATE users
				SET phone_verified = FALSE
				WHERE id = NEW.id;

				UPDATE auth_challenges
				SET status = 'EXPIRED'
				WHERE user_id = NEW.id
				AND challenge_type != 'phone_verification'
				AND method = 'SMS'
				AND (status = 'PENDING' OR status = 'VERIFIED');

				DELETE FROM _2fa_methods
				WHERE user_id = NEW.id
				AND method = 'SMS';
			END;
CREATE TRIGGER trg_users_update_timestamp
			AFTER UPDATE ON users
			FOR EACH ROW
			BEGIN
				UPDATE users SET updated_at = (strftime('%s','now')) WHERE id = OLD.id;
			END;
COMMIT;
