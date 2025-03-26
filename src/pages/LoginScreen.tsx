import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export interface LoginScreenProps {
	onLogin?: (email: string, password: string) => Promise<void>;
}

type LoginForm = {
	email: string;
	password: string;
};

export default function LoginScreen({ onLogin }: LoginScreenProps) {
	const [form, setForm] = useState<LoginForm>({
		email: "",
		password: "",
	});
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleInputChange = (field: keyof LoginForm, value: string) => {
		setForm((prev) => ({
			...prev,
			[field]: value,
		}));
	};
  
	const handleLogin = async () => {
		if (!form.email || !form.password) {
			Alert.alert("Error", "Please fill in all fields");
			return;
		}

		setIsLoading(true);
		try {
			if (onLogin) {
				await onLogin(form.email, form.password);
			}
			setForm({ email: "", password: "" });
		} catch (error) {
			Alert.alert("Login Failed", error instanceof Error ? error.message : "An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.inputContainer}>
				<TextInput
					style={styles.input}
					placeholder="Email"
					placeholderTextColor="#8E8E93"
					value={form.email}
					onChangeText={(text) => handleInputChange("email", text)}
					keyboardType="email-address"
					autoCapitalize="none"
					editable={!isLoading}
				/>
				<TextInput
					style={styles.input}
					placeholder="Password"
					placeholderTextColor="#8E8E93"
					value={form.password}
					onChangeText={(text) => handleInputChange("password", text)}
					secureTextEntry
					editable={!isLoading}
				/>
			</View>
			<TouchableOpacity
				style={[styles.button, isLoading && styles.buttonDisabled]}
				onPress={handleLogin}
				disabled={isLoading}
			>
				<Text style={styles.buttonText}>{isLoading ? "Logging in..." : "Login"}</Text>
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
