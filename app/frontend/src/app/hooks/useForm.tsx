import React, { useEffect, useReducer, useRef } from "react";
import { z } from "zod";

type UseFormReturn = readonly [
	values: Record<string, string>,
	touched: Record<string, boolean>,
	errors: Record<string, string>,
	debounced: Record<string, boolean>,
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
	validateAll: () => boolean,
	getValidationErrors: () => Record<string, string> | null,
	resetForm: (newValues?: Record<string, string>) => void
];

type UseFormOptions = {
	debounceMs?: number | Record<string, number>; // debounce time per field in milliseconds
	fieldsDependencies?: Record<string, string[]>; // to trigger re-validation of fields that depend on each other
}

type FormState = {
	values: Record<string, string>;
	touched: Record<string, boolean>;
	errors: Record<string, string>;
	debounced: Record<string, boolean>;
};

type ChangeAction = {
	type: 'CHANGE';
	name: string;
	value: string;
}

type SetErrorAction = {
	type: 'SET_ERROR';
	name: string;
	err: string;
}

type ValidateAllAction = {
	type: 'VALIDATE_ALL';
	updatedErrors: Record<string, string>;
};

type ResetAction = {
	type: 'RESET';
	initialValues: Record<string, string>;
};

type FormAction = ChangeAction | SetErrorAction | ValidateAllAction | ResetAction;

function formReducer(state: FormState, action: FormAction) : FormState {
	switch (action.type) {
		case 'CHANGE': {
			const { name, value } = action;

			return {
				...state,
				values: { ...state.values, [name]: value },
				touched: { ...state.touched, [name]: true },
				debounced: { ...state.debounced, [name]: false }
			};
		}
		case 'SET_ERROR': {
			const { name, err } = action;

			const updatedErrors = { ...state.errors };
			if (err) updatedErrors[name] = err;
			else delete updatedErrors[name];
			return {
				...state,
				errors: updatedErrors,
				debounced: { ...state.debounced, [name]: true }
			};
		}
		case 'VALIDATE_ALL': {
			const { updatedErrors } = action;
			const updatedTouched: Record<string, boolean> = {};
			const updatedDebounced: Record<string, boolean> = {};

			// we moved validation outside

			// Object.keys(state.values).forEach(key => {
			//  const err = validateField(key, state.values[key]);
			//  console.log(key, 'error', err);
			//  if (err) updatedErrors[key] = err;
			// });

			Object.keys(state.values).forEach(key => {
				updatedTouched[key] = true;
				updatedDebounced[key] = true;
			});

			return {
				...state,
				touched: updatedTouched,
				errors: updatedErrors,
				debounced: updatedDebounced
			};
		}
		case 'RESET': {
			const { initialValues } = action;
			return {
				values: initialValues,
				touched: {},
				errors: {},
				debounced: {}
			};
		}
		default:
			return state;
	}
}

// validate all fields using zod schema
function validateAllFields(zodSchema: z.ZodSchema, values: Record<string, string>) : Record<string, string> {
	try {
		zodSchema.parse(values);
		return {};
	} catch (err) {
		if (err instanceof z.ZodError) {
		const currentErrors : Record<string, string> = {};

		console.log('ZodError:', err.issues);

		for (const issue of err.issues) {
			const fieldName = issue.path[0];
			if (typeof fieldName === 'string') {
			if (currentErrors[fieldName]) continue; // only keep the first error per field
			currentErrors[fieldName] = issue.message;
			}
		}

		return currentErrors;
		}
	}
	return {};
}

// validate a single field using zod schema
function validateField(
	zodSchema: z.ZodSchema,
	fieldName: string,
	formValues: Record<string, string>
) : string {
	try {
		console.group(`validateField [${fieldName}]=[${formValues[fieldName]}]`);
		console.group('formValues');
		console.log(formValues);
		console.groupEnd();
		zodSchema.parse(formValues);
		console.log('SUCCESS');
		console.groupEnd();
		return '';
	} catch (err) {
		if (err instanceof z.ZodError) {
			console.log('ZodError: ', err);
			console.log('Issues: ', err.issues);
			const fieldError = err.issues.find(issue => issue.path[0] === fieldName);
			err.issues.forEach(issue => console.log(`Current issue path[0]: `, issue.path[0]));
			console.log('fieldError: ', fieldError);
			console.groupEnd();
			return fieldError ? fieldError.message : '';
		}
		console.log(`DEV - UNEXPECTED ERROR VALIDATING FIELD [${fieldName}]:`, err);
		console.log('Reached the end of function');
		console.groupEnd();
		return '';
	}
}

function useForm(
	zodSchema: z.ZodObject<any>,
	initialValues: Record<string, string>,
	options: UseFormOptions = {}
) : UseFormReturn {
	const [state, dispatch] = useReducer(formReducer, {
		values: initialValues,
		touched: {},
		errors: {},
		debounced: {}
	});

	const { debounceMs = 600, fieldsDependencies = {} } = options;
	const debounceTimeout = useRef<Record<string, NodeJS.Timeout>>({});
	const stateRef = useRef(state);

	useEffect(() => {
		stateRef.current = state;
	}, [state]);


	function handleChange(e: React.ChangeEvent<HTMLInputElement>) : void {
		const { name, value } = e.target;

		clearTimeout(debounceTimeout.current[name]);

		// immediate update
		dispatch({ type: 'CHANGE', name, value });

		const debounceDelay = typeof debounceMs === 'number' ? debounceMs : (debounceMs[name] || 600);

		debounceTimeout.current[name] = setTimeout(() => {
			const currentState = stateRef.current;
			const freshValues = { ...currentState.values, [name]: value };

			// validate the changed field
			const err = validateField(zodSchema, name, freshValues);
			dispatch({ type: 'SET_ERROR', name, err });

			// validate fields that depends on the changed fields
			const dependentFields = fieldsDependencies[name] || [];
			dependentFields.forEach(toReValidate => {
				if (currentState.touched[toReValidate]) {
					const depErr = validateField(zodSchema, toReValidate, freshValues);
					dispatch({ type: 'SET_ERROR', name: toReValidate, err: depErr });
				}
			});
		}, debounceDelay);
	}

	function getValidationErrors() : Record<string, string> | null {
		const currentErrors = validateAllFields(zodSchema, state.values);

		return Object.keys(currentErrors).length === 0 ? null : currentErrors;
	}

	function validateAll() : boolean {
		const currentErrors = validateAllFields(zodSchema, state.values);

		console.log('ValidateAll Current Values:', state.values);

		console.log('ValidateAll Current Errors:', currentErrors);

		dispatch({ type: 'VALIDATE_ALL', updatedErrors: currentErrors });

		return Object.keys(currentErrors).length === 0;
	}

	function resetForm(newValues?: Record<string, string>) : void {
		dispatch({ type: 'RESET', initialValues: newValues || initialValues });
	}

	return [
		state.values,
		state.touched,
		state.errors,
		state.debounced,
		handleChange,
		validateAll,
		getValidationErrors,
		resetForm
	] as const;
}

export default useForm;
