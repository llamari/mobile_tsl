import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { EmployeeNewsPage } from './src/pages/AllNews'; // ajuste o caminho
import { SpecificPostPage } from './src/pages/Post';
import { CashFlow } from './src/pages/CashFlow';
import { CreateAnnouncement } from './src/pages/CreateAnnouncement';
import { Suppliers } from './src/pages/Suppliers';
import { SupplierDetail } from './src/pages/SupplierDetail';
import { CreateSupplier } from './src/pages/CreateSupplier';

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
          <Stack.Screen name="CreateAnnouncement" component={CreateAnnouncement} />
          <Stack.Screen name="CashFlow" component={CashFlow} />
          <Stack.Screen name="Suppliers" component={Suppliers} />
          <Stack.Screen name="SupplierDetail" component={SupplierDetail} />
          <Stack.Screen name="CreateSupplier" component={CreateSupplier} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
