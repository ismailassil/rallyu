import React, { RefObject, useEffect, useImperativeHandle } from 'react';
import InputField from '@/app/(auth)/components/Form/InputField';
import LanguageSwitcher from '../../items/LanguageSwitcher';
import AvailabilityIndicator from '@/app/(auth)/components/Form/AvailabilityIndicator';
import useAvailabilityCheck from '@/app/hooks/useAvailabilityCheck';
import { useTranslations } from 'next-intl';
import useForm from '@/app/hooks/useForm';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import useValidationSchema from '@/app/hooks/useValidationSchema';
import useAPICall from '@/app/hooks/useAPICall';
import { toastError } from '@/app/components/CustomToast';
import { useFormContext } from '@/app/(auth)/components/Form/FormContext';

interface PersonalInformationsFormProps {
	ref: RefObject<any>;
	onChange: (hasUnsavedChanges: boolean) => void;
}

export default function PersonalInformationsForm({ ref, onChange } : PersonalInformationsFormProps) {
	const t = useTranslations('auth.common');
	const tautherr = useTranslations('auth');

	const {
		loggedInUser,
		apiClient
	} = useAuth();

	const { executeAPICall } = useAPICall();

	const {
		formData,
		debounced,
		errors,
		validateAll,
		getValidationErrors,
		resetForm
	} = useFormContext();

	const { status: usernameStatus, setStatus: setUsernameStatus } = useAvailabilityCheck(
		"username",
		formData.username,
		loggedInUser!.username,
		debounced.username,
		errors.username
	);
	const { status: emailStatus, setStatus: setEmailStatus } = useAvailabilityCheck(
		"email",
		formData.email,
		loggedInUser!.email,
		debounced.email,
		errors.email
	);

	async function handleSubmit() {
		// console.group('handleSubmit of PersonalInfoForm');
		console.log('You just triggered handleSubmit of personal info form');
		if (!loggedInUser) return ;

		const formHasChanges =
			formData.first_name !== loggedInUser.first_name ||
			formData.last_name !== loggedInUser.last_name ||
			formData.username !== loggedInUser.username ||
			formData.email !== loggedInUser.email ||
			formData.bio !== loggedInUser.bio;
		console.log('formHasChanges?', formHasChanges);
		if (!formHasChanges) return ;

		const isValid = validateAll();
		console.log('isValidForm?', isValid);
		if (!isValid) return ;

		if (formData.username !== loggedInUser.username && (!debounced.username || usernameStatus !== 'available')) return ;
		if (formData.email !== loggedInUser.email && (!debounced.email || emailStatus !== 'available')) return ;
		console.log('isUsername? isEmail?', true, true);

		const payloadToSubmit = {
			...(formData.first_name !== loggedInUser.first_name ? { first_name: formData.first_name } : {}),
			...(formData.last_name !== loggedInUser.last_name ? { last_name: formData.last_name } : {}),
			...(formData.username !== loggedInUser.username ? { username: formData.username } : {}),
			...(formData.email !== loggedInUser.email ? { email: formData.email } : {}),
			...(formData.bio !== loggedInUser.bio ? { bio: formData.bio } : {}),
		};
		if (Object.keys(payloadToSubmit).length === 0) return ;

		console.log('Form is valid to be submitted with the following payload: ', payloadToSubmit);

		try {
			await executeAPICall(() =>
				apiClient.user.updateUser(
					loggedInUser!.id,
					payloadToSubmit
			));
		} catch (err: any) {
			if (err.message === "AUTH_USERNAME_TAKEN") setUsernameStatus("unavailable");
			else if (err.message === "AUTH_EMAIL_TAKEN") setEmailStatus("unavailable");
			else toastError(tautherr("errorCodes", { code: err.message }));
		}
	}

	useEffect(() => {
		if (!loggedInUser) return ;

		const formHasChanges =
			formData.first_name !== loggedInUser.first_name ||
			formData.last_name !== loggedInUser.last_name ||
			formData.username !== loggedInUser.username ||
			formData.email !== loggedInUser.email ||
			formData.bio !== loggedInUser.bio;
		if (!formHasChanges) {
			console.log('cannot save because form doesnt have any changes from loggedInUser');
			onChange(false);
			return ;
		}
		const formHasErrors = getValidationErrors();
		if (formHasErrors) {
			console.log('cannot save because form doesnt has errors');
			onChange(false);
			return ;
		}

		if (formData.username !== loggedInUser.username && (!debounced.username || usernameStatus !== 'available')) {
			console.log('cannot save because username changed, but not debounced yet or is not available');
			onChange(false);
			return ;
		}
		if (formData.email !== loggedInUser.email && (!debounced.email || emailStatus !== 'available')) {
			console.log('cannot save because email changed, but not debounced yet or is not available');
			onChange(false);
			return ;
		}
		console.log('we can save');
		onChange(true);
	}, [formData, debounced.email, debounced.username, usernameStatus, emailStatus]);

	useEffect(() => {
		if (!loggedInUser) return ;

		resetForm({
			first_name: loggedInUser.first_name,
			last_name: loggedInUser.last_name,
			username: loggedInUser.username,
			email: loggedInUser.email,
			bio: loggedInUser.bio
		});
	}, [loggedInUser]);

	useImperativeHandle(ref, () => ({
		submit: handleSubmit
	}));

	return (
		<div className="flex flex-col gap-4">
			<div className='flex flex-col gap-5'>
				<InputField
					className='field flex flex-col gap-0.5 min-w-0 flex-1'
					iconSrc='/icons/firstname.svg'
					label={t('first_name')}
					field='first_name'
					inputPlaceholder='Achraf'
				/>
				<InputField
					className='field flex flex-col gap-0.5 min-w-0 flex-1'
					iconSrc='/icons/lastname.svg'
					label={t('last_name')}
					field='last_name'
					inputPlaceholder='Demnati'
				/>
				<InputField
					className='field flex flex-col gap-0.5 box-border'
					iconSrc='/icons/at.svg'
					label={t('username')}
					field='username'
					inputPlaceholder='xezzuz'
				>
					{debounced.username && !errors.username && formData.username !== loggedInUser!.username && <AvailabilityIndicator key="username-availability" label={t('username')} status={usernameStatus} />}
				</InputField>
				<InputField
					className='field flex flex-col gap-0.5 box-border'
					iconSrc='/icons/mail.svg'
					label={t('email')}
					field='email'
					inputPlaceholder='iassil@1337.student.ma'
				>
					{debounced.email && !errors.email && formData.email !== loggedInUser!.email && <AvailabilityIndicator key="email-availability" label={t('email')} status={emailStatus} />}
				</InputField>
				<InputField
					className='field flex flex-col gap-0.5 box-border'
					iconSrc='/icons/note.svg'
					label={t('bio')}
					field='bio'
					inputPlaceholder='DFK'
				/>
			</div>
			<LanguageSwitcher />
		</div>
	);
}
