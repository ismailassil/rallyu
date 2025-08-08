// /* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { APIClient } from '@/app/(auth)/utils/APIClient';
import SocketClient from '@/app/(auth)/utils/SocketClient';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { MessageType } from '../chat/types/Types';

// we need to remove this and make everything on demand
// type User = {
// 	id: string;
// 	username: string;
// 	email: string;
// }

type User = {
	avatar_path: string,
	first_name: string,
	last_name: string,
	id: number,
	relation_status: string,
	username: string,
	last_message : MessageType
}


type AuthContextType = {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	register: (first_name: string, last_name: string, username: string, email: string, password: string) => Promise<void>;
	login: (username: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	api: APIClient;
	socket: SocketClient;
}

const AuthContext = createContext<AuthContextType | null>(null);
const api = new APIClient('http://localhost:4025/api');
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
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	// will run one on page refresh
	useEffect(() => {
		console.log('useEffect in AuthProvider');
		initializeAuth();
	}, []);

	async function initializeAuth() {
		try {
			const { accessToken } = await api.refreshToken();
			const { user } = await api.fetchMe();
			setUser(user);
			setIsAuthenticated(true);
			socket.connect(accessToken);
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
			// setIsLoading(true);
			const { user, accessToken } = await api.login({ username, password });
			// const data = await api.fetchCurrentUser();
			setUser(user);
			setIsAuthenticated(true);
			socket.connect(accessToken);
		} catch (err) {
			console.log('Login Error Catched in AuthContext: ', err);
			throw err;
			// setUser(null);
			// setIsAuthenticated(false);
		} finally {
			setIsLoading(false);
		}
	}

	async function logout() {
		try {
			await api.logout();
			setUser(null);
			setIsAuthenticated(false);
			socket.disconnect();
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
		api,
		socket
		// refreshToken,
		// getCurrentUser,
		// authFetch
	};

	return (
		<AuthContext.Provider value={value}>
			<h1 className='fixed top-0 left-30'>AuthProvider</h1>
			{children}
		</AuthContext.Provider>
	);
}
