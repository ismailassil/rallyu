export function validateField(
	name: string, 
	value: string,
	allValues?: Record<string, string>
): string {
	const trimmed = value.trim();

	switch (name) {
		case 'fname':
			if (!trimmed) return 'First name is required';
			return /^[A-Za-z]+$/.test(trimmed) ? '' : 'First name can only contain letters';

		case 'lname':
			if (!trimmed) return 'Last name is required';
			return /^[A-Za-z]+$/.test(trimmed) ? '' : 'Last name can only contain letters';

		case 'username':
			if (!trimmed) return 'Username is required';
			if (trimmed.length < 3) return 'Username must be at least 3 characters';
			if (trimmed.length > 20) return 'Username is too long';
			return /^[a-zA-Z0-9_]+$/.test(trimmed) ? '' : 'Username can only contain letters, numbers and underscore';

		case 'email':
			if (!trimmed) return 'Email is required';
			return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? '' : 'Please enter a valid email address';

		case 'password':
			if (!value) return 'Password is required';
			if (value.length < 8) return 'Password must be at least 8 characters long';
			if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
			if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
			if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
			return '';

		case 'current-password':
			if (!value) return 'Current password is required';
			return '';

		case 'new-password':
			if (!value) return 'New password is required';
			if (value.length < 8) return 'Password must be at least 8 characters long';
			if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
			if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
			if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
			if (!/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(value)) 
				return 'Password must contain at least one special character';
			if (allValues && value === allValues['current-password'])
				return "New password can't be the same as current password";
			return '';

		case 'new-confirm-password':
			if (!value) return 'Please confirm your new password';
			if (allValues && value !== allValues['new-password'])
				return "Passwords don't match";
			return '';

		default:
			return '';
	}
}
