// /* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { APIClient } from '@/app/(api)/APIClient';
import SocketClient from '@/app/(api)/SocketClient';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthContextType, LoggedInUser } from './auth.context.types';

const AuthContext = createContext<AuthContextType | null>(null);
// const apiClient = new APIClient('http://localhost:4025/api');
let apiClient: APIClient;
let socket: SocketClient;

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
	const [isBusy, setIsBusy] = useState<boolean>(false);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			apiClient = new APIClient(`${window.location.origin}/api`);
			socket = new SocketClient(window.location.origin);
		}
	}, []);

	// THIS USE EFFECT WILL ONLY RUN ON PAGE FIRSTLOAD/REFRESH
	useEffect(() => {
		console.log('AuthProvider useEffect - Checking authentication status...');
		async function initializeAuth() {
			try {
				const { user, accessToken } = await apiClient.refreshToken();

				socket.connect(accessToken);
				setLoggedInUser(user);
				setIsAuthenticated(true);
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
			// setIsLoading(true);
			const res = await apiClient.login({ username, password });
			if (res._2FARequired) {
				sessionStorage.setItem('token', JSON.stringify(res.token));
				sessionStorage.setItem('enabledMethods', JSON.stringify(res.enabled2FAMethods));
				return res;
			}

			const { user, accessToken } = res;

			socket.connect(accessToken);
			setLoggedInUser(user);
			setIsAuthenticated(true);
			return user;
		} catch (err) {
			console.log('Login Error Catched in AuthContext: ', err);
			throw err; // TODO: SHOULD WE PROPAGATE?
			// setUser(null);
			// setIsAuthenticated(false);
		} finally {
			// setIsLoading(false);
		}
	}

	async function send2FACode(token: string, method: string) {
		return apiClient.send2FACode({ token, method });
	}

	async function loginUsing2FA(token: string, code: string) {
		console.log('loginUsing2FA');
		try {
			const { user, accessToken } = await apiClient.auth.loginUsing2FA(
				token,
				code
			);

			socket.connect(accessToken);
			setLoggedInUser(user);
			setIsAuthenticated(true);
		} catch (err) {
			throw err;
		} finally {
			sessionStorage.removeItem('token');
			sessionStorage.removeItem('enabledMethods');
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

	async function triggerLoggedInUserRefresh() {
		if (!loggedInUser)
			return ;

		try {
			const data = await apiClient.fetchUser(loggedInUser!.id);
			setLoggedInUser(data.user);
		} catch (err) {
			throw err;
		}
	}

	const value = {
		// STATE
		loggedInUser,
		updateLoggedInUserState,
		isLoading,
		isAuthenticated,
		isBusy,
		setIsBusy,

		// ACTIONS
		register,
		login,
		send2FACode,
		loginUsing2FA,
		logout,
		apiClient,
		triggerLoggedInUserRefresh,
		socket
	};

	return (
		<AuthContext.Provider value={value}>
			{/* <h1 className='fixed top-0 left-30'>AuthProvider</h1> */}
			{children}
		</AuthContext.Provider>
	);
}
