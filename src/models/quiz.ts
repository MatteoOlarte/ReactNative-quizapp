import { firebase } from "@/config/config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export type QuizDoc = {
	categories?: { [key: string]: string };
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

export async function fetchAllCategories(): Promise<string[]> {
	try {
		let firestore = firebase.firestore();
    let docRef = doc(firestore, 'quiz-app', 'quizzes');
    let docSnap = await getDoc(docRef);
    let data: QuizDoc

    if (!docSnap.exists()) return [];

    data = docSnap.data() as QuizDoc;

    if (data.categories === undefined) return [];
  
		return Object.keys(data.categories)
	} catch (e) {
    console.log(e);
		throw e;
	}
}
