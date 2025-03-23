import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

interface PlaygroundProps {
	route?: any;
}

export default function Playground({ route }: PlaygroundProps) {
	const { category } = route.params;

  console.log(category);
  
	return (
		<View style={styles.container}>
			<Text>{"category"}</Text>
			<StatusBar style="auto" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
