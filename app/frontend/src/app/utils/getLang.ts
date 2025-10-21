export const getLang = () => {
	if (typeof document === "undefined") return null; // SSR safe
	return (
		document.cookie
			.split("; ")
			.find((row) => row.startsWith("NEXT_LOCALE_INT="))
			?.split("=")[1] || "en"
	);
};
