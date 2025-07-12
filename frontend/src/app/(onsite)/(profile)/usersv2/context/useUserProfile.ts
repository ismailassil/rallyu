'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';

export default function useUserProfile(username: string) {
	const { api } = useAuth();
	const [isLoading, setIsLoading] = useState(true);
	const [userProfile, setUserProfile] = useState(null);

	useEffect(() => {
		console.log('useEffect in useUserProfile');
		initializeUserProfile(username);
	}, [username]);

	async function initializeUserProfile(username: string) {
		try {
			const userProfile = await api.getUser(username);
			setUserProfile(userProfile);
		} catch {
			setUserProfile(null);
		} finally {
			setIsLoading(false);
		}
	}

	return {
		isLoading,
		userProfile
	};
}
