import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toastError, toastSuccess } from '@/app/components/CustomToast';

export default function Overview() {
	const { apiClient, loggedInUser } = useAuth();

	async function handleRequestVerifyEmail() {
		try {
			await apiClient.auth.requestVerifyEmail();
			toastSuccess('Code sent to email');
		} catch (err) {
			toastError(err.message);
		}
	}

	async function handleRequestVerifyPhone() {
		try {
			await apiClient.auth.requestVerifyPhone();
			toastSuccess('Code sent to phone');
		} catch (err) {
			toastError(err.message);
		}
	}

	return (
		<div>
			<div>
				<h1>Email: {loggedInUser!.email}</h1>
				<button>{loggedInUser!.email_verified ? 'Verified' : 'Verify'}</button>
			</div>
			<div>
				<h1>Phone: {loggedInUser!.phone}</h1>
				<button>{loggedInUser!.phone_verified ? 'Verified' : 'Verify'}</button>
			</div>
		</div>
	);
}


/*
	MethodsOverview

	if email in not set => Enter Email => Enter Code => Verified
	if email is set but not verified => Enter Code

	if phone in not set => Enter Phone => Enter Code => Verified
	if email is set but not verified => Enter Code

*/
/*

	STEP 1: Enter Email/Phone
	STEP 2: Enter OTP Code
*/
