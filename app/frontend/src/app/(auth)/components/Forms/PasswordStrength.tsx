import SlideInOut from "./SlideInOut";

function getPasswordStrength(password: string) : PasswordStrengthDisplay {
	let strength = 0;

	if (password.length < 8) return { width: 'w-[10%]', bgcolor: 'bg-red-500', text: 'Weak', textcolor: 'text-red-500' };
	if (/(?=.*[a-z])/.test(password)) strength++;
	if (/(?=.*[A-Z])/.test(password)) strength++;
	if (/(?=.*\d)/.test(password)) strength++;
	if (/(?=.*[@$!%*?&])/.test(password)) strength++;
	
	if (strength == 1) return { width: 'w-[40%]', bgcolor: 'bg-red-500', text: 'Weak', textcolor: 'text-red-500' };
	if (strength == 2) return { width: 'w-[60%]', bgcolor: 'bg-yellow-500', text: 'Medium', textcolor: 'text-yellow-500' };
	if (strength == 3) return { width: 'w-[90%]', bgcolor: 'bg-green-400', text: 'Good', textcolor: 'text-green-400' };
	if (strength == 4) return { width: 'w-[100%]', bgcolor: 'bg-green-500', text: 'Strong', textcolor: 'text-green-500' };
	return { width: 'w-[100%]', bgcolor: 'bg-green-500', text: 'Strong', textcolor: 'text-green-500' };
}

type PasswordStrengthProps = {
	value: string;
}

type PasswordStrengthDisplay = {
	width: string;
	bgcolor: string;
	text: string;
	textcolor: string;
}

export default function PasswordStrength({ value }: PasswordStrengthProps) {

	const passwordStrength = getPasswordStrength(value);

	return (
		<SlideInOut>
			<div className="mt-1 flex items-center gap-2 w-[99%] self-center">
				<div className="h-1 bg-white/20 w-full rounded">
					<div className={`h-1 ${passwordStrength.bgcolor} rounded ${passwordStrength.width} transition-all duration-300`}></div>
				</div>
				<span className={`${passwordStrength.textcolor} font-bold text-sm`}>{passwordStrength.text}</span>
			</div>
		</SlideInOut>
	);
}