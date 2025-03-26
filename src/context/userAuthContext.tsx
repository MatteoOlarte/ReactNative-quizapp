import User, { createUserWithEmailAndPassword, loginUserWithEmailAndPassword } from "@/models/user";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface UserAuthContextTypes {
	currentUser?: User;
	isLoading: boolean;
	registerUserWithEmailAndPassword: (
		name?: string,
		email?: string,
		passwordA?: string,
		passwordB?: string
	) => Promise<void>;
	loginWithEmailAndPassword: (email: string, password: string) => Promise<void>;
}

export const UserAuthContext = createContext<UserAuthContextTypes | undefined>(undefined);

export const UserAuthContextProvider = ({ children }: React.PropsWithChildren) => {
	const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const fetchCurrentUser = async () => {
		
	};

	const registerUserWithEmailAndPassword = async (
		name?: string,
		email?: string,
		passwordA?: string,
		passwordB?: string
	) => {
		const user = {
			name: name,
			email: email,
			passwordA: passwordA,
			passwordB: passwordB,
		};

		setIsLoading(true);

		try {
			if (Object.values(user).some((__value) => __value === undefined)) throw Error();

			if (passwordA !== passwordB) throw Error();

			let result = await createUserWithEmailAndPassword(user.name!!, user.email!!, user.passwordA!!);

			setCurrentUser(result);
		} catch (error) {
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const loginWithEmailAndPassword = async (email: string, password: string) => {
		setIsLoading(true);

		try {
			let user = await loginUserWithEmailAndPassword(email, password);

			if (!user) throw Error();

			setCurrentUser(user);
		} catch (error) {
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchCurrentUser();
	}, []);

	useEffect(() => {}, [currentUser]);

	return (
		<UserAuthContext.Provider
			value={{ currentUser, isLoading, registerUserWithEmailAndPassword, loginWithEmailAndPassword }}
		>
			{children}
		</UserAuthContext.Provider>
	);
};

export const useUserAuthContext = () => {
	const c = useContext(UserAuthContext);

	if (c === undefined) {
		throw new Error(
			"useHomeContext must be used within a PlaygroundContextProvider. Make sure you are wrapping your component with <PlaygroundContextProvider>."
		);
	}
	return c;
};
