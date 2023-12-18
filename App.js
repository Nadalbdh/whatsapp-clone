import Accueil from "./Screens/Accueil";
import Authentification from "./Screens/Authentification";
import NewUser from "./Screens/NewUser";
import Chat from "./Screens/Chat";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" component={Authentification}></Stack.Screen>
        <Stack.Screen name="newuser" component={NewUser}></Stack.Screen>
        <Stack.Screen name="accueil" component={Accueil}></Stack.Screen>
        <Stack.Screen name="chat" component={Chat}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
