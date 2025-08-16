// /* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { APIClient } from '@/app/(api)/APIClient';
import SocketClient from '@/app/(api)/SocketClient';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthContextType, LoggedInUser } from './auth.context.types';

const AuthContext = createContext<AuthContextType | null>(null);
const apiClient = new APIClient('http://localhost:4025/api');
const socket = new SocketClient();

export function useAuth() : AuthContextType {
	const ctx = useContext(AuthContext);
	if (!ctx)
		throw new Error('useAuth must be used within an auth provider');
	return ctx;
}

type AuthProviderType = {
	children: ReactNode;
}

export default function AuthProvider({ children } : AuthProviderType ) {
	const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	// THIS USE EFFECT WILL ONLY RUN ON PAGE FIRSTLOAD/REFRESH
	useEffect(() => {
		async function initializeAuth() {
			try {
				const { user, accessToken } = await apiClient.refreshToken();
	
				// TODO: SHOULD BE DONE SOMEWHERE ELSE
				const userAvatarBlob = await apiClient.getUserAvatar(user.avatar_path);
				const userAvatarURL = URL.createObjectURL(userAvatarBlob);
				user.avatar_url = userAvatarURL;
	
				setLoggedInUser(user);
				setIsAuthenticated(true);
				socket.connect(accessToken);
			} catch {
				console.log('No valid refresh token found!');
				setLoggedInUser(null);
				setIsAuthenticated(false);
			} finally {
				setIsLoading(false);
			}
		}

		initializeAuth();
	}, []);
	
	async function login(username: string, password: string) {
		try {
			setIsLoading(true);
			const { user, accessToken } = await apiClient.login({ username, password });

			// TODO: SHOULD BE DONE SOMEWHERE ELSE
			const userAvatarBlob = await apiClient.getUserAvatar(user.avatar_path);
			const userAvatarURL = URL.createObjectURL(userAvatarBlob);
			user.avatar_url = userAvatarURL;

			setLoggedInUser(user);
			setIsAuthenticated(true);
			socket.connect(accessToken);
		} catch (err) {
			console.log('Login Error Catched in AuthContext: ', err);
			throw err; // TODO: SHOULD WE PROPAGATE?
			// setUser(null);
			// setIsAuthenticated(false);
		} finally {
			setIsLoading(false);
		}
	}

	async function logout() {
		try {
			await apiClient.logout();
			setLoggedInUser(null);
			setIsAuthenticated(false);
			socket.disconnect();
		} catch (err) {
			console.log('Logout Error Catched in AuthContext: ', err);
			throw err; // TODO: SHOULD WE PROPAGATE?
		}
	}
	
	async function register(
		first_name: string, 
		last_name: string, 
		username: string, 
		email: string, 
		password: string 
	) {
		try {
			await apiClient.register({ first_name, last_name, username, email, password });
		} catch (err) {
			console.log('Register Error Catched in AuthContext: ', err);
			throw err;
		}
	}

	async function updateLoggedInUserState(payload: Partial<LoggedInUser>) {
		setLoggedInUser(prev => prev ? { ...prev, ...payload } : prev);
	}

	const value = {
		// STATE
		loggedInUser,
		updateLoggedInUserState,
		isLoading,
		isAuthenticated,

		// ACTIONS
		register,
		login,
		logout,
		apiClient,
		socket
	};

	return (
		<AuthContext.Provider value={value}>
			<h1 className='fixed top-0 left-30'>AuthProvider</h1>
			{children}
		</AuthContext.Provider>
	);
}
