import { motion } from 'framer-motion';
import ChangePasswordSettingCard from "./ChangePassword/ChangePasswordSettingCard";
import TwoFactorSettingCard from "./TwoFactor/TwoFactorSettingCard";
import BrowsersAndDevicesSettingCard from "./BrowsersAndDevices/BrowsersAndDevicesSettingCard";
import DeleteAccountSettingCard from "./DeleteAccount/DeleteAccountSettingCard";
import AnonymizeDataSettingCard from "./AnonymizeData/AnonymizeDataSettingCard";
import ClearLocalDataSettingCard from "./ClearLocalData/ClearLocalDataSettingCard";

export default function SecuritySettingsTab() {
	return (
		<motion.div
			initial={{ opacity: 0, x: 15 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -15 }}
			transition={{ duration: 0.5 }}
			className='flex flex-col gap-4'
		>
			<TwoFactorSettingCard />
			<ChangePasswordSettingCard />
			<BrowsersAndDevicesSettingCard />
			<DeleteAccountSettingCard />
			<AnonymizeDataSettingCard />
			<ClearLocalDataSettingCard />
		</motion.div>
	);
}
