import { firebase } from "@/config/config";
import { doc, DocumentReference, getDoc } from "firebase/firestore";

export type QuizDoc = {
	categories: QuizCategory[];
};

export type Question = {
	category: string;
	correctOption: number;
	difficulty: string;
	option1: string;
	option2: string;
	option3: string;
	option4: string;
};

export type QuizCategory = {
	colorbg?: string;
	coloron?: string;
	name: string;
	ref: DocumentReference;
};

export async function fetchAllCategories(): Promise<QuizCategory[]> {
	try {
		let firestore = firebase.firestore();
		let docRef = doc(firestore, "quiz-app", "quizzes");
		let docSnap = await getDoc(docRef);
		let data: QuizDoc;

		if (!docSnap.exists()) return [];

		data = docSnap.data() as QuizDoc;

		console.log(data);

		return data.categories.map((element) => ({
			colorbg: element.colorbg,
			coloron: element.coloron,
			name: element.name,
			ref: element.ref,
		}));
	} catch (e) {
		console.log(e);
		throw e;
	}
}
