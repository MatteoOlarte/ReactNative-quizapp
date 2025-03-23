import React, { createContext, useContext } from "react";

export interface PlaygroundContextTypes {}

export const PlaygroundContext = createContext<PlaygroundContextTypes | undefined>(undefined);

export const PlaygroundContextProvider = ({ children }: React.PropsWithChildren) => {
	return <></>;
};

export const usePlaygroundContext = () => {
	const c = useContext(PlaygroundContext);

	if (c === undefined) {
		throw new Error(
			"useHomeContext must be used within a PlaygroundContextProvider. Make sure you are wrapping your component with <PlaygroundContextProvider>."
		);
	}
	return c;
};
