import { AvailabilityStatus } from "./useAvailabilityCheck";
import { getUpdatedFormPayload } from "../(onsite)/settings/components/Tabs/General/utils";
import { LoggedInUser } from "../(onsite)/contexts/auth.context.types";

export default function useCanSave(
	formData: Record<string, string>,
	debounced: Record<string, boolean>,
	errors: Record<string, string | undefined>,
	avatarFile: File | null,
	usernameStatus: AvailabilityStatus,
	emailStatus: AvailabilityStatus,
	loggedInUser: LoggedInUser,
	getValidationErrors: () => Record<string, string> | null
) {
	const payload = getUpdatedFormPayload(formData, loggedInUser);

	if (Object.keys(payload).length === 0 && avatarFile === null)
		return false;

	for (const key in payload) {
		if (!debounced[key as keyof typeof debounced]) {
			return false;
		}
	}

	// TODO: CONSIDER USING ERRROS DIRECTLY SINCE YOU CHECKED THAT ALL FIELDS ARE DEBOUNCED
	if (getValidationErrors())
		return false;

	if (usernameStatus !== 'available' && usernameStatus !== 'idle')
		return false;
	if (emailStatus !== 'available' && emailStatus !== 'idle')
		return false;

	return true;
}
