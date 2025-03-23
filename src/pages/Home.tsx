import { useHomeContext } from "@/context/homePageContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Layout } from "@ui-kitten/components";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { FlatGrid } from "react-native-super-grid";

type RootStackParamList = {
	Home: never;
	Playground: { category: string }; // Example: Playground expects a string param
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Home() {
	const nav = useNavigation<NavigationProp>();
	const context = useHomeContext();

	const navigateTo = (category: string) => {
		nav.navigate("Playground", { category: category });
	};

	return (
		<Layout style={styles.container}>
			{context.categories !== undefined && (
				<FlatGrid
					data={context.categories}
					renderItem={({ item }) => <CategoryItem item={item} />}
					itemDimension={130}
					spacing={10}
				/>
			)}
		</Layout>
	);
}

function CategoryItem({ item }: { item: string }) {
	return (
		<TouchableOpacity style={styles.category}>
			<Text>{item}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingStart: 8,
		paddingBlockEnd: 8,
		paddingTop: 8,
	},
	category: {
		backgroundColor: "red",
		borderRadius: 8,
		padding: 10,
		height: 150
	},
});
