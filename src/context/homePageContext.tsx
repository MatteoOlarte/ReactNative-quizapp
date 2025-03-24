import { fetchAllCategories, type QuizCategory } from "@/models/quiz";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface HomeContextTypes {
	categories?: QuizCategory[];
	isLoading: boolean;
}

export const HomeContext = createContext<HomeContextTypes | undefined>(undefined);

export const HomeContextProvider = ({ children }: React.PropsWithChildren) => {
	const [categories, setCategories] = useState<QuizCategory[] | undefined>(undefined);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const fetchData = async () => {
		setIsLoading(true);
		setCategories(await fetchAllCategories());
		setIsLoading(false);
	};

	useEffect(() => {
		fetchData();
	}, []);

	return <HomeContext.Provider value={{ categories, isLoading }}>{children}</HomeContext.Provider>;
};

export const useHomeContext = () => {
	const user = useContext(HomeContext);

	if (user === undefined) {
		throw new Error(
			"useHomeContext must be used within a HomeContextProvider. Make sure you are wrapping your component with <HomeContextProvider>."
		);
	}
	return user;
};
