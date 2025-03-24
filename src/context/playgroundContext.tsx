import { Question, fetchQuestionsFromQuiz } from "@/models/quiz";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface PlaygroundContextTypes {
	quizID?: string;
	questions: Question[];
	isLoading: boolean;
	showResults: boolean;
	currentScore: number;
	setQuizID: (value: string) => void;
	selectOption: (index: number, option: number) => void;
	submitQuiz: () => void;
}

type SelectedOptionType = {
	[questionIndex: number]: number; // O cambia 'string' por el tipo que corresponda
};

export const PlaygroundContext = createContext<PlaygroundContextTypes | undefined>(undefined);

export const PlaygroundContextProvider = ({ children }: React.PropsWithChildren) => {
	const [quizID, setQuizID] = useState<string | undefined>();
	const [questions, setQuestions] = useState<Question[]>([]);
	const [selectedOptions, setSelectedOptions] = useState<SelectedOptionType>({});
	const [currentScore, setCurrentScore] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [showResults, setShowResults] = useState<boolean>(false);

	const fetchQuizData = async () => {
		setIsLoading(true);
		if (quizID === undefined) return;

		let data = (await fetchQuestionsFromQuiz(quizID)).sort(() => 0.5 - Math.random());
		setQuestions(data);
		setIsLoading(false);
	};

	const selectOption = (index: number, option: number) => {
		console.log(`Selected: ${index} option ${option}`);
		setSelectedOptions((__prev) => ({
			...__prev,
			[index]: option,
		}));
	};

	const submitQuiz = () => {
		let correntAnswers = 0;

		questions.forEach((q, index) => {
			console.log(`question: ${q.question}`);
			console.log(` correct: ${q.correctOption}`);
			console.log(` select: ${selectedOptions[index]}`);

			if (selectedOptions[index] == q.correctOption) correntAnswers++;
		});

		setCurrentScore(correntAnswers);
		setShowResults(true);
		console.log(correntAnswers);
	};

	useEffect(() => {
		setShowResults(false);
		fetchQuizData();
	}, [quizID]);

	useEffect(() => console.log(currentScore), [currentScore]);

	return (
		<PlaygroundContext.Provider
			value={{ quizID, questions, isLoading, showResults, currentScore, setQuizID, selectOption, submitQuiz }}
		>
			{children}
		</PlaygroundContext.Provider>
	);
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
