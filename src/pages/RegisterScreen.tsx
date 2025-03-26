import { RootStackParamList } from "@/config/App";
import { useUserAuthContext } from "@/context/userAuthContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useRef, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type RegisterForm = {
	name?: string;
	email?: string;
	passwordA?: string;
	passwordB?: string;
};

export default function RegisterScreen() {
	const context = useUserAuthContext();
	const nameRef = useRef<TextInput>(null);
	const emailRef = useRef<TextInput>(null);
	const passwordARef = useRef<TextInput>(null);
	const passwordBRef = useRef<TextInput>(null);
	const [form, setForm] = useState<RegisterForm>({});
	const nav = useNavigation<StackNavigationProp<RootStackParamList>>();

	const handleInputChange = (field: keyof RegisterForm, value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleRegister = async () => {
		try {
			await context.registerUserWithEmailAndPassword(form.name, form.email, form.passwordA, form.passwordB);
			nav.navigate("Home");
		} catch (error) {
			Alert.alert("Login Failed", error instanceof Error ? error.message : "An error occurred");
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.inputContainer}>
				<TextInput
					ref={nameRef}
					style={styles.input}
					placeholder="Nombre Completo"
					placeholderTextColor="#8E8E93"
					keyboardType="name-phone-pad"
					autoCapitalize="none"
					editable={!context.isLoading}
					returnKeyType="next"
					onSubmitEditing={() => emailRef.current?.focus()}
					value={form.name}
					onChangeText={(text) => handleInputChange("name", text)}
				/>

				<TextInput
					ref={emailRef}
					style={styles.input}
					placeholder="Correo Electronico"
					placeholderTextColor="#8E8E93"
					keyboardType="email-address"
					autoCapitalize="none"
					editable={!context.isLoading}
					returnKeyType="next"
					onSubmitEditing={() => passwordARef.current?.focus()}
					value={form.email}
					onChangeText={(text) => handleInputChange("email", text)}
				/>

				<TextInput
					ref={passwordARef}
					style={styles.input}
					placeholder="Contraseña"
					placeholderTextColor="#8E8E93"
					autoCapitalize="none"
					editable={!context.isLoading}
					returnKeyType="next"
					onSubmitEditing={() => passwordBRef.current?.focus()}
					value={form.passwordA}
					onChangeText={(text) => handleInputChange("passwordA", text)}
				/>

				<TextInput
					ref={passwordBRef}
					style={styles.input}
					placeholder="Confirmar Contraseña"
					placeholderTextColor="#8E8E93"
					autoCapitalize="none"
					editable={!context.isLoading}
					returnKeyType="go"
					onSubmitEditing={() => handleRegister}
					value={form.passwordB}
					onChangeText={(text) => handleInputChange("passwordB", text)}
				/>
			</View>

			<TouchableOpacity
				style={[styles.button, context.isLoading && styles.buttonDisabled]}
				onPress={handleRegister}
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
