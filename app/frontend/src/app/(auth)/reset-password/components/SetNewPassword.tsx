/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from "next/navigation";
import FormField from "../../components/Forms/FormField";
import FormButton from "../../components/UI/FormButton";
import { RotateCw } from "lucide-react";

// async function changePassword(email: string, code: string, password: string) : Promise<void> {
// 	const response = await fetch(`http://localhost:4025/api/auth/reset/update`, {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': `application/json`
// 		},
// 		body: JSON.stringify({
// 			email,
// 			code,
// 			password
// 		})
// 	});

// 	console.log('response status: ', response.status);

// 	if (response.status !== 200)
// 		throw new Error('Invalid code');
// }

export function SetNewPassword({ formData, errors, debounced, touched, onChange, onSubmit } : { formData: any, errors: any, debounced: any, touched: any, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onSubmit: () => void }) {
	const router = useRouter();
	// const [password, setPassword] = useState('');
	// const [confirmPassword, setConfirmPassword] = useState('');

	// function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
	// 	const { name, value } = e.target;

	// 	if (name === 'password')
	// 		setPassword(value);
	// 	else if (name === 'new_password')
	// 		setConfirmPassword(value);
	// }

	// async function handleSubmit(e: React.FormEvent) {
	// 	e.preventDefault();

	// 	if (password !== confirmPassword)
	// 		return ;

	// 	try {
	// 		await changePassword(email, code, password);
	// 		onValidSubmit();
	// 	} catch (err: any) {
	// 		console.log('error catched: ', err.message);
	// 	}
	// }

	return (
		<>
			{/* <div className='flex flex-col gap-2 mb-2'> */}
				{/* <div className='flex flex-row gap-2'> */}
					{/* <h1 className='font-semibold text-3xl'>Create a New Password</h1> */}
				{/* </div> */}
				{/* <p className='mb-0 text-gray-200'>Please enter and confirm your new password.</p> */}
			{/* </div> */}
			{/* <form className='flex flex-col gap-4' onSubmit={handleSubmit}> */}
				{/* <div className='field flex flex-col gap-0.5 box-border'> */}
					{/* <label htmlFor="password">Password</label> */}
					{/* <div className='flex flex-row pl-3.5 pr-3.5 pb-2 pt-2 gap-3 items-center h-11 bg-white/6 rounded-lg custom-input border border-white/10'> */}
						{/* <Image alt="Password" src={'/icons/lock.svg'} width={20} height={20}></Image> */}
						{/* <input id='password' name='password' type='password' placeholder='••••••' value={password} onChange={handleChange} className='outline-none flex-1 overflow-hidden'/> */}
					{/* </div> */}
				{/* </div> */}
				{/* <div className='field flex flex-col gap-0.5 box-border'> */}
					{/* <label htmlFor="new_password">Confirm Password</label> */}
					{/* <div className='flex flex-row pl-3.5 pr-3.5 pb-2 pt-2 gap-3 items-center h-11 bg-white/6 rounded-lg custom-input border border-white/10'> */}
						{/* <Image alt="Password" src={'/icons/lock.svg'} width={20} height={20}></Image> */}
						{/* <input id='new_password' name='new_password' type='password' placeholder='••••••' value={confirmPassword} onChange={handleChange} className='outline-none flex-1 overflow-hidden'/> */}
					{/* </div> */}
				{/* </div> */}
				{/* <button className='h-11 bg-blue-600 hover:bg-blue-700 rounded-lg mt-2' type='submit'>Reset Password</button> */}
			{/* </form> */}
			{/* <p className='self-center'>Remember your password? <a href='/signup' className='font-semibold text-blue-500 hover:underline'>Sign in</a></p> */}


					{/* Header + Go Back */}
					<div className="flex gap-4 items-center mb-4">
						{/* <button 
							onClick={onGoBack}
							className="bg-blue-500/25 rounded-2xl p-2 hover:bg-blue-500/90 transition-all duration-300 cursor-pointer">
							<ArrowLeft size={40} />
						</button> */}
						<div>
							<h1 className='font-semibold text-lg sm:text-3xl inline-block'>Create a New Password</h1>
							<p className='text-gray-300 text-sm sm:text-balance'>Please enter and confirm your new password</p>
						</div>
					</div>
					<FormField 
						className='field flex flex-col gap-0.5 box-border'
						iconSrc='/icons/lock.svg'
						label='Password'
						field='password'
						inputPlaceholder='••••••••••••••••'
						inputValue={formData.password}
						hidden={true}
						onChange={onChange}
						touched={touched.password}
						error={errors.password}
						debounced={debounced.password}
					/>
					<FormField 
						className='field flex flex-col gap-0.5 box-border'
						iconSrc='/icons/lock.svg'
						label='Confirm Password'
						field='confirm_password'
						inputPlaceholder='••••••••••••••••'
						inputValue={formData.confirm_password}
						hidden={true}
						onChange={onChange}
						touched={touched.confirm_password}
						error={errors.confirm_password}
						debounced={debounced.confirm_password}
					/>
					{/* <button
						onClick={onSubmit}
						className={`h-11 rounded-lg transition-all duration-500 
						bg-blue-600 hover:bg-blue-700 cursor-pointer`}
					>
						<span>Reset Password</span>
					</button> */}
					<FormButton
						text='Reset Password'
						icon={<RotateCw size={16} />}
						type='submit'
					/>
					<p className='self-center'>Remember your password? <span onClick={() => router.push('/signup')} className='font-semibold text-blue-500 hover:underline cursor-pointer'>Sign in</span></p>
		</>
	);
}
