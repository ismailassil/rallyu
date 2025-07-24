import React from 'react';
import { ArrowLeft, ChevronRight, Copy, Mail, Smartphone } from 'lucide-react';

const methods = [
	{
		id: 'auth_app',
		name: 'Auth App',
		description: '',
		inputTitle: '',
		placeholder: '',
	},
	{
		id: 'sms',
		name: 'SMS',
		description: `We'll send verification codes to this number.`,
		inputTitle: 'Phone number',
		inputIcon: <Smartphone className='h-5 w-5'/>,
		inputPlaceholder: '+212 636299821'
	},
	{
		id: 'email',
		name: 'Email',
		description: `We'll send verification codes to this email address.`,
		inputTitle: 'Email',
		inputIcon: <Mail className='h-5 w-5'/>,
		inputPlaceholder: 'iassil@student.1337.ma'
	}
];

function MockQRCode() {
	return (
		<div className="w-48 h-48 bg-white/10 rounded-2xl flex items-center justify-center">
            <div className="grid grid-cols-8 gap-1">
              {Array.from({ length: 64 }, (_, i) => (
                <div 
                  key={i} 
                  className={`w-3 h-3 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                />
              ))}
            </div>
        </div>
	);
}

export default function SetupInit({ selectedMethod }) {
	const method = methods.find(m => m.id === selectedMethod);

	if (!method)
		return null;

	if (selectedMethod !== 'auth_app')
		return (
			<>
				<div className='flex flex-col gap-2 mb-2'>
					<div className='flex flex-row gap-4 items-center'>
						<ArrowLeft className='h-7 w-7 cursor-pointer'/>
						{/* <img src='/icons/lock.svg' className='h-full w-[8%]'/> */}
						<h1 className='font-semibold text-3xl'>{`Setup 2FA via ${method.name}`}</h1>
					</div>
					<p className='mb-0 text-white/75'>{method.description}</p>
				</div>
				<form className='flex flex-col gap-4' >
					<div className='field flex flex-col gap-0.5 box-border'>
						<label htmlFor="phone">{method.inputTitle}</label>
						<div className='flex flex-row pl-3.5 pr-3.5 pb-2 pt-2 gap-3 items-center h-11 bg-white/6 rounded-lg custom-input border border-white/10'>
							{/* <Image alt="Phone" src={'/icons/mail.svg'} width={20} height={20}></Image> */}
							{method.inputIcon}
							<input id='phone' name='phone' type='text' placeholder={method.inputPlaceholder} className='outline-none flex-1 overflow-hidden'/>
						</div>
					</div>
					{/* <AnimatePresence>
						{error && <FormFieldError error={error} />}
					</AnimatePresence> */}
					<button className='h-11 w-fit self-end pl-4 pr-2 bg-blue-600 hover:bg-blue-700 rounded-lg mt-2 flex justify-center items-center gap-2' type='submit'>Continue<ChevronRight /></button>
				</form>
			</>
		);
	
	return (
		<>
			<div className='flex flex-row gap-4 items-center mb-6'>
				<ArrowLeft className='h-7 w-7 cursor-pointer'/>
				{/* <img src='/icons/lock.svg' className='h-full w-[8%]'/> */}
				<h1 className='font-semibold text-3xl'>{`Setup 2FA via ${method.name}`}</h1>
			</div>

			<div className='flex flex-col items-center gap-6 mb-6'>
				<MockQRCode />
				<p className='text-white-75'>Scan this QR code with your authenticator app</p>
			</div>

			<div className='mb-6'>
				<div className='bg-white/6 w-full rounded-2xl px-4 py-3 flex items-center mb-2'>
					<code className='text-center flex-1'>JBSWY3DPEHPK3PXP</code>
					<button className='cursor-pointer'>
						<Copy className='h-5 w-5'/>
					</button>
				</div>
				<p className='text-center text-sm text-white/75'>Can&#39;t scan? Enter this code manually in your app</p>
			</div>

			<button className='h-11 w-fit self-end pl-4 pr-2 bg-blue-600 hover:bg-blue-700 rounded-lg mt-2 flex justify-center items-center gap-2' type='submit'>Continue<ChevronRight /></button>
		</>
	);
}
