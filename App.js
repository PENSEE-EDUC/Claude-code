import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

// Auth screens
import Onboarding from './src/screens/Onboarding';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import VerifySMS from './src/screens/VerifySMS';

// Main screens
import Dashboard from './src/screens/Dashboard';
import Planning from './src/screens/Planning';
import Supports from './src/screens/Supports';
import ChatsList from './src/screens/ChatsList';
import ChatDetail from './src/screens/ChatDetail';
import Rankings from './src/screens/Rankings';
import Profile from './src/screens/Profile';
import PartnerDashboard from './src/screens/PartnerDashboard';
import BecomePartner from './src/screens/BecomePartner';
import Payment from './src/screens/Payment';

import useAuthStore from './src/stores/authStore';
import useChatStore from './src/stores/chatStore';
import { Colors } from './src/theme/colors';
import LoadingSpinner from './src/components/LoadingSpinner';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { language } = useAuthStore();
  const TAB_LABELS = language === 'fr'
    ? { home: 'Accueil', planning: 'Planning', supports: 'Supports', chats: 'Chats', rankings: 'Classements', profile: 'Profil' }
    : { home: 'Home', planning: 'Planning', supports: 'Materials', chats: 'Chats', rankings: 'Rankings', profile: 'Profile' };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Planning: focused ? 'calendar' : 'calendar-outline',
            Supports: focused ? 'book' : 'book-outline',
            Chats: focused ? 'chatbubbles' : 'chatbubbles-outline',
            Rankings: focused ? 'trophy' : 'trophy-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name] || 'ellipse-outline'} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.grey,
        headerShown: false,
        tabBarStyle: {
          height: 64,
          paddingBottom: 10,
          paddingTop: 6,
          borderTopColor: Colors.border,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      })}
    >
      <Tab.Screen name="Home" component={Dashboard} options={{ title: TAB_LABELS.home }} />
      <Tab.Screen name="Planning" component={Planning} options={{ title: TAB_LABELS.planning }} />
      <Tab.Screen name="Supports" component={Supports} options={{ title: TAB_LABELS.supports }} />
      <Tab.Screen name="Chats" component={ChatsList} options={{ title: TAB_LABELS.chats }} />
      <Tab.Screen name="Rankings" component={Rankings} options={{ title: TAB_LABELS.rankings }} />
      <Tab.Screen name="Profile" component={Profile} options={{ title: TAB_LABELS.profile }} />
    </Tab.Navigator>
  );
}

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animationEnabled: true }}>
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="VerifySMS" component={VerifySMS} />
    </Stack.Navigator>
  );
}

function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.white, elevation: 0, shadowOpacity: 0 },
        headerTintColor: Colors.text.primary,
        headerTitleStyle: { fontWeight: '700', fontSize: 17 },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="ChatDetail" component={ChatDetail} />
      <Stack.Screen name="PartnerDashboard" component={PartnerDashboard} options={{ title: 'Espace Partenaire' }} />
      <Stack.Screen name="BecomePartner" component={BecomePartner} options={{ title: 'Devenir Partenaire' }} />
      <Stack.Screen name="Payment" component={Payment} options={{ title: 'Paiement' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  const { user, loadUser } = useAuthStore();
  const { initSocket, disconnectSocket } = useChatStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    loadUser().finally(() => setInitializing(false));
  }, []);

  useEffect(() => {
    if (user) {
      initSocket();
    } else {
      disconnectSocket();
    }
  }, [user]);

  if (initializing) {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar style="auto" />
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
