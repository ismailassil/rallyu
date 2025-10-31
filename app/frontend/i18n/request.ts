import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  let locale = (await cookies()).get("NEXT_LOCALE_INT")?.value || "en";
  if (locale !== 'en' && locale !== 'it' && locale !== 'es') {
    locale = 'en';
  }

  return {
    locale,
    messages: {
      ...(await import(`../src/messages/${locale}/landing.json`)),
      ...(await import(`../src/messages/${locale}/dashboard.json`)),
      ...(await import(`../src/messages/${locale}/header.json`)),
      ...(await import(`../src/messages/${locale}/chat.json`)),
      ...(await import(`../src/messages/${locale}/game.json`)),
      ...(await import(`../src/messages/${locale}/tournament.json`)),
      ...(await import(`../src/messages/${locale}/auth/auth.json`)),
      ...(await import(`../src/messages/${locale}/pages/performance.json`)),
      ...(await import(`../src/messages/${locale}/pages/profile.json`)),
      ...(await import(`../src/messages/${locale}/pages/settings.json`)),
      ...(await import(`../src/messages/${locale}/placeholders/placeholders.json`)),
    },
  };
});
