import PasswordResetRepository from "../repositories/passwordResetRepository";
import UserRepository from "../repositories/userRepository";
import bcrypt from 'bcrypt';

class PasswordResetService {
	constructor(
		private resetRepository: PasswordResetRepository,
		private userRepository: UserRepository
	) {}

	async setup(email: string) : Promise<boolean> {
		const exists = await this.userRepository.findByEmail(email);
		if (!exists)
			return false; // throw user not found

		const existingUser = await this.userRepository.findByEmail(email);
		if (!existingUser)
			return false;

		await this.resetRepository.deleteAll(existingUser.id);

		const OTP = this.generateOTP();
		await this.resetRepository.create(existingUser.id, OTP, this.nowPlusMinutes(5));
		this.sendEmail(email, OTP);

		return true;
	}

	async verify(email: string, code: string) {
		const exists = await this.userRepository.findByEmail(email);
		if (!exists)
			return false; // throw user not found

		const existingUser = await this.userRepository.findByEmail(email);
		if (!existingUser)
			return false;

		const resetPasswordRow = await this.resetRepository.findByUserID(existingUser.id);
		console.log('resetPasswordRow', resetPasswordRow);
		if (this.nowInSeconds() > resetPasswordRow.expires_at)
			return false;
		if (code !== resetPasswordRow.code)
			return false;

		return true;
	}

	async update(email: string, code: string, newPassword: string) {
		const exists = await this.userRepository.findByEmail(email);
		if (!exists)
			return false; // throw user not found

		const existingUser = await this.userRepository.findByEmail(email);
		if (!existingUser)
			return false;

		const resetPasswordRow = await this.resetRepository.findByUserID(existingUser.id);
		// if (this.nowInSeconds() > resetPasswordRow.expires_at)
		// 	return false;
		if (code !== resetPasswordRow.code)
			return false;

		const AUTH_BCRYPT_ROUNDS = 12; // TODO
		const hashedPassword = await bcrypt.hash(newPassword, AUTH_BCRYPT_ROUNDS);
		const newUser = this.userRepository.update(existingUser.id, { password: hashedPassword });
		if (!newUser)
			return false;
		return true;
	}

	private generateOTP() {
		return ('' + Math.floor(100000 + Math.random() * 90000));
	}

	private sendEmail(email: string, code: string) {
		console.log(`Email sent to ${email} with code: ${code}`);
	}
	
	private sendSMS(phone: string, code: string) {
		console.log(`SMS sent to ${phone} with code: ${code}`);
	}
	
	private nowPlusMinutes(minutes: number) {
		return Math.floor((Date.now() / 1000) + minutes * 60);
	}

	private nowInSeconds() {
		return Math.floor(Date.now() / 1000);
	}
}

export default PasswordResetService;