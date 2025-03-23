import { fetchAllCategories } from "@/models/quiz";
import React, { createContext, useContext, useEffect, useState } from "react";

interface HomeContextTypes {
	categories?: string[];
}

export const HomeContext = createContext<HomeContextTypes | undefined>(undefined);

export const HomeContextProvider = ({ children }: React.PropsWithChildren) => {
	const [categories, setCategories] = useState<string[] | undefined>(undefined);

	useEffect(() => {
		const fetchData = async () => {
			setCategories(await fetchAllCategories());
		};
		fetchData();
	}, []);

	return <HomeContext.Provider value={{ categories }}>{ children }</HomeContext.Provider>;
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
