import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Provider as PaperProvider,
  DefaultTheme,
  Surface,
  Text,
  Avatar,
  useTheme
} from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useMyContextController } from "../store";

import RouterService from "../routers/RouterService";
import Transaction from "./Transaction";
import Customers from "./Customers";
import Setting from "./Setting";

const Tab = createMaterialBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#6200ee",
    accent: "#03dac6",
    background: "#f6f6f6",
    surface: "#ffffff",
    text: "#121212",
    error: "#CF6679",
    onBackground: "#121212",
    onSurface: "#121212",
  },
};

const Header = () => {
  const [controller] = useMyContextController();
  const { colors } = useTheme();
  const userInfo = controller.userLogin || { name: "Admin" };

  return (
    <Surface style={styles.headerContainer}>
      <LinearGradient
        colors={['#6200ee', '#9c4dff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerInfo}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.nameText}>{userInfo.name || userInfo.email}</Text>
          </View>
        </View>
      </LinearGradient>
    </Surface>
  );
};

const ScreenWithHeader = (Component) => (props) => (
  <View style={styles.screenContainer}>
    <Header />
    <Component {...props} />
  </View>
);

// Danh sách các tab
const tabs = [
  {
    name: "RouterService",
    label: "Home",
    icon: "home",
    color: "#FF6B6B",
    component: RouterService,
  },
  {
    name: "Transaction",
    label: "Transactions",
    icon: "cash-multiple",
    color: "#FF6B6B",
    component: Transaction,
  },
  {
    name: "Customers",
    label: "Customers",
    icon: "account-group",
    color: "#3700B3",
    component: Customers,
  },
  {
    name: "Setting",
    label: "Settings",
    icon: "cog-outline",
    color: "#BB86FC",
    component: Setting,
  },
];

const Admin = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar barStyle="light-content" backgroundColor="#6200ee" />
        <SafeAreaView style={styles.container} edges={['top']}>
          <Tab.Navigator
            initialRouteName="RouterService"
            shifting
            labeled
            sceneAnimationEnabled
            barStyle={styles.tabBar}
            activeColor="#ffffff"
            inactiveColor="rgba(255,255,255,0.7)"
          >
            {tabs.map(({ name, label, icon, color, component }) => (
              <Tab.Screen
                key={name}
                name={name}
                component={ScreenWithHeader(component)}
                options={{
                  tabBarLabel: label,
                  tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name={icon} color={color} size={24} />
                  ),
                  tabBarColor: color,
                }}
              />
            ))}
          </Tab.Navigator>
        </SafeAreaView>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  screenContainer: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  tabBar: {
    elevation: 8,
    height: 60,
    backgroundColor: "#FF6B6B",
  },
  headerContainer: {
    elevation: 4,
    overflow: "hidden",
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerInfo: {
    flex: 1,
  },
  welcomeText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "500",
  },
  nameText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 4,
  },
  avatar: {
    marginLeft: 16,
  },
});

export default Admin;
