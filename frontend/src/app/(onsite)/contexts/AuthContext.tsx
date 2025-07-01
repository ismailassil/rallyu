/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type User = {
	id: string;
	username: string;
	email: string;
}

type AuthContextType = {
	accessToken: string | null;
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	register: (first_name: string, last_name: string, username: string, email: string, password: string) => Promise<void>;
	login: (username: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	refreshToken: () => Promise<string>;
	getCurrentUser: () => Promise<User | null>;
	authFetch: (url: string) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | null>(null);

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
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	// will run one on page refresh
	useEffect(() => {
		initializeAuth();
	}, []);

	async function initializeAuth() {
		try {
			await refreshToken();
		} catch {
			console.log('No valid refresh token found!');
		} finally {
			setIsLoading(false);
		}
	}

	async function refreshToken() : Promise<string> {
		try {
			const response = await fetch(`http://localhost:4000/api/auth/refresh`, {
				method: 'GET',
				credentials: 'include',
			});

			if (!response.ok)
				throw new Error('Token refresh failed');

			const { data } = await response.json();

			setAccessToken(data.accessToken);
			console.log('accessToken from refresh: ', data.accessToken);
			const usr = await getCurrentUser(data.accessToken);
			console.log('user returned from getCurrentUser()', usr);
			// setUser(data.user);
			setIsAuthenticated(true);

			return data.accessToken;
		} catch (err) {
			setAccessToken(null);
			setUser(null);
			setIsAuthenticated(false);
			throw err;
		}
	}

	async function register(
		first_name: string,
		last_name: string,
		username: string,
		email: string,
		password: string
	) : Promise<void> {
		try {
			setIsLoading(true);

			const response = await fetch(`http://localhost:4000/api/auth/register`, {
				method: 'POST',
				headers: {
					'Content-Type': `application/json`
				},
				body: JSON.stringify({
					first_name,
					last_name,
					username,
					email,
					password
				})
			});

			if (!response.ok) {
				const { error: errorMsg } = await response.json();
				throw new Error(errorMsg || 'Registration failed');
			}

		} catch (err) {
			throw err;
		} finally {
			setIsLoading(false);
		}
	}

	async function login(username: string, password: string) : Promise<void> {
		try {
			setIsLoading(true);

			const response = await fetch(`http://localhost:4000/api/auth/login`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': `application/json`
				},
				body: JSON.stringify({
					username,
					password
				})
			});

			if (!response.ok) {
				const { error: errorMsg } = await response.json();
				throw new Error(errorMsg || 'Login failed');
			}

			const { data } = await response.json();

			setAccessToken(data.accessToken);
			setUser(data.user);
			setIsAuthenticated(true);
		} catch (err) {
			setAccessToken(null);
			setUser(null);
			setIsAuthenticated(false);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}

	async function logout() : Promise<void> {
		try {
			const response = await fetch(`http://localhost:4000/api/auth/logout`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Authorization': `Bearer ${accessToken}`
				}
			});

			if (!response.ok) {
				const { error: errorMsg } = await response.json();
				throw new Error(errorMsg || 'Logout failed');
			}
		} catch (err) {
			console.log('Logout request failed: ', err);
		} finally {
			setAccessToken(null);
			setUser(null);
			setIsAuthenticated(false);
		}
	}

	async function getCurrentUser(tokenOverride?: string) : Promise<User | null> {
		const token = tokenOverride || accessToken;
		console.log('getCurrentUser with AccessToken: ', token);
		if (!token) return null;
		console.log('token is present');

		try {
			const response = await fetch(`http://localhost:4000/api/users/me`, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': `application/json`
				}
			});

			if (!response.ok) {
				throw new Error('Failed to get user data');
			}
			
			const { data } = await response.json();
			console.log('res', data);

			setUser(data);
			return data;
		} catch (err) {
			console.log('Get current user failed: ', err);
			throw err;
		}
	}

	async function authFetch(url: string) : Promise<Response> {
		async function makeRequest(token: string | null) {
			return fetch(url, {
				credentials: 'include',
				headers: {
					'Authorization': `Bearer ${token}`
				},
			});
		}

		try {
			let response = await makeRequest(accessToken);

			if (response.status === 401 && accessToken) {
				try {
					const newToken = await refreshToken();
					response = await makeRequest(newToken);
				} catch {
					logout();
					throw new Error('Session expired. Please login again.');
				}
			}

			return response;
		} catch (err) {
			throw err;
		}
	}

	const value = {
		// state
		accessToken,
		user,
		isLoading,
		isAuthenticated,

		// actions
		register,
		login,
		logout,
		refreshToken,
		getCurrentUser,
		authFetch
	};

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
}
