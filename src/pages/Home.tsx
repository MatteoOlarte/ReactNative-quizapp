import LoadingView from "@/components/LoadingView";
import { RootStackParamList } from "@/config/App";
import { useHomeContext } from "@/context/homePageContext";
import { type QuizCategory } from "@/models/quiz";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Layout } from "@ui-kitten/components";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { FlatGrid } from "react-native-super-grid";

export default function Home() {
	const context = useHomeContext();

	if (context.isLoading) return <LoadingView />;

	return (
		<Layout style={styles.container}>
			{context.categories !== undefined && (
				<FlatGrid
					data={context.categories}
					renderItem={({ item }) => <CategoryItem item={item} />}
					itemDimension={150}
					spacing={10}
					ListFooterComponent={UserAuthButtons}
				/>
			)}
		</Layout>
	);
}

function CategoryItem({ item }: { item: QuizCategory }) {
	const nav = useNavigation<StackNavigationProp<RootStackParamList>>();

	const navigateTo = (category: string) => {
		nav.navigate("Playground", { category: category });
	};

	return (
		<TouchableOpacity
			style={[styles.category, { backgroundColor: item.colorbg }]}
			onPress={() => navigateTo(item.ref.id)}
		>
			<Text style={[styles.categoryTitle, { color: item.coloron }]}>{item.name}</Text>
		</TouchableOpacity>
	);
}

function UserAuthButtons() {
	const nav = useNavigation<StackNavigationProp<RootStackParamList>>();

	const handleLoginPress = () => {
		nav.navigate("Login");
	};

	const handleResgisterPress = () => {
		nav.navigate("Register");
	};

	return (
		<Layout>
			<TouchableOpacity style={styles.button} onPress={handleLoginPress}>
				<Text style={styles.buttonText}>Login</Text>
			</TouchableOpacity>

			<TouchableOpacity style={styles.button} onPress={handleResgisterPress}>
				<Text style={styles.buttonText}>Register</Text>
			</TouchableOpacity>
		</Layout>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	category: {
		borderRadius: 8,
		padding: 10,
		height: 150,
	},
	categoryTitle: {
		fontSize: 20,
		fontWeight: "semibold",
	},
	button: {
		backgroundColor: "#007AFF",
		borderRadius: 10,
		padding: 14,
		alignItems: "center",
		margin: 10,
	},
	buttonText: {
		color: "#FFFFFF",
		fontSize: 17,
		fontWeight: "600",
		fontFamily: "SFProText-Semibold",
	},
});
