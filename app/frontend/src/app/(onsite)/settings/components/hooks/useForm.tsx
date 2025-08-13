import React, { useReducer, useRef } from "react";
import { validateField } from "./Helpers";

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
			const updatedTouched: Record<string, boolean> = {};
			const updatedErrors: Record<string, string> = {};
			const updatedDebounced: Record<string, boolean> = {};
			
			Object.keys(state.values).forEach(key => {
				const err = validateField(key, state.values[key], state.values);
				console.log(key, 'error', err);
				if (err) updatedErrors[key] = err;
			});
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
		default:
			return state;
	}
}

function useForm(initialValues: Record<string, string>) {
	const [state, dispatch] = useReducer(formReducer, {
		values: initialValues,
		touched: {},
		errors: {},
		debounced: {}
	});

	const debounceTimeout = useRef<Record<string, NodeJS.Timeout>>({});

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) : void {
		const { name, value } = e.target;

		console.log('FORM CHANGE: ', name, value);

		// const debounceMs = name === 'password' ? 2000 : 500 ;

		clearTimeout(debounceTimeout.current[name]);

		dispatch({ type: 'CHANGE', name, value });
		
		debounceTimeout.current[name] = setTimeout(() => {
			const err = validateField(name, value, state.values);
			dispatch({ type: 'SET_ERROR', name, err });
		  }, 1);
	}

	function validateAll() : boolean {
		dispatch({ type: 'VALIDATE_ALL' });
		return validateAllSync();
	}

	function validateAllSync() : boolean {
		const errors: Record<string, string> = {};
		Object.keys(state.values).forEach(key => {
			const err = validateField(key, state.values[key], state.values);
			if (err) {
				errors[key] = err;
				console.log('ERROR IN VALIDATE ALL SYNC', err);
			}
		});
		return Object.keys(errors).length === 0;
	}

	function resetForm() : void {
		dispatch({ type: 'RESET',  initialValues });
	}

	return [
		state.values,
		state.touched,
		state.errors,
		state.debounced,
		handleChange,
		validateAll,
		resetForm
	] as const;
}

export default useForm;