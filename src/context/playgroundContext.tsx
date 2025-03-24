import { Question, fetchQuestionsFromQuiz } from "@/models/quiz";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

export interface PlaygroundContextTypes {
	quizID?: string;
	questions: Question[];
	isLoading: boolean;
	showResults: boolean;
	currentScore: number;
	timeRemaining: number;
	currentPoints: number;
	TOTAL_TIME: number;
	setQuizID: (value: string) => void;
	selectOption: (index: number, option: number) => void;
	submitQuiz: () => void;
}

type SelectedOptionType = {
	[questionIndex: number]: number; // O cambia 'string' por el tipo que corresponda
};

export const PlaygroundContext = createContext<PlaygroundContextTypes | undefined>(undefined);

export const PlaygroundContextProvider = ({ children }: React.PropsWithChildren) => {
	const TOTAL_TIME = 5 * 60 * 1000;
	const [quizID, setQuizID] = useState<string | undefined>();
	const [questions, setQuestions] = useState<Question[]>([]);
	const [selectedOptions, setSelectedOptions] = useState<SelectedOptionType>({});
	const [currentScore, setCurrentScore] = useState<number>(0);
	const [currentPoints, setCurrentPoints] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [showResults, setShowResults] = useState<boolean>(false);
	const [timeRemaining, setTimeRemaining] = useState<number>(TOTAL_TIME);
	const timerRef = useRef<NodeJS.Timeout | undefined>();
	const fetchQuizData = async () => {
		setIsLoading(true);
		if (quizID === undefined) return;

		let data = (await fetchQuestionsFromQuiz(quizID)).sort(() => 0.5 - Math.random());
		setQuestions(data);
		setIsLoading(false);
	};

	const selectOption = (index: number, option: number) => {
		setSelectedOptions((__prev) => ({
			...__prev,
			[index]: option,
		}));
	};

	const submitQuiz = () => {
		let correntAnswers = 0;
		let points = 0;

		questions.forEach((q, index) => {
			if (selectedOptions[index] == q.correctOption) {
				correntAnswers++;
				points += 10 * (q.difficulty === "hard" ? 1.5 : q.difficulty === "medium" ? 1.3 : 1);
			}
		});

		points = Math.floor(points + timeRemaining / (1000 * questions.length));
		setCurrentPoints(points);
		setCurrentScore(correntAnswers);
		setShowResults(true);

		if (timerRef) clearInterval(timerRef.current);
	};

	useEffect(() => {
		const startTime = Date.now();
		
		timerRef.current = setInterval(() => {
			const elapsed = Date.now() - startTime;
			const remaining = Math.max(0, TOTAL_TIME - elapsed);
			setTimeRemaining(remaining);

			if (remaining === 0) {
				submitQuiz(); // Auto-submit when time runs out
				clearInterval(timerRef.current);
			}
		}, 1000);

		setShowResults(false);
		fetchQuizData();

		return () => clearInterval(timerRef.current);
	}, [quizID]);

	return (
		<PlaygroundContext.Provider
			value={{
				quizID,
				questions,
				isLoading,
				showResults,
				currentScore,
				timeRemaining,
				currentPoints,
				TOTAL_TIME,
				setQuizID,
				selectOption,
				submitQuiz,
			}}
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
