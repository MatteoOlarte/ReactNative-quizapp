import { RootStackParamList } from "@/config/App";
import { usePlaygroundContext } from "@/context/playgroundContext";
import { type Question } from "@/models/quiz";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	Animated,
	Button,
	FlatList,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

export interface PlaygroundProps extends NativeStackScreenProps<RootStackParamList, "Playground"> {}

export default function Playground({ route }: PlaygroundProps) {
	const context = usePlaygroundContext();
	const { category } = route.params;

	useEffect(() => context.setQuizID(category), []);

	if (context.isLoading) return <LoadingView />;

	return (
		<View style={styles.container}>
			{context.questions.length > 0 ? (
				<>
					<FlatList
						style={styles.questionList}
						data={context.questions}
						renderItem={({ item, index }) => <QuestionItem item={item} index={index} />}
						ListFooterComponent={QuizResultsFooter}
					/>
				</>
			) : (
				<Text>No questions available</Text>
			)}

			<StatusBar style="auto" />
		</View>
	);
}

const LoadingView = () => {
	return (
		<View style={styles.loadingContainer}>
			<ActivityIndicator size="large" />
			<Text>Cargando Preguntas...</Text>
		</View>
	);
};

interface QuestionItemProps {
	item: Question;
	index: number;
}

const QuestionItem = ({ item, index }: QuestionItemProps) => {
	const context = usePlaygroundContext();
	const options = [item.option1, item.option2, item.option3, item.option4];
	const [selectedOption, setSelectedOption] = useState<string | null>(null);

	const handlePress = (option: string) => {
		setSelectedOption(option);
		context.selectOption(index, options.indexOf(option) + 1);
	};

	return (
		<View style={styles.questionItem}>
			<Text style={styles.questionItemTitle}>
				{index + 1}. {item.question}
			</Text>

			<Text style={styles.difficulty}>Difficulty: {item.difficulty}</Text>
			{options.map((option, idx) => (
				<TouchableOpacity
					style={[
						styles.optionButton,
						selectedOption === option && styles.selectedOption,
						context.showResults && selectedOption !== option && idx === item.correctOption && styles.correctOption,
					]}
					key={idx}
					disabled={context.showResults}
					onPress={() => handlePress(option)}
				>
					<Text style={selectedOption === option && styles.selectedOptionText}>
						{String.fromCharCode(65 + idx)}. {option}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	);
};

const QuizResultsFooter = () => {
	const context = usePlaygroundContext();
	const fadeAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (context.showResults) {
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 500,
				useNativeDriver: true,
			}).start();
		}
	}, [context.showResults, fadeAnim]);

	return (
		<View style={styles.resultsFooter}>
			<Button
				onPress={(e) => {
					context.submitQuiz();
				}}
				title="Terminar"
				accessibilityLabel="Learn more about this purple button"
			/>

			{context.showResults && (
				<Animated.View style={[styles.resultsContainer, { opacity: fadeAnim }]}>
					<Text style={styles.resultsTitle}>¡Quiz Completado!</Text>
					<Text style={styles.resultsScore}>
						Calificación: {context.currentScore} / {context.questions.length}
					</Text>
					<Text style={styles.resultsMessage}>
						{context.currentScore === context.questions.length
							? "¡Perfecto! 🎉"
							: context.currentScore >= context.questions.length / 2
							? "¡Buen trabajo! 👏"
							: "¡Sigue practicando! 💪"}
					</Text>
				</Animated.View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	questionList: {
		flex: 1,
		paddingHorizontal: 16,
	},
	questionItem: {},
	questionItemTitle: {
		fontSize: 17,
		fontWeight: "600",
		color: "#333",
		marginTop: 16,
		marginBottom: 4,
	},
	optionButton: {
		padding: 14,
		backgroundColor: "#f5f5f5",
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#e0e0e0",
		marginBottom: 4,
	},
	selectedOption: {
		backgroundColor: Platform.select({
			ios: "#007AFF", // Clean iOS blue
			android: "#33ca59", // Painfully bright green 😵‍💫
		}),
		borderColor: Platform.select({
			ios: "#007AFF",
			android: "#33ca59",
		}),
	},
	correctOption: {
		backgroundColor: "gray",
	},
	selectedOptionText: {
		color: "white",
		fontWeight: "600",
	},
	difficulty: {
		fontSize: 13,
		color: "#666",
		marginBottom: 12,
	},
	resultsFooter: {
		marginVertical: 20,
	},
	resultsContainer: {
		marginTop: 16,
		padding: 16,
		backgroundColor: "#f9f9f9",
		borderRadius: 12,
		alignItems: "center",
		width: "100%",
	},
	resultsTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#333",
		marginBottom: 8,
	},
	resultsScore: {
		fontSize: 18,
		fontWeight: "500",
		color: Platform.select({
      ios: "#007AFF",
      android: "#33ca59"
    }),
		marginBottom: 8,
	},
	resultsMessage: {
		fontSize: 16,
		color: "#666",
		textAlign: "center",
	},
});
