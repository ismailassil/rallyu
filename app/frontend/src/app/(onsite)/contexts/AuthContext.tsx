'use client';
import { APIClient } from '@/app/(api)/APIClient';
import SocketClient from '@/app/(api)/SocketClient';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthContextType, LoggedInUser } from './auth.context.types';

const AuthContext = createContext<AuthContextType | null>(null);

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

	const initializeAuth = async () => {
		console.group('initializeAuth');
		try {
			const { user, accessToken } = await apiClient.auth.refreshToken();

			socket.connect(accessToken);
			setLoggedInUser(user);
			setIsAuthenticated(true);
		} catch {
			setLoggedInUser(null);
			setIsAuthenticated(false);
		} finally {
			setIsLoading(false);
			console.groupEnd();
		}
	};

	// THIS USE EFFECT WILL ONLY RUN ON PAGE FIRSTLOAD/REFRESH
	useEffect(() => {
		console.log('AuthProvider useEffect - Checking authentication status...');
		initializeAuth();
	}, []);

	async function login(username: string, password: string) {
		try {
			// setIsLoading(true);
			const res = await apiClient.auth.login(
				username,
				password
			);

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
			throw err;
		} finally {
			// setIsLoading(false);
		}
	}

	async function loginUsing2FA(token: string, code: string) {
		try {
			// setIsLoading(true);
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
			// setIsLoading(false);
		}
	}

	async function logout() {
		try {
			await apiClient.auth.logout();

			socket.disconnect();
			setLoggedInUser(null);
			setIsAuthenticated(false);
		} catch {
			socket.disconnect();
			setLoggedInUser(null);
			setIsAuthenticated(false);
		}
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
		isLoading,
		isAuthenticated,
		isBusy,
		setIsBusy,

		// ACTIONS
		login,
		loginUsing2FA,
		logout,
		triggerLoggedInUserRefresh,
		triggerRefreshToken: initializeAuth,

		// INTERNALS
		apiClient,
		socket
	};

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
}
