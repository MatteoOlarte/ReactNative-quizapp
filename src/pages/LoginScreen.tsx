import { RootStackParamList } from "@/config/App";
import { useUserAuthContext } from "@/context/userAuthContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";

type LoginForm = {
	email: string;
	password: string;
};

export default function LoginScreen() {
	const [form, setForm] = useState<LoginForm>({
		email: "",
		password: "",
	});
	const context = useUserAuthContext();
	const emailRef = useRef<TextInput>(null);
	const passwordRef = useRef<TextInput>(null);
	const nav = useNavigation<StackNavigationProp<RootStackParamList>>();

	const handleInputChange = (field: keyof LoginForm, value: string) => {
		setForm((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleLogin = async () => {
		try {
			await context.loginWithEmailAndPassword(form.email, form.password);
			nav.navigate("Home");
		} catch (error) {
			Alert.alert("Login Failed", error instanceof Error ? error.message : "An error occurred");
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.inputContainer}>
				<TextInput
					ref={emailRef}
					style={styles.input}
					placeholder="Email"
					placeholderTextColor="#8E8E93"
					value={form.email}
					onChangeText={(text) => handleInputChange("email", text)}
					keyboardType="email-address"
					autoCapitalize="none"
					editable={!context.isLoading}
					returnKeyType="next"
					onSubmitEditing={() => passwordRef.current?.focus()}
				/>
				<TextInput
					ref={passwordRef}
					style={styles.input}
					placeholder="Password"
					placeholderTextColor="#8E8E93"
					value={form.password}
					onChangeText={(text) => handleInputChange("password", text)}
					secureTextEntry
					editable={!context.isLoading}
					returnKeyType="go"
					onSubmitEditing={handleLogin}
				/>
			</View>
			<TouchableOpacity
				style={[styles.button, context.isLoading && styles.buttonDisabled]}
				onPress={handleLogin}
				disabled={context.isLoading}
			>
				<Text style={styles.buttonText}>{context.isLoading ? "Logging in..." : "Login"}</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#FFFFFF",
	},
	title: {
		fontSize: 34,
		fontWeight: "700",
		color: "#000000",
		textAlign: "center",
		marginBottom: 40,
		fontFamily: "SFProDisplay-Bold",
	},
	inputContainer: {
		marginBottom: 20,
	},
	input: {
		backgroundColor: "#F2F2F7",
		borderRadius: 10,
		padding: 14,
		marginBottom: 12,
		fontSize: 17,
		color: "#000000",
		fontFamily: "SFProText-Regular",
	},
	button: {
		backgroundColor: "#007AFF",
		borderRadius: 10,
		padding: 14,
		alignItems: "center",
	},
	buttonDisabled: {
		backgroundColor: "#D1D1D6",
	},
	buttonText: {
		color: "#FFFFFF",
		fontSize: 17,
		fontWeight: "600",
		fontFamily: "SFProText-Semibold",
	},
});
