/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { APIClient } from '@/app/(auth)/utils/APIClient';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type User = {
	id: string;
	username: string;
	email: string;
}

type AuthContextType = {
	// accessToken: string | null;
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	register: (first_name: string, last_name: string, username: string, email: string, password: string) => Promise<void>;
	login: (username: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	// refreshToken: () => Promise<string>;
	// getCurrentUser: () => Promise<User | null>;
	// authFetch: (url: string) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | null>(null);
const api = new APIClient('http://localhost:4000/api');

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
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	// will run one on page refresh
	useEffect(() => {
		if (document.cookie.includes('refreshToken'))
			initializeAuth();
		else {
			setIsAuthenticated(false);
			setIsLoading(false);
		}
	}, []);

	async function initializeAuth() {
		console.log('refreshToken exists? ', document.cookie.includes('refreshToken'));
		try {
			await api.refreshToken();
			const currentUser = await api.fetchCurrentUser();
			setUser(currentUser);
			setIsAuthenticated(true);
		} catch {
			console.log('No valid refresh token found!');
			setUser(null);
			setIsAuthenticated(false);
		} finally {
			setIsLoading(false);
		}
	}

	async function login(
		username: string, 
		password: string
	) {
		try {
			await api.login({ username, password });
		} catch (err) {
			console.log('Login Error Catched in AuthContext: ', err);
			throw err;
		}
	}

	async function logout() {
		try {
			await api.logout();
		} catch (err) {
			console.log('Logout Error Catched in AuthContext: ', err);
			throw err;
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
			await api.register({ first_name, last_name, username, email, password });
		} catch (err) {
			console.log('Register Error Catched in AuthContext: ', err);
			throw err;
		}
	}

	const value = {
		// state
		// accessToken,
		user,
		isLoading,
		isAuthenticated,

		// actions
		register,
		login,
		logout,
		// refreshToken,
		// getCurrentUser,
		// authFetch
	};

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
}
