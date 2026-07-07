import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch, store } from './store/store';
import { setUser, setLoading } from './store/authSlice';
import { authService } from './services/authService';
import LoginScreen from './screens/auth/LoginScreen';
import SignUpScreen from './screens/auth/SignUpScreen';
import HomeScreen from './screens/home/HomeScreen';
import MenuScreen from './screens/menu/MenuScreen';
import ItemDetailsScreen from './screens/menu/ItemDetailsScreen';
import CartScreen from './screens/cart/CartScreen';
import CheckoutScreen from './screens/checkout/CheckoutScreen';
import OrderConfirmationScreen from './screens/checkout/OrderConfirmationScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MenuStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MenuList" component={MenuScreen} />
      <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} />
    </Stack.Navigator>
  );
}

function CheckoutStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
    </Stack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuStackNavigator}
        options={{ tabBarLabel: 'Menu' }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ tabBarLabel: 'Cart' }}
      />
      <Tab.Screen
        name="CheckoutStack"
        component={CheckoutStackNavigator}
        options={{
          tabBarLabel: 'Checkout',
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const dispatch = useDispatch<AppDispatch>();
  const { authenticated, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(setLoading(true));
    const unsubscribe = authService.onAuthStateChanged((user) => {
      dispatch(setUser(user));
      dispatch(setLoading(false));
    });

    return unsubscribe;
  }, [dispatch]);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {authenticated ? (
          <Stack.Screen name="AppTabs" component={AppTabs} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
