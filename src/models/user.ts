import { firebase } from "@/config/config";

export default class User {
	readonly id: string;
	name: string;
	email: string;
	points?: number;

	constructor(id: string, name: string, email: string) {
		this.id = id;
		this.name = name;
		this.email = email;
	}

	async loginWithEmailAndPassword(password: string): Promise<User | null> {
		let result = await loginUserWithEmailAndPassword(this.email, password);
		return result;
	}

	async fetchPoints(force: boolean = false): Promise<number> {
		// If points are already cached, return them
		if (this.points !== undefined || force) {
			return this.points ?? 0;
		}

		try {
			const firestore = firebase.firestore();
			let userRef = firestore.collection("quiz-app").doc("users").collection("users").doc(this.id);
			let userDoc = await userRef.get();

			// Check if the document exists
			if (!userDoc.exists) {
				throw new Error("User document does not exist");
			}

			// Get the points from the document
			const data = userDoc.data();
			const fetchedPoints = data?.points;

			// Validate that points exist and are a number
			if (typeof fetchedPoints !== "number") {
				throw new Error("Points field is missing or invalid");
			}

			// Cache the points
			this.points = fetchedPoints;

			return this.points;
		} catch (error) {
			throw new Error(`Failed to fetch points: ${error instanceof Error ? error.message : "Unknown error"}`);
		}
	}

	async addPoints(points: number): Promise<void> {
		try {
			// Referencia al documento del usuario en Firestore
			const firestore = firebase.firestore();
			let userRef = firestore.collection("quiz-app").doc("users").collection("users").doc(this.id);

			// Obtener el documento actual del usuario
			let userDoc = await userRef.get();

			// Verificar si el documento existe
			if (!userDoc.exists) {
				throw new Error("User document does not exist");
			}

			// Obtener los puntos actuales
			const data = userDoc.data();
			const currentPoints = data?.points;

			// Validar que los puntos actuales sean un número
			if (typeof currentPoints !== "number") {
				throw new Error("Current points field is missing or invalid");
			}

			// Calcular los nuevos puntos
			const newPoints = currentPoints + points;

			// Actualizar los puntos en Firestore
			await userRef.update({
				points: newPoints,
			});

			// Actualizar el caché local
			this.points = newPoints;
		} catch (error) {
			throw new Error(`Failed to add points: ${error instanceof Error ? error.message : "Unknown error"}`);
		}
	}
}

export async function loginUserWithEmailAndPassword(email: string, password: string): Promise<User | null> {
	try {
		const firestore = firebase.firestore();
		const auth = firebase.auth();
		let cred = await auth.signInWithEmailAndPassword(email, password);
		let user = cred.user;

		if (user) {
			let document = await firestore.collection("quiz-app/users/users").doc(user.uid).get();
			let data: any;

			if (document.exists) {
				data = document.data();
				return new User(user.uid, data.name, data.email);
			}
		}

		return null;
	} catch (e) {
		throw e;
	}
}

export async function createUserWithEmailAndPassword(name: string, email: string, password: string): Promise<User> {
	try {
		const firestore = firebase.firestore();
		const auth = firebase.auth();
		let cred = await auth.createUserWithEmailAndPassword(email, password);
		let user = cred.user;

		if (user) {
			await firestore.collection("quiz-app/users/users").doc(user.uid).set({
				name: name,
				email: email,
				createdAt: firebase.firestore.FieldValue.serverTimestamp(),
			});

			return new User(user.uid, name, email);
		}

		throw new Error();
	} catch (e) {
		throw e;
	}
}
