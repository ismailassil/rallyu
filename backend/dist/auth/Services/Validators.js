export default function passwordValidator(password) {
	const minLength = 8;
	const hasNumber = /d/.test(password);
	const hasUpperCase = /[A-Z]/.test(password);
	const hasLowerCase = /[a-z]/.test(password);
	const hasSpecial = /[!@#$%^&*(),.?:{}|<>]/.test(password);
	let PasswordError;
	(function (PasswordError) {
		PasswordError[(PasswordError['TooShort'] = 1)] = 'TooShort';
		PasswordError[(PasswordError['MissingNumber'] = 2)] = 'MissingNumber';
		PasswordError[(PasswordError['MissingUpperCase'] = 3)] =
			'MissingUpperCase';
		PasswordError[(PasswordError['MissingLowerCase'] = 4)] =
			'MissingLowerCase';
		PasswordError[(PasswordError['MissingSpecial'] = 5)] = 'MissingSpecial';
		PasswordError[(PasswordError['Success'] = 0)] = 'Success';
	})(PasswordError || (PasswordError = {}));
	if (password.length < minLength) return PasswordError.TooShort;
	if (!hasNumber) return PasswordError.MissingNumber;
	if (!hasUpperCase) return PasswordError.MissingUpperCase;
	if (!hasLowerCase) return PasswordError.MissingLowerCase;
	if (!hasSpecial) return PasswordError.MissingSpecial;
	return PasswordError.Success;
}
