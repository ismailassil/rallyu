import { LoggedInUser } from "@/app/(onsite)/contexts/auth.context.types";
import { FormDataState } from "./GeneralSettingsTab";

export function getUpdatedFormPayload(formData: Record<string, string>, loggedInUser: LoggedInUser) : Partial<FormDataState> {
	const payload: Partial<FormDataState> = {};

	for (const key in formData) {
		const oldValue = loggedInUser[key as keyof typeof loggedInUser];
		const newValue = formData[key as keyof FormDataState];
	
		if (newValue !== '' && newValue !== oldValue) {
			payload[key as keyof FormDataState] = newValue;
		}
	}
	return payload;
}