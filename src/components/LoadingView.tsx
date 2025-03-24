import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function LoadingView({}) {
	return (
		<View style={styles.loadingContainer}>
			<ActivityIndicator size="large" />
			<Text>Cargando Preguntas...</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
