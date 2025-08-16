import { db } from "../database";
import { InternalServerError } from "../types/auth.types";

class TwoFactorRepository {
	async findEnabled2FAMethods(user_id: number) : Promise<any> {
		try {
			const allEnabled2FAMethods = await db.all(
				`SELECT * FROM _2fa_methods WHERE user_id = ?`,
				[user_id]
			);
			return allEnabled2FAMethods;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async findPending2FAMethods(user_id: number) : Promise<any> {
		try {
			const allPending2FAMethods = await db.all(
				`SELECT * FROM pending_2fa WHERE user_id = ?`,
				[user_id]
			);
			return allPending2FAMethods;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async findEnabled2FAMethodById(id: number, user_id: number) : Promise<any> {
		try {
			const enabled2FAMethod = await db.get(
				`SELECT * FROM _2fa_methods WHERE id = ? AND user_id = ?`,
				[id, user_id]
			);
			return enabled2FAMethod ?? null;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async findPending2FAMethodById(id: number, user_id: number) : Promise<any> {
		try {
			const pending2FAMethod = await db.get(
				`SELECT * FROM pending_2fa WHERE id = ? AND user_id = ?`,
				[id, user_id]
			);
			return pending2FAMethod ?? null;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async findEnabled2FAMethodByType(type: string, user_id: number) : Promise<any> {
		try {
			const enabled2FAMethod = await db.get(
				`SELECT * FROM _2fa_methods WHERE user_id = ? AND method = ?`,
				[user_id, type]
			);
			return enabled2FAMethod ?? null;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async findPending2FAMethodByType(type: string, user_id: number) : Promise<any> {
		try {
			const pending2FAMethod = await db.get(
				`SELECT * FROM pending_2fa WHERE user_id = ? AND method = ?`,
				[user_id, type]
			);
			return pending2FAMethod ?? null;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async findOTPById(id: number, user_id: number) : Promise<any> {
		try {
			const OTP = await db.get(
				`SELECT * FROM otps WHERE user_id = ? AND id = ?`,
				[user_id, id]
			);
			return OTP ?? null;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async findOTPByType(type: string, user_id: number) : Promise<any> {
		try {
			const OTP = await db.get(
				`SELECT * FROM otps WHERE user_id = ? AND method = ?`,
				[user_id, type]
			);
			return OTP ?? null;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async findAllOTPs(user_id: number) : Promise<any> {
		try {
			const allOTPs = await db.all(
				`SELECT * FROM otps WHERE user_id = ?`,
				[user_id]
			);
			return allOTPs;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}
	
	async createPending2FAMethod(method: string, temp_value: string, expires_at: number, user_id: number) : Promise<any> {
		try {
			const newPending2FAMethod = await db.run(
				`INSERT INTO pending_2fa(method, temp_value, expires_at, user_id) VALUES (?, ?, ?, ?)`,
				[method, temp_value, expires_at, user_id]
			);
			console.log('WE JUST CREATED A NEW PENDING TOTP METHOD: ', newPending2FAMethod);
			return newPending2FAMethod.lastID;
		} catch (err) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async createPendingTOTP2FAMethod(method: string, totp_temp_code: string, expires_at: number, user_id: number) : Promise<any> {
		try {
			const newPending2FAMethod = await db.run(
				`INSERT INTO pending_2fa(method, totp_temp_secret, expires_at, user_id) VALUES (?, ?, ?, ?)`,
				[method, totp_temp_code, expires_at, user_id]
			);
			console.log('WE JUST CREATED A NEW PENDING TOTP METHOD: ', newPending2FAMethod);
			return newPending2FAMethod.lastID;
		} catch (err) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async createPendingOTP2FAMethod(method: string, otp_temp_code: string, expires_at: number, user_id: number) : Promise<any> {
		try {
			const newPending2FAMethod = await db.run(
				`INSERT INTO pending_2fa(method, otp_temp_code, expires_at, user_id) VALUES (?, ?, ?, ?)`,
				[method, otp_temp_code, expires_at, user_id]
			);
			return newPending2FAMethod.lastID;
		} catch (err) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async enablePending2FATOTPMethod(user_id: number) : Promise<any> {
		const pending2FAMethod = await db.get(
			`SELECT * FROM pending_2fa WHERE user_id = ? AND method = 'totp'`,
			[user_id]
		);

		const new2FAMethod = await db.run(
			`INSERT INTO _2fa_methods(method, totp_secret, user_id) VALUES (?, ?, ?)`,
			[pending2FAMethod.method, pending2FAMethod.totp_temp_secret, pending2FAMethod.user_id]
		);

		await db.run(
			`DELETE FROM pending_2fa WHERE id = ?`,
			[pending2FAMethod.id]
		);

		return await this.findEnabled2FAMethodById(new2FAMethod.lastID, user_id);
	}

	async enablePending2FAOTPMethod(method: string, user_id: number) : Promise<any> {
		const pending2FAMethod = await db.get(
			`SELECT * FROM pending_2fa WHERE user_id = ? AND method = ?`,
			[user_id, method]
		);

		const new2FAMethod = await db.run(
			`INSERT INTO _2fa_methods(method, user_id) VALUES (?, ?)`,
			[pending2FAMethod.method, pending2FAMethod.user_id]
		);

		await db.run(
			`DELETE FROM pending_2fa WHERE id = ?`,
			[pending2FAMethod.id]
		);

		return await this.findEnabled2FAMethodById(new2FAMethod.lastID, user_id);
	}

	async createOTP(method: string, code: string, expires_at: number, user_id: number) : Promise<any> {
		try {
			const newOTP = await db.run(
				`INSERT INTO otps(method, code, expires_at, user_id) VALUES (?, ?, ?, ?)`,
				[method, code, expires_at, user_id]
			);
			return newOTP.lastID;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async deleteAllEnabled2FA(user_id: number) {
		try {
			const runResult = await db.run(
				`DELETE FROM _2fa_methods WHERE user_id = ?`,
				[user_id]
			);
			return runResult.changes > 0;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async deleteAllPending2FA(user_id: number) {
		try {
			const runResult = await db.run(
				`DELETE FROM pending_2fa WHERE user_id = ?`,
				[user_id]
			);
			return runResult.changes > 0;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}
	
	async deleteEnabled2FAById(id: number) {
		try {
			const runResult = await db.run(
				`DELETE FROM _2fa_methods WHERE id = ?`,
				[id]
			);
			return runResult.changes > 0;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async deleteEnabled2FAByType(type: string, user_id: number) {
		try {
			console.log(`SELECT * FROM _2fa_methods WHERE user_id = ${user_id} AND method = ${type}`);
			const runResult = await db.run(
				`DELETE FROM _2fa_methods WHERE user_id = ? AND method = ?`,
				[user_id, type]
			);
			return runResult.changes > 0;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async deletePending2FAById(id: number, user_id: number) {
		try {
			const runResult = await db.run(
				`DELETE FROM pending_2fa WHERE id = ? AND user_id = ?`,
				[id, user_id]
			);
			return runResult.changes > 0;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async deletePending2FAByType(type: string, user_id: number) {
		try {
			const runResult = await db.run(
				`DELETE FROM pending_2fa WHERE user_id = ? AND method = ?`,
				[user_id, type]
			);
			return runResult.changes > 0;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async deleteAllOTPs(user_id: number) {
		try {
			const runResult = await db.run(
				`DELETE FROM otps WHERE user_id = ?`,
				[user_id]
			);
			return runResult.changes > 0;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}

	async deleteOTPById(id: number, user_id: number) {
		try {
			const runResult = await db.run(
				`DELETE FROM otps WHERE user_id = ? AND id = ?`,
				[user_id, id]
			);
			return runResult.changes > 0;
		} catch (err: any) {
			console.error('SQLite Error: ', err);
			throw new InternalServerError();
		}
	}
}

export default TwoFactorRepository;