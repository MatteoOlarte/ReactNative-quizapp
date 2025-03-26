import { HomeContextProvider } from "@/context/homePageContext";
import { PlaygroundContextProvider } from "@/context/playgroundContext";
import { UserAuthContextProvider } from "@/context/userAuthContext";
import Home from "@/pages/Home";
import LoginScreen from "@/pages/LoginScreen";
import Playground from "@/pages/Playground";
import RegisterScreen from "@/pages/RegisterScreen";
import * as eva from "@eva-design/eva";
import { NavigationContainer } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import { ApplicationProvider } from "@ui-kitten/components";

export type RootStackParamList = {
	Home: undefined;
	Playground: { category: string }; // Example: Playground expects a string param
	Login: undefined;
	Register: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
	return (
		<ApplicationProvider {...eva} theme={eva.light}>
			<UserAuthContextProvider>
				<NavigationContainer>
					<Stack.Navigator initialRouteName="Home">
						<Stack.Screen name="Home" component={HomePageWithContext} />
						<Stack.Screen name="Playground" component={PlaygroundWithContext} />
						<Stack.Screen name="Login" component={LoginScreen} />
						<Stack.Screen name="Register" component={RegisterScreen} />
					</Stack.Navigator>
				</NavigationContainer>
			</UserAuthContextProvider>
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

const PlaygroundWithContext = ({ navigation, route }: NativeStackScreenProps<RootStackParamList, "Playground">) => {
	return (
		<PlaygroundContextProvider>
			<Playground navigation={navigation} route={route} />
		</PlaygroundContextProvider>
	);
};
