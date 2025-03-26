import LoadingView from "@/components/LoadingView";
import { RootStackParamList } from "@/config/App";
import { useHomeContext } from "@/context/homePageContext";
import { useUserAuthContext } from "@/context/userAuthContext";
import { type QuizCategory } from "@/models/quiz";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Layout } from "@ui-kitten/components";
import React, { useState } from "react";
import { Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlatGrid } from "react-native-super-grid";

export default function Home() {
	const contextHome = useHomeContext();
	const contextUser = useUserAuthContext();
	const [refreshing, setRefreshing] = useState<boolean>(false);

	const onRefresh = async () => {
		setRefreshing(true);

		// Simulamos una operación asíncrona (como un fetch de datos)
		await contextHome.reaload();
		await contextUser.currentUser?.fetchPoints();
		// Activamos el efecto háptico en iOS al completar la recarga
		// if (Platform.OS === "ios") { Puto expo
		// 	ReactNativeHapticFeedback.trigger("impactMedium", {
		// 		enableVibrateFallback: true, // Si los hápticos no están disponibles, usa vibración
		// 		ignoreAndroidSystemSettings: false,
		// 	});
		// }
		setRefreshing(false);
	};

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
					refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
		<View style={styles.userViewcontainer}>
			<View style={Platform.OS === "ios" ? styles.iOSCard : styles.androidCard}>
				<Text style={Platform.OS === "ios" ? styles.iOSLabel : styles.androidLabel}>Name</Text>
				<Text style={Platform.OS === "ios" ? styles.iOSText : styles.androidText}>{contextUser.currentUser.name}</Text>

				<Text style={Platform.OS === "ios" ? styles.iOSLabel : styles.androidLabel}>Email</Text>
				<Text style={Platform.OS === "ios" ? styles.iOSText : styles.androidText}>{contextUser.currentUser.email}</Text>

				<Text style={Platform.OS === "ios" ? styles.iOSLabel : styles.androidLabel}>Points</Text>

				<Text style={Platform.OS === "ios" ? styles.iOSTextBlue : styles.androidText}>
					{contextUser.currentUser?.points ?? 0} pts
				</Text>
			</View>
		</View>
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
		backgroundColor: "#F2F2F7", // System Background (Light)
		paddingHorizontal: 16,
		paddingTop: 44, // Espacio para la barra de estado
	},
	iOSTitle: {
		fontSize: 34,
		fontWeight: "600",
		color: "#000000", // System Black
		textAlign: "left",
		marginBottom: 24,
		fontFamily: "SFProDisplay-Semibold",
		letterSpacing: -0.41, // Ajuste de tipografía según iOS
	},
	iOSCard: {
		backgroundColor: "#FFFFFF", // System White
		borderRadius: 10,
		paddingVertical: 16,
		paddingHorizontal: 16,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 0.5 },
		shadowOpacity: 0.08,
		shadowRadius: 2,
		elevation: 2, // Para compatibilidad con Android, pero optimizado para iOS
	},
	iOSLabel: {
		fontSize: 13,
		fontWeight: "600",
		color: "#8E8E93", // System Gray 2
		marginBottom: 4,
		fontFamily: "SFProText-Semibold",
		letterSpacing: -0.08,
		textTransform: "uppercase",
	},
	iOSText: {
		fontSize: 17,
		color: "#000000", // System Black
		marginBottom: 16,
		fontFamily: "SFProText-Regular",
		letterSpacing: -0.41,
	},
	iOSTextBlue: {
		fontSize: 17,
		color: "#007AFF", // System Black
		marginBottom: 16,
		fontFamily: "SFProText-Regular",
		letterSpacing: -0.41,
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
