import LoadingView from "@/components/LoadingView";
import { RootStackParamList } from "@/config/App";
import { useHomeContext } from "@/context/homePageContext";
import { useUserAuthContext } from "@/context/userAuthContext";
import { type QuizCategory } from "@/models/quiz";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Layout } from "@ui-kitten/components";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity } from "react-native";
import { FlatGrid } from "react-native-super-grid";

export default function Home() {
	const contextHome = useHomeContext();

	if (contextHome.isLoading) return <LoadingView />;

	return (
		<Layout style={styles.container} level="2">
			{contextHome.categories !== undefined && (
				<FlatGrid
					data={contextHome.categories}
					renderItem={({ item }) => <CategoryItem item={item} />}
					itemDimension={150}
					spacing={10}
					ListHeaderComponent={UserProfileView}
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
	const contextUser = useUserAuthContext();

	const handleLoginPress = () => {
		nav.navigate("Login");
	};

	const handleResgisterPress = () => {
		nav.navigate("Register");
	};

	if (contextUser.currentUser) return null;

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

function UserProfileView() {
	const contextUser = useUserAuthContext();

	if (!contextUser.currentUser) return null;

	return (
		<Layout level="1" style={styles.userViewcontainer}>
			<Layout style={Platform.OS === "ios" ? styles.iOSCard : styles.androidCard}>
				<Text style={Platform.OS === "ios" ? styles.iOSLabel : styles.androidLabel}>Name</Text>
				<Text style={Platform.OS === "ios" ? styles.iOSText : styles.androidText}>{contextUser.currentUser.name}</Text>

				<Text style={Platform.OS === "ios" ? styles.iOSLabel : styles.androidLabel}>Email</Text>
				<Text style={Platform.OS === "ios" ? styles.iOSText : styles.androidText}>{contextUser.currentUser.email}</Text>

				<Text style={Platform.OS === "ios" ? styles.iOSLabel : styles.androidLabel}>Points</Text>

				{/* <Text style={Platform.OS === 'ios' ? styles.iOSText : styles.androidText}>
          {contextUser.currentUser?.points}
        </Text> */}
			</Layout>
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
	userViewcontainer: {
		margin: 10,
	},
	iOSContainer: {
		flex: 1,
		backgroundColor: "#F5F5F5",
		padding: 20,
		justifyContent: "center",
	},
	iOSTitle: {
		fontSize: 34,
		fontWeight: "700",
		color: "#000000",
		textAlign: "center",
		marginBottom: 30,
		fontFamily: "SFProDisplay-Bold",
	},
	iOSCard: {
		backgroundColor: "#FFFFFF",
		borderRadius: 15,
		padding: 20,
		marginBottom: 20
	},
	iOSLabel: {
		fontSize: 16,
		fontWeight: "600",
		color: "#8E8E93",
		marginBottom: 5,
		fontFamily: "SFProText-Semibold",
	},
	iOSText: {
		fontSize: 18,
		color: "#000000",
		marginBottom: 15,
		fontFamily: "SFProText-Regular",
	},

	// Estilos para Android (más básico y utilitario)
	androidContainer: {
		flex: 1,
		backgroundColor: "#E0E0E0", // Gris genérico
		padding: 15,
	},
	androidTitle: {
		fontSize: 28,
		color: "#333333", // Gris oscuro
		textAlign: "center",
		marginBottom: 20,
		fontWeight: "bold",
	},
	androidCard: {
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#CCCCCC", // Borde gris claro
		padding: 15,
	},
	androidLabel: {
		fontSize: 14,
		color: "#666666", // Gris medio
		fontWeight: "bold",
		marginBottom: 5,
	},
	androidText: {
		fontSize: 16,
		color: "#000000",
		marginBottom: 10,
	},
});
