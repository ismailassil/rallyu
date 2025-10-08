import React from 'react';
import { METHODS_META } from './constants';
import { Fingerprint, X, LoaderCircle } from 'lucide-react';

interface MethodsOverviewProps {
	methods: string[];
	isLoading: boolean;
	selectedMethod: string;
	onSetupMethod: (method: string) => void;
	onDisableMethod: (method: string) => void;
}

export default function MethodsOverview({ methods, isLoading, selectedMethod, onSetupMethod, onDisableMethod }: MethodsOverviewProps) {
	return (
		<div className="max-w-[575px] flex flex-col items-center gap-14">
			{/* Header */}
			<div className='flex flex-col'>
				<Fingerprint size={64} className="bg-blue-500 rounded-full p-2 self-center mb-6"/>
				<h1 className='font-semibold text-3xl text-center mb-3'>Two-Factor Authentication</h1>
				<p className='mb-0 text-white/85 text-center'>Add an extra layer of security to your account by choosing your preferred verification method.</p>
			</div>

			{/* Methods List */}
			<div className='flex flex-col gap-4 w-full'>
				{Object.keys(METHODS_META).map(m => {
					const isEnabled = methods.includes(m);
					const isSelectedMethod = selectedMethod === m;
					console.log('selectedMethod', selectedMethod, 'isSelected ? ', isSelectedMethod);
					return (
						<div key={METHODS_META[m].title} className="single-two-fa-card">
							<div>
								{METHODS_META[m].icon}
							</div>
							<div>
								<h1 className='font-semibold text-sm sm:text-base md:text-lg lg:text-2xl mb-1.5 flex items-center gap-4'>{METHODS_META[m].title}</h1>
								<p className='font-light text-sm lg:text-base text-white/75'>{METHODS_META[m].description}</p>
							</div>
							<button
								onClick={isEnabled ? () => onDisableMethod(m) : () => onSetupMethod(m)}
								disabled={isLoading}
								className={`border-1 rounded-full px-3.5 py-1.5 font-medium backdrop-blur-xs h-10 ml-auto transition-all duration-500
									${isEnabled
									? "border-red-500/20 bg-red-500/2 text-red-400 hover:bg-red-500/75 hover:text-white"
									: "border-blue-500/30 bg-blue-500/2 text-blue-400 hover:bg-blue-500 hover:text-white"
									} ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
							>
								<div className="flex items-center gap-2 justify-center">
									{(isLoading && isSelectedMethod) ? (
										<LoaderCircle size={16} className="animate-spin ml-auto" />
									) : isEnabled ? <X size={16} className="ml-auto" /> : <Fingerprint size={16} className="ml-auto" />}
									<span>{isEnabled ? "Disable" : "Setup"}</span>
								</div>
							</button>
						</div>
					);
				})}
			</div>

			{/* Recommendation */}
			<div className='bg-blue-500/6 px-6 py-4 rounded-2xl border-1 border-white/8 md:text-lg text-blue-400'>
				<p><span className='font-bold'>Recommendation: </span>Authenticator apps provide the highest security and work without internet connection.</p>
			</div>
		</div>
	);
}