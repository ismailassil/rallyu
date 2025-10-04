import React from 'react';
import { METHODS_META } from './constants';
import { Fingerprint, LoaderCircle, ChevronRight } from 'lucide-react';

interface MethodsOverviewProps {
	methods: string[];
	selectedMethod: string;
	isSendingCode: boolean;
	onSelectMethod: (method: string) => void;
}

export default function MethodsOverview({ methods, selectedMethod, isSendingCode, onSelectMethod }: MethodsOverviewProps) {
	return (
		<>
			{/* Header */}
			<div className='flex flex-col'>
				<Fingerprint size={64} className="bg-blue-500 rounded-full p-2 self-center mb-6"/>
				<h1 className='font-semibold text-3xl text-center mb-3'>Two-Factor Authentication</h1>
				<p className='mb-0 text-white/85 text-center'>Select one of the following methods to complete verification.</p>
			</div>

			{/* Methods List */}
			<div className='flex flex-col gap-4 w-full'>
				{methods.map(m => {
					return (
						<button 
							key={m} 
							onClick={() => onSelectMethod(m)}
							disabled={isSendingCode}
							className={`single-two-fa-card ${isSendingCode ? 'cursor-not-allowed pointer-events-none brightness-75' : 'cursor-pointer'}`}
						>
							<div className='w-full flex justify-between items-center gap-16'>
								<div className='flex gap-4 items-center'>
									{METHODS_META[m].icon}
									<div>
										<h1 className='font-semibold text-sm sm:text-base md:text-lg lg:text-2xl mb-1.5 flex items-center gap-4'>{METHODS_META[m].title}</h1>
										<p className='font-light text-sm lg:text-base text-white/75'>{METHODS_META[m].description}</p>
									</div>
								</div>
								{(isSendingCode && selectedMethod === m) ? <LoaderCircle size={36} className='ml-auto animate-spin'/> : <ChevronRight size={36} className='ml-auto'/>}
							</div>
						</button>
					);
				})}
			</div>
		</>
	);
}