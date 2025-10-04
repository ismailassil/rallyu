'use client';
import { ArrowLeft, RotateCw } from "lucide-react";
import FormField from "../../components/Forms/FormField";
import { useRouter } from "next/navigation";
import FormButton from "../../components/UI/FormButton";

export function ForgotPassword({ email, error, onSubmit, onChange, onGoBack } : { email: string, error: string, onSubmit: () => void, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onGoBack: () => void }) {
	const router = useRouter();

	return (
		<>
			{/* Header + Go Back */}
			<div className="flex gap-4 items-center mb-4">
				<button 
					onClick={onGoBack}
					className="bg-blue-500/25 rounded-2xl p-2 hover:bg-blue-500/90 transition-all duration-300 cursor-pointer">
					<ArrowLeft size={40} />
				</button>
				<div>
					<h1 className='font-semibold text-lg sm:text-3xl inline-block'>Forgot your password?</h1>
					<p className='text-gray-300 text-sm sm:text-balance'>We&#39;ll send you a 6-digit verification code</p>
				</div>
			</div>
			<FormField 
				className='field flex flex-col gap-0.5 box-border'
				iconSrc='/icons/mail.svg'
				label='Email'
				field='email'
				inputPlaceholder='iassil@1337.student.ma'
				inputValue={email}
				onChange={onChange}
				touched={true}
				error={error}
				debounced={true}
			/>
			<FormButton
				text='Reset Password'
				icon={<RotateCw size={16} />}
				type='submit'
			/>
			<p className='self-center'>Remember your password? <span onClick={() => router.push('/signup')} className='font-semibold text-blue-500 hover:underline cursor-pointer'>Sign in</span></p>
		</>
	);
}
