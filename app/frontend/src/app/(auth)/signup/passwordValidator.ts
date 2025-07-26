export default function passwordValidator(password: string) {
	const minLength = 8;
	const hasNumber = /[0-9]/.test(password);
	const hasUpperCase = /[A-Z]/.test(password);
	const hasLowerCase = /[a-z]/.test(password);
	const hasSpecial = /[!@#$%^&*(),.?:{}|<>]/.test(password);

	enum PasswordError {
		TooShort = 1,
		MissingNumber,
		MissingUpperCase,
		MissingLowerCase,
		MissingSpecial,
		Success = 0,
	}

	if (password.length < minLength) return PasswordError.TooShort;
	if (!hasNumber) return PasswordError.MissingNumber;
	if (!hasUpperCase) return PasswordError.MissingUpperCase;
	if (!hasLowerCase) return PasswordError.MissingLowerCase;
	if (!hasSpecial) return PasswordError.MissingSpecial;

	return PasswordError.Success;
}
