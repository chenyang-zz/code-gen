import React, { useEffect } from "react";
import { NextIntlClientProvider } from "next-intl";

// 加载语言文件
const loadMessages = async (locale: string) => {
	try {
		return (await import(`../../../messages/${locale}.json`)).default;
	} catch (error) {
		console.error(`Failed to load messages for locale: ${locale}`, error);
		// 如果加载失败，返回英文作为后备
		return (await import(`../../../messages/zh.json`)).default;
	}
};

const NextIntlProvider = ({ children }: BaseProviderProps) => {
	const [messages, setMessages] = React.useState<any>(null);
	const [locale, setLocale] = React.useState<string>("zh");

	useEffect(() => {
		const saveLocal = "zh";
		setLocale(saveLocal);

		// 加载对应的语言文件
		loadMessages(saveLocal).then((messages) => {
			setMessages(messages);
		});
	}, []);

	if (!messages) return null;

	return (
		<NextIntlClientProvider messages={messages} locale={locale}>
			{children}
		</NextIntlClientProvider>
	);
};

export default NextIntlProvider;
