import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

// 支持的语言列表
export const locales = ["en", "zh"];
export const defaultLocale = "zh";

export default getRequestConfig(async ({ locale }) => {
	locale = locale ?? defaultLocale;

	// 验证语言是否支持
	if (!locales.includes(locale as any)) notFound();

	return {
		messages: (await import(`../../messages/${locale}.json`)).default,
		locale: locale as string,
	};
});
