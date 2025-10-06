import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Tablet, MapPin, Clock, LogOut } from 'lucide-react';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import { relativeTimeAgoFromNow } from '@/app/(api)/utils';
import { toastError, toastSuccess } from '@/app/components/CustomToast';
import LoadingComponent, { EmptyComponent } from '@/app/(auth)/components/shared/ui/LoadingComponents';
import useAPICall from '@/app/hooks/useAPICall';
import { motion } from 'framer-motion';

export interface Session {
	session_id: string;
	version: number;
	is_revoked: 0 | 1;
	reason: string | null;
	device: 'Desktop' | 'Mobile' | 'Tablet' | string;
	browser: string;
	ip_address: string;
	created_at: number;
	expires_at: number;
	updated_at: number;
	user_id: number;
	is_current: boolean;
}

function DeviceIcon({ type }: { type: string }) {
	const iconClass = "h-10 w-10 sm:h-11 sm:w-11";
	const lowerType = type.toLowerCase();
	
	if (lowerType === 'mobile')
		return <Smartphone className={iconClass} />;
	if (lowerType === 'tablet')
		return <Tablet className={iconClass} />;
	return <Monitor className={iconClass} />;
}

function SessionCard({ session, onRevoke }: { session: Session; onRevoke: (id: string) => void }) {
	const isCurrent = session.is_current;
	const lastActive = relativeTimeAgoFromNow(session.updated_at);

	return (
		<li className="bg-white/4 rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:px-6 sm:py-4 hover:bg-white/6 transition-colors">
			{/* Mobile Layout */}
			<div className="flex flex-col gap-4 md:hidden">
				<div className="flex items-center justify-between">
					<div className="flex gap-3 items-center flex-1 min-w-0">
						<DeviceIcon type={session.device} />
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2 flex-wrap">
								<h2 className="font-bold text-white text-base sm:text-lg capitalize">
									{session.device}
								</h2>
								{isCurrent && (
									<span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded whitespace-nowrap">
										Current
									</span>
								)}
							</div>
							<p className="font-light text-sm text-white/75 truncate">{session.browser}</p>
						</div>
					</div>
					<button
						onClick={() => onRevoke(session.session_id)}
						disabled={isCurrent}
						className={`ml-2 flex-shrink-0 transition-all duration-200 ${
							isCurrent
								? 'text-gray-500 cursor-not-allowed pointerevent'
								: 'text-white/70 hover:text-red-400 active:scale-95'
						}`}
						title={isCurrent ? 'Cannot revoke current session' : 'Revoke session'}
					>
						<LogOut className="h-5 w-5 sm:h-6 sm:w-6" />
					</button>
				</div>
				
				<div className="flex items-center justify-between text-xs pl-[52px] sm:pl-[58px]">
					<div className="flex gap-1.5 items-center min-w-0 flex-1">
						<MapPin className="h-3.5 w-3.5 text-white/75 flex-shrink-0" />
						<p className="font-light text-white/75 truncate">{session.ip_address}</p>
					</div>
					<div className="flex gap-1.5 items-center ml-4 flex-shrink-0">
						<Clock className="h-3 w-3 text-white/75" />
						<p className="font-light text-white/75 whitespace-nowrap">{lastActive}</p>
					</div>
				</div>
			</div>

			{/* Desktop Layout */}
			<div className="hidden md:flex items-center justify-between gap-6 lg:gap-8">
				<div className="flex gap-4 items-center flex-1 min-w-0 max-w-xs lg:max-w-sm">
					<DeviceIcon type={session.device} />
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2">
							<h2 className="font-bold text-white text-lg capitalize truncate">
								{session.device}
							</h2>
							{isCurrent && (
								<span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded whitespace-nowrap">
									Current
								</span>
							)}
						</div>
						<p className="font-light text-sm text-white/75 truncate">{session.browser}</p>
					</div>
				</div>

				<div className="flex gap-1.5 items-center flex-1 min-w-0 max-w-[200px]">
					<MapPin className="h-4 w-4 text-white/75 flex-shrink-0" />
					<p className="font-light text-sm text-white/75 truncate">{session.ip_address}</p>
				</div>

				<div className="flex gap-1.5 items-center flex-shrink-0 w-24 lg:w-32">
					<Clock className="h-3 w-3 text-white/75" />
					<p className="font-light text-sm text-white/75 whitespace-nowrap">{lastActive}</p>
				</div>

				<button
					onClick={() => onRevoke(session.session_id)}
					disabled={isCurrent}
					className={`flex-shrink-0 transition-all duration-200 ${
						isCurrent
							? 'text-gray-600 cursor-not-allowed pointer-events-none'
							: 'text-white/70 hover:text-red-400 active:scale-95 cursor-pointer'
					}`}
					title={isCurrent ? 'Cannot revoke current session' : 'Revoke session'}
				>
					<LogOut className="h-6 w-6" />
				</button>
			</div>
		</li>
	);
}

export default function Sessions() {
	const {
		apiClient
	} = useAuth();
	const {
		executeAPICall
	} = useAPICall();
	
	const [sessions, setSessions] = useState<Session[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	async function handleRevokeSession(sessionId: string) {
		try {
			await apiClient.revokeSession(sessionId);
			setSessions((prev) => prev.filter((s) => s.session_id !== sessionId));
			toastSuccess('Session revoked');
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			toastError(err.message);
		}
	};

	useEffect(() => {
		async function fetchActiveSessions() {
			try {
				setIsLoading(true);
				const data = await executeAPICall(() => apiClient.fetchActiveSessions());
				// const data = await apiClient.fetchActiveSessions();
				setSessions(data);
				setError(null);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (err: any) {
				toastError(err.message);
				setError('Failed to load active sessions.');
			} finally {
				setIsLoading(false);
			}
		};

		fetchActiveSessions();
	}, [apiClient, executeAPICall]);

	if (isLoading)
		return <LoadingComponent />;

	if (error)
		return <EmptyComponent content={error} />;

	if (!sessions)
		return null;

	if (sessions.length === 0)
		return <EmptyComponent content='No active sessions found.' />;

	return (
		<div className="flex flex-col gap-6 px-14 py-6 max-lg:px-10 font-funnel-display">
			<motion.ul
				initial={{ opacity: 0, height: 0 }}
				animate={{ opacity: 1, height: "auto" }}
				exit={{ opacity: 0, height: 0 }}
				transition={{ duration: 0.4, ease: "easeOut" }}
				className="flex flex-col gap-4"
			>
				{sessions.map((session) => (
					<SessionCard
						key={session.session_id}
						session={session}
						onRevoke={handleRevokeSession}
					/>
				))}
			</motion.ul>
		</div>
	);
}
