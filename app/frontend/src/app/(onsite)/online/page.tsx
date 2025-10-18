'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePresence } from '../contexts/PresenceContext';

const OnlineUsersPage: React.FC = () => {
	const {
		onlineUsers
	} = usePresence();

	// const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
	// const {
	// 	socket
	// } = useAuth();

	// useEffect(() => {
	// 	// get the initial list
	// 	socket.on('online_users_list', (userIDs: string[]) => {
	// 		console.log("online users list", userIDs);
	// 		setOnlineUsers(userIDs);
	// 	});

	// 	// get online updates
	// 	socket.on('is_online', (payload: { userId: string }) => {
	// 		console.log("is online payload", payload);
	// 		setOnlineUsers(prev => [...prev, payload.userId]);
	// 	});

	// 	// get offline updates
	// 	socket.on('is_offline', (payload: { userId: string }) => {
	// 		console.log("is offline payload", payload);
	// 		setOnlineUsers(prev => prev.filter((v) => v !== payload.userId));
	// 	});

	// 	// cleanup
	// 	return () => {
	// 		socket.off('online_users_list', () => true);
	// 		socket.off('is_online', () => true);
	// 		socket.off('is_offline', () => true);
	// 	};
	// }, [socket]);

	const usersArray = Array.from(onlineUsers);

	return (
		<div>
			<h1>Online Users</h1>
			{usersArray.length === 0 ? (
				<p>No users online</p>
			) : (
				<ul>
					{usersArray.map(userID => (
						<li key={userID}>{userID}</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default OnlineUsersPage;
