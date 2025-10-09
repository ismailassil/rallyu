'use client';
import React, { createContext, useContext } from 'react';

type FormContextType = {
	formData: Record<string, string>;
	touched: Record<string, boolean>;
	errors: Record<string, string>;
	debounced: Record<string, boolean>;
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	validateAll: () => boolean;
	getValidationErrors: () => Record<string, string> | null,
	resetForm?: (newValues?: Record<string, string>) => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export function useFormContext() {
	const context = useContext(FormContext);
	if (!context) {
		throw new Error('useFormContext must be used within a FormProvider');
	}
	return context;
}

export type FormProviderProps = {
	children: React.ReactNode;
} & FormContextType;

export function FormProvider({ children, ...contextValue }: FormProviderProps) {
	return (
		<FormContext.Provider value={contextValue}>
			{children}
		</FormContext.Provider>
	);
}