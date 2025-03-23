import { HomeContextProvider } from "@/context/homePageContext";
import { PlaygroundContextProvider } from "@/context/playgroundContext";
import Home from "@/pages/Home";
import Playground from "@/pages/Playground";
import * as eva from "@eva-design/eva";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ApplicationProvider } from "@ui-kitten/components";

export type RootStackParamList = {
	Home: never;
	Playground: { category: string }; // Example: Playground expects a string param
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
	return (
		<ApplicationProvider {...eva} theme={eva.light}>
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Home">
					<Stack.Screen name="Home" component={HomePageWithContext} />
					<Stack.Screen name="Playground" component={Playground} />
				</Stack.Navigator>
			</NavigationContainer>
		</ApplicationProvider>
	);
}

const HomePageWithContext = () => {
	return (
		<HomeContextProvider>
			<Home />
		</HomeContextProvider>
	);
};

// const PlaygroundWithContext = () => {
// 	return (
// 		<PlaygroundContextProvider>
// 			<Playground />
// 		</PlaygroundContextProvider>
// 	);
// };

