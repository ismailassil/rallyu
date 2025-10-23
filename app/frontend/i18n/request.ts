import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  const locale = (await cookies()).get("NEXT_LOCALE_INT")?.value || "en";

  return {
    locale,
    messages: {
      ...(await import(`../src/messages/${locale}/landing.json`)),
      ...(await import(`../src/messages/${locale}/dashboard.json`)),
      ...(await import(`../src/messages/${locale}/header.json`)),
      ...(await import(`../src/messages/${locale}/chat.json`)),
    },
  };
});
