import React, { useReducer, useRef } from "react";
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
  fieldValue: string, 
  staleValues: Record<string, string>
) : string {
  try {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    // const fieldSchema = (zodSchema as any).shape?.[fieldName];
    // console.log('fieldSchema:', fieldSchema);
    // if (fieldSchema)
    //   fieldSchema.parse(fieldValue);
    zodSchema.parse({ ...staleValues, [fieldName]: fieldValue });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const fieldError = err.issues.find(issue => issue.path[0] === fieldName);
      return fieldError ? fieldError.message : '';
    }
      // return err.issues[0]?.message || 'Invalid value';
    return 'Invalid value';
  }
  return '';
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

  const { debounceMs = 600 } = options;
  const debounceTimeout = useRef<Record<string, NodeJS.Timeout>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) : void {
    const { name, value } = e.target;

    clearTimeout(debounceTimeout.current[name]);

    // immediate update
    dispatch({ type: 'CHANGE', name, value });

    const debounceDelay = typeof debounceMs === 'number' ? debounceMs : (debounceMs[name] || 600);
    
    debounceTimeout.current[name] = setTimeout(() => {
      const err = validateField(zodSchema, name, value, state.values);
      console.log('ValidateField Current Error:', name, value, err);
      // if (err)
      dispatch({ type: 'SET_ERROR', name, err });
    }, debounceDelay);
  }

  // function validateAll() : boolean {
  //  dispatch({ type: 'VALIDATE_ALL' });
  //  return validateAllSync();
  // }

  // function validateAllSync() : boolean {
  //  const errors: Record<string, string> = {};
  //  Object.keys(state.values).forEach(key => {
  //    const err = validateField(key, state.values[key]);
  //    if (err) errors[key] = err;
  //  });
  //  return Object.keys(errors).length === 0;
  // }

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