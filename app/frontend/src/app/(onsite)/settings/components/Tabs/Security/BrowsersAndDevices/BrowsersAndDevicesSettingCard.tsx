import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Tablet, MapPin, Clock, LogOut } from 'lucide-react';
import { useAuth } from '@/app/(onsite)/contexts/AuthContext';
import { toastError, toastSuccess } from '@/app/components/CustomToast';
import LoadingComponent, {
	PlaceholderComponent,
} from '@/app/(auth)/components/UI/LoadingComponents';
import useAPICall from '@/app/hooks/useAPICall';
import { useLocale, useTranslations } from 'next-intl';
import SettingsCard from '../../../SettingsCard';
import { Locale, enUS, es, it } from 'date-fns/locale';
import { formatDistanceToNow } from 'date-fns';

export interface Session {
	session_id: string;
	version: number;
	is_revoked: 0 | 1;
	reason: string | null;
	device: 'Desktop' | 'Mobile' | 'Tablet' | string;
	browser: string;
	geo: { country: string, region: string, city: string };
	created_at: number;
	expires_at: number;
	updated_at: number;
	user_id: number;
	is_current: boolean;
}

const localeMap: Record<string, Locale> = {
	en: enUS,
	es,
	it
}

function DeviceIcon({ type }: { type: string }) {
	const iconClass = 'h-10 w-10 sm:h-11 sm:w-11';
	const lowerType = type.toLowerCase();

	if (lowerType === 'mobile') return <Smartphone className={iconClass} />;
	if (lowerType === 'tablet') return <Tablet className={iconClass} />;
	return <Monitor className={iconClass} />;
}

function SessionCard({ session, onRevoke }: { session: Session; onRevoke: (id: string) => void }) {
	const t = useTranslations('');

	const isCurrent = session.is_current;

	const locale = useLocale();
	const dateLocale = localeMap[locale] || enUS;

	return (
		<div className='rounded-xl border border-white/10 bg-white/4 p-4 transition-colors hover:bg-white/6 sm:rounded-2xl sm:px-6 sm:py-4'>
			{/* Mobile Layout */}
			<div className='flex flex-col gap-4 md:hidden'>
				<div className='flex items-center justify-between'>
					<div className='flex min-w-0 flex-1 items-center gap-3'>
						<DeviceIcon type={session.device} />
						<div className='min-w-0 flex-1'>
							<div className='flex flex-wrap items-center gap-2'>
								<h2 className='text-base font-bold text-white capitalize sm:text-lg'>
									{session.device}
								</h2>
								{isCurrent && (
									<span className='rounded bg-blue-500/20 px-2 py-0.5 text-xs whitespace-nowrap text-blue-300'>
										{t('auth.common.current')}
									</span>
								)}
							</div>
							<p className='truncate text-sm font-light text-white/75'>
								{session.browser}
							</p>
						</div>
					</div>
					<button
						onClick={() => onRevoke(session.session_id)}
						disabled={isCurrent}
						className={`ml-2 flex-shrink-0 transition-all duration-200 ${
							isCurrent
								? 'pointerevent cursor-not-allowed text-gray-500'
								: 'text-white/70 hover:text-red-400 active:scale-95'
						}`}
						title={isCurrent ? 'Cannot revoke current session' : 'Revoke session'}
					>
						<LogOut className='h-5 w-5 sm:h-6 sm:w-6' />
					</button>
				</div>

				<div className='flex items-center justify-between pl-[52px] text-xs sm:pl-[58px]'>
					<div className='flex min-w-0 flex-1 items-center gap-1.5'>
						<MapPin className='h-3.5 w-3.5 flex-shrink-0 text-white/75' />
						<p className='truncate font-light text-white/75'>
							{session.geo.country
								? `${session.geo.city ? `${session.geo.city}, ` : ''}${session.geo.country}`
								: session.geo.city || 'Local'}
						</p>
					</div>
					<div className='ml-4 flex flex-shrink-0 items-center gap-1.5'>
						<Clock className='h-3 w-3 text-white/75 shrink-0' />
						<p className='font-light whitespace-nowrap text-white/75'>
							{formatDistanceToNow(new Date(session.updated_at * 1000), {
								locale: dateLocale
							})}
						</p>
					</div>
				</div>
			</div>

			{/* Desktop Layout */}
			<div className='hidden items-center justify-between gap-6 md:flex lg:gap-8'>
				<div className='flex max-w-xs min-w-0 flex-1 items-center gap-4 lg:max-w-sm'>
					<DeviceIcon type={session.device} />
					<div className='min-w-0 flex-1'>
						<div className='flex items-center gap-2'>
							<h2 className='truncate text-lg font-bold text-white capitalize'>
								{session.device}
							</h2>
							{isCurrent && (
								<span className='rounded bg-blue-500/20 px-2 py-0.5 text-xs whitespace-nowrap text-blue-300'>
									{t('auth.common.current')}
								</span>
							)}
						</div>
						<p className='truncate text-sm font-light text-white/75'>
							{session.browser}
						</p>
					</div>
				</div>

				<div className='flex max-w-[200px] min-w-0 flex-1 items-center gap-1.5'>
					<MapPin className='h-4 w-4 flex-shrink-0 text-white/75' />
					<p className='truncate text-sm font-light text-white/75'>
						{session.geo.country
							? `${session.geo.city ? `${session.geo.city}, ` : ''}${session.geo.country}`
							: session.geo.city || 'Local'}
					</p>
				</div>

				<div className='flex w-24 flex-shrink-0 items-center gap-1.5 lg:w-32'>
					<Clock className='h-3 w-3 text-white/75 shrink-0' />
					<p className='text-sm font-light whitespace-nowrap text-white/75'>
						{formatDistanceToNow(new Date(session.updated_at * 1000), {
							locale: dateLocale
						})}
					</p>
				</div>

				<button
					onClick={() => onRevoke(session.session_id)}
					disabled={isCurrent}
					className={`flex-shrink-0 transition-all duration-200 ${
						isCurrent
							? 'pointer-events-none cursor-not-allowed text-gray-600'
							: 'cursor-pointer text-white/70 hover:text-red-400 active:scale-95'
					}`}
					title={isCurrent ? 'Cannot revoke current session' : 'Revoke session'}
				>
					<LogOut className='h-6 w-6' />
				</button>
			</div>
		</div>
	);
}

export default function BrowsersAndDevicesSettingCard() {
	const t = useTranslations('settings.security.cards');

	const { apiClient } = useAuth();
	const { executeAPICall } = useAPICall();

	const [sessions, setSessions] = useState<Session[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	async function handleRevokeSession(sessionId: string) {
		try {
			await apiClient.revokeSession(sessionId);
			setSessions((prev) => prev.filter((s) => s.session_id !== sessionId));
			toastSuccess('Session revoked');
		} catch (err: any) {
			toastError(err.message);
		}
	}

	useEffect(() => {
		async function fetchActiveSessions() {
			try {
				setIsLoading(true);
				const data = await executeAPICall(() => apiClient.fetchActiveSessions());
				// const data = await apiClient.fetchActiveSessions();
				setSessions(data);
				setError(null);
			} catch {
				setError('Failed to load active sessions.');
			} finally {
				setIsLoading(false);
			}
		}

		fetchActiveSessions();
	}, [apiClient, executeAPICall]);

	// if (isLoading) return <LoadingComponent />;

	// if (error) return <PlaceholderComponent content={error} />;

	// if (!sessions) return null;

	// if (sessions.length === 0) return <PlaceholderComponent content='No active sessions found.' />;

	return (
		<SettingsCard
			title={t('sessions.title')}
			subtitle={t('sessions.subtitle')}
			initialHeight='loading'
		>
			{isLoading ? (
				<LoadingComponent />
			) : error ? (
				<PlaceholderComponent content={error} />
			) : !sessions || sessions.length === 0 ? (
				null
			) : (
				<div className='flex flex-col gap-4'>
					{sessions.map((session) => (
						<SessionCard
							key={session.session_id}
							session={session}
							onRevoke={handleRevokeSession}
						/>
					))}
				</div>
			)}
		</SettingsCard>
	);
}
