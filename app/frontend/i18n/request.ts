import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const locale = (await cookies()).get("NEXT_LOCALE")?.value || "en";

  return {
    locale,
    messages: (await import(`../src/messages/${locale}.json`)).default,
  };
});
