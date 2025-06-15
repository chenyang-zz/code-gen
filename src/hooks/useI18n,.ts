import { useLocalStorage } from "@reactuses/core";

const LANGUAGE_KEY = "app-language";

export const useI18n = () => {
	const [currentLocale, setCurrentLocale] = useLocalStorage<string>(
		LANGUAGE_KEY,
		"zh"
	);

	const changeLanguage = (locale: string) => {
		setCurrentLocale(locale);
		// 刷新页面以应用新语言
		window.location.reload();
	};

	return {
		currentLocale,
		changeLanguage,
	};
};
