import React from "react";
import { RefObject, useEffect } from "react";

interface CodeInputProps {
	code: string[];
	setCode: (newCode: string[]) => void;
	inputRefs: RefObject<(HTMLInputElement | null)[]>;
	isDisabled: boolean;
	children?: React.ReactNode;
}

export default function OTPCodeInput({ code, setCode, inputRefs, isDisabled, children } : CodeInputProps) {
	useEffect(() => {
		if (inputRefs.current?.[0])
			inputRefs.current?.[0]?.focus();
	}, [inputRefs]);

	function handleChange(i: number, value: string) {
		if (!/^\d*$/.test(value)) return;
	
		const newCode = [...code];
		newCode[i] = value.slice(-1);
		setCode(newCode);
	
		if (value && i < 5)
			inputRefs.current?.[i + 1]?.focus();
	}

	function handleKeyPress(i: number, e: React.KeyboardEvent) {
		if (e.key === 'ArrowLeft' || e.key === 'ArrowRight')
			e.preventDefault();
		if (e.key === 'Backspace' && !code[i] && i > 0) {
			inputRefs.current?.[i - 1]?.focus();
		}
	}

	function handlePaste(e: React.ClipboardEvent) {
		e.preventDefault();
		const data = e.clipboardData.getData('text').replace(/\D/g, '');
	
		if (data.length === 6) {
			const newCode = data.split('');
			setCode(newCode);
		}
	}

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-row justify-between gap-2 h-18 sm:h-20">
				{code.map((c, i) => {
					return (
						<input 
							key={i}
							ref={(el) => { inputRefs.current[i] = el; }}
							value={code[i]}
							onChange={(e) => handleChange(i, e.target.value)}
							onKeyDown={(e) => handleKeyPress(i, e)}
							onPaste={(e) => handlePaste(e)}
							disabled={isDisabled}
							className="bg-white/8 border-2 border-white/10 flex-1 h-full w-[24px] text-3xl text-center font-bold rounded-xl focus:bg-white/20 focus:border-white/20 focus:outline-none focus-within:scale-103 transition-all duration-300 caret-transparent"
						/>
					);
				})}
			</div>
			<div>
				{children}
			</div>
		</div>
	);
}
