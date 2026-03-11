import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

import HomeScreen from '../screens/student/HomeScreen';
import SubjectsScreen from '../screens/student/SubjectsScreen';
import AssignmentsScreen from '../screens/student/AssignmentsScreen';
import GradesScreen from '../screens/student/GradesScreen';

import TeacherHomeScreen from '../screens/teacher/TeacherHomeScreen';
import TeacherSubjectsScreen from '../screens/teacher/TeacherSubjectsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const StudentTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused }) => {
        const icons = { Home: '🏠', Subjects: '📚', Assignments: '📋', Grades: '⭐' };
        return <Text style={{ fontSize: focused ? 22 : 18 }}>{icons[route.name]}</Text>;
      },
      tabBarActiveTintColor: '#4F46E5',
      tabBarInactiveTintColor: '#9CA3AF',
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Subjects" component={SubjectsScreen} />
    <Tab.Screen name="Assignments" component={AssignmentsScreen} />
    <Tab.Screen name="Grades" component={GradesScreen} />
  </Tab.Navigator>
);

const TeacherTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused }) => {
        const icons = { Home: '🏠', Subjects: '📚', Assignments: '📋' };
        return <Text style={{ fontSize: focused ? 22 : 18 }}>{icons[route.name]}</Text>;
      },
      tabBarActiveTintColor: '#7C3AED',
      tabBarInactiveTintColor: '#9CA3AF',
    })}
  >
    <Tab.Screen name="Home" component={TeacherHomeScreen} />
    <Tab.Screen name="Subjects" component={TeacherSubjectsScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <AuthStack />;
  if (user.role === 'teacher') return <TeacherTabs />;
  return <StudentTabs />;
};

export default AppNavigator;
