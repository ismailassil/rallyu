import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';

// Animated progress bar loader
const ProgressBarLoader = () => {
	const [progress, setProgress] = useState(0);
	const [stage, setStage] = useState('Initializing...');
  
	useEffect(() => {
	  const stages = [
		{ progress: 20, text: 'Connecting to server...' },
		{ progress: 40, text: 'Verifying credentials...' },
		{ progress: 60, text: 'Loading user data...' },
		{ progress: 80, text: 'Setting up session...' },
		{ progress: 95, text: 'Almost ready...' }
	  ];
  
	  const interval = setInterval(() => {
		setProgress(prev => {
		  const nextStage = stages.find(s => s.progress > prev);
		  if (nextStage) {
			setStage(nextStage.text);
			return nextStage.progress;
		  }
		  return prev;
		});
	  }, 500);
  
	  return () => clearInterval(interval);
	}, []);
  
	return (
	  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
		<div className="w-full max-w-lg space-y-8">
		  <div className="text-center">
			<div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
			  <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
			</div>
			<h2 className="text-3xl font-bold text-gray-800 mb-2">Authenticating</h2>
			<p className="text-gray-600">{stage}</p>
		  </div>
		  
		  <div className="space-y-3">
			<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
			  <div 
				className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 ease-out relative"
				style={{ width: `${progress}%` }}
			  >
				<div className="absolute inset-0 bg-white bg-opacity-30 animate-pulse"></div>
			  </div>
			</div>
			<div className="flex justify-between text-sm text-gray-500">
			  <span>Authenticating</span>
			  <span>{progress}%</span>
			</div>
		  </div>
		</div>
	  </div>
	);
  };
  
  // Minimal progress bar
  const MinimalProgressBar = () => {
	const [progress, setProgress] = useState(0);
  
	useEffect(() => {
	  const interval = setInterval(() => {
		setProgress(prev => prev < 90 ? prev + 10 : prev);
	  }, 300);
  
	  return () => clearInterval(interval);
	}, []);
  
	return (
	  <div className="min-h-screen bg-white flex items-center justify-center">
		<div className="w-full max-w-md space-y-6">
		  <div className="text-center space-y-4">
			<h2 className="text-2xl font-semibold text-gray-800">Loading</h2>
			<p className="text-gray-600">Verifying your access...</p>
		  </div>
		  
		  <div className="space-y-2">
			<div className="w-full bg-gray-200 rounded-full h-2">
			  <div 
				className="h-full bg-blue-500 rounded-full transition-all duration-300"
				style={{ width: `${progress}%` }}
			  ></div>
			</div>
			<div className="text-right text-sm text-gray-500">{progress}%</div>
		  </div>
		</div>
	  </div>
	);
  };
  
  // Indeterminate progress bar
  const IndeterminateProgressBar = () => (
	<div className="min-h-screen bg-slate-50 flex items-center justify-center">
	  <div className="w-full max-w-md space-y-6">
		<div className="text-center space-y-4">
		  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center">
			<div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
		  </div>
		  <h2 className="text-2xl font-bold text-gray-800">Authenticating</h2>
		  <p className="text-gray-600">Please wait while we secure your session</p>
		</div>
		
		<div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
		  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse">
			<div className="h-full bg-white bg-opacity-40 animate-ping"></div>
		  </div>
		</div>
	  </div>
	</div>
  );
  
  // Step-by-step progress bar
  const StepProgressBar = () => {
	const [currentStep, setCurrentStep] = useState(0);
	
	const steps = [
	  'Connecting',
	  'Authenticating', 
	  'Loading Profile',
	  'Ready'
	];
  
	useEffect(() => {
	  const interval = setInterval(() => {
		setCurrentStep(prev => prev < steps.length - 1 ? prev + 1 : prev);
	  }, 800);
  
	  return () => clearInterval(interval);
	}, []);
  
	return (
	  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
		<div className="w-full max-w-2xl space-y-8">
		  <div className="text-center">
			<h2 className="text-3xl font-bold text-gray-800 mb-4">Setting Up Your Session</h2>
			<p className="text-gray-600">Please wait while we prepare everything for you</p>
		  </div>
		  
		  <div className="space-y-6">
			<div className="flex justify-between items-center">
			  {steps.map((step, index) => (
				<div key={step} className="flex items-center">
				  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
					index <= currentStep 
					  ? 'bg-green-500 text-white' 
					  : index === currentStep + 1 
						? 'bg-blue-500 text-white animate-pulse' 
						: 'bg-gray-200 text-gray-500'
				  }`}>
					{index < currentStep ? '✓' : index + 1}
				  </div>
				  {index < steps.length - 1 && (
					<div className={`w-20 h-1 mx-2 rounded transition-all duration-300 ${
					  index < currentStep ? 'bg-green-500' : 'bg-gray-200'
					}`}></div>
				  )}
				</div>
			  ))}
			</div>
			
			<div className="text-center">
			  <p className="text-lg font-medium text-gray-700">
				{steps[currentStep]}
				{currentStep < steps.length - 1 && <span className="animate-pulse">...</span>}
			  </p>
			</div>
		  </div>
		</div>
	  </div>
	);
  };
  
  export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();
  
	// useEffect(() => {
	//   console.log('useEffect in a ProtectedRoute');
	//   console.log('isAuthenticated: ', isAuthenticated);
	//   console.log('isLoading: ', isLoading);
  
	//   if (!isLoading && !isAuthenticated) {
	// 	router.replace('/login');
	//   }
	// }, [isLoading, isAuthenticated, router]);
  
	// if (isLoading || !isAuthenticated) {
	  // Choose one of these progress bar components:
	//   return <ProgressBarLoader />;
	  return <MinimalProgressBar />;
	//   return <IndeterminateProgressBar />;
	  return <StepProgressBar />;
	// }
  
	// return <>{children}</>;
  }