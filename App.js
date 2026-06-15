import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { EmployeeNewsPage } from './src/pages/AllNews'; // ajuste o caminho
import { SpecificPostPage } from './src/pages/Post';
import { CashFlow } from './src/pages/CashFlow';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="EmployeeNewsPage"
        >
          <Stack.Screen name="EmployeeNewsPage" component={EmployeeNewsPage} />
          <Stack.Screen name="SpecificPostPage" component={SpecificPostPage} />
          <Stack.Screen name="CashFlow" component={CashFlow} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
