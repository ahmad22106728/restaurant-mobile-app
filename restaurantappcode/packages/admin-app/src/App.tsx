import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch, store } from './store/store';
import { setUser, setLoading, logout } from './store/authSlice';
import { authService } from './services/authService';

const Stack = createNativeStackNavigator();

function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    try {
      await authService.signOut();
      dispatch(logout());
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Welcome, {user?.displayName}</Text>
      </View>

      <View style={styles.gridContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Orders</Text>
          <Text style={styles.cardValue}>0</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Menu</Text>
          <Text style={styles.cardValue}>0</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Discounts</Text>
          <Text style={styles.cardValue}>0</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sunmi Device</Text>
          <Text style={styles.cardValue}>0</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

function AdminLogin({ navigation }: any) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async () => {
    if (!email || !password) {
      return;
    }
    dispatch(setLoading(true));
    try {
      const user = await authService.signIn(email, password);
      dispatch(setUser(user));
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <View style={styles.loginContainer}>
      <Text style={styles.loginTitle}>Admin Login</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.input} />
        <Text style={styles.label}>Password</Text>
        <View style={styles.input} />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
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
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {authenticated ? (
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        ) : (
          <Stack.Screen name="AdminLogin" component={AdminLogin} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1976d2',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    margin: '1%',
    padding: 20,
    borderRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  logoutButton: {
    backgroundColor: '#d32f2f',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  form: {
    gap: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    height: 45,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#1976d2',
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
