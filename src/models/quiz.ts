import { firebase } from "@/config/config";
import { collection, doc, DocumentReference, getDoc, getDocs } from "firebase/firestore";

export type QuizDoc = {
	categories: QuizCategory[];
};

export type Question = {
	option1: string;
	option2: string;
	option3: string;
	option4: string;
	correctOption: number;
	difficulty: string;
	question: string;
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

		return data.categories.map((element) => ({
			colorbg: element.colorbg,
			coloron: element.coloron,
			name: element.name,
			ref: element.ref,
		}));
	} catch (e) {
		console.error(e);
		throw e;
	}
}

export async function fetchQuestionsFromQuiz(quizID: string): Promise<Question[]> {
	try {
		let firestore = firebase.firestore();
		let colRef = collection(firestore, "quiz-app", "quizzes", "test-quiz", quizID, "questions");
		let docsSnap = await getDocs(colRef);

		if (docsSnap.empty) return [];

		return docsSnap.docs.map((doc) => {
			const data = doc.data();

			return {
				option1: data.option1,
				option2: data.option2,
				option3: data.option3,
				option4: data.option4,
				correctOption: data.correctOption,
				difficulty: data.difficulty,
				question: data.question,
			} as Question;
		});
	} catch (e) {
		console.log(e);
		throw e;
	}
}
