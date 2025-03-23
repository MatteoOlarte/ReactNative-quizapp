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

	return (
		<Layout style={styles.container}>
			{context.categories !== undefined && (
				<FlatGrid
					data={context.categories}
					renderItem={({ item }) => <CategoryItem item={item} />}
					itemDimension={150}
					spacing={10}
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
		<TouchableOpacity style={[styles.category, { backgroundColor: item.colorbg }]} onPress={() => navigateTo(item.ref)}>
			<Text style={[styles.categoryTitle, { color: item.coloron }]}>{item.name}</Text>
		</TouchableOpacity>
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
});
