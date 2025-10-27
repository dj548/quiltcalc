import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import QuiltBackground from './src/components/QuiltBackground';

import HomeScreen from './src/screens/HomeScreen';
import CalculatorsScreen from './src/screens/CalculatorsScreen';
import FabricPreviewScreen from './src/screens/FabricPreviewScreen';
import MaterialsListScreen from './src/screens/MaterialsListScreen';
import LoginScreen from './src/screens/LoginScreen';
import QuiltFinishingCalculatorScreen from './src/screens/QuiltFinishingCalculatorScreen';
import FabricBrowserScreen from './src/screens/FabricBrowserScreen';

import { theme } from './src/theme/colors';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        {/* Temporarily disable QuiltBackground for debugging */}
        {/* <QuiltBackground opacity={0.08} /> */}
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.primary,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'QuiltCalc' }}
          />
          <Stack.Screen 
            name="Calculators" 
            component={CalculatorsScreen} 
            options={{ title: 'Quilting Calculators' }}
          />
          <Stack.Screen 
            name="QuiltFinishing" 
            component={QuiltFinishingCalculatorScreen} 
            options={{ title: 'Quilt Finishing Calculator' }}
          />
          <Stack.Screen 
            name="FabricPreview" 
            component={FabricPreviewScreen} 
            options={{ title: 'Fabric Preview' }}
          />
          <Stack.Screen 
            name="FabricBrowser" 
            component={FabricBrowserScreen} 
            options={{ title: 'Browse Fabrics' }}
          />
          <Stack.Screen 
            name="MaterialsList" 
            component={MaterialsListScreen} 
            options={{ title: 'Materials List' }}
          />
        </Stack.Navigator>
        </NavigationContainer>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
