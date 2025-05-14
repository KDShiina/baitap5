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

// Import screens
import RouterService from "../routers/RouterService";
import Transaction from "./Transaction";
import Customers from "./Customers";
import Setting from "./Setting";

const Tab = createMaterialBottomTabNavigator();

// Custom theme with more elegant colors
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

// Header component with user info and gradient
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
          <Avatar.Text 
            size={50} 
            label={userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "A"}
            style={styles.avatar}
            color="#fff"
            backgroundColor="rgba(255,255,255,0.2)" 
          />
        </View>
      </LinearGradient>
    </Surface>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="RouterService"
      shifting={true}
      labeled={true}
      sceneAnimationEnabled={true}
      barStyle={styles.tabBar}
      activeColor="#ffffff"
      inactiveColor="rgba(255,255,255,0.7)"
    >
      <Tab.Screen
        name="RouterService"
        component={RouterService}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={24} />
          ),
          tabBarColor: "#6200ee", // Purple for Home
        }}
      />
      <Tab.Screen
        name="Transaction"
        component={Transaction}
        options={{
          tabBarLabel: "Transactions",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cash-multiple" color={color} size={24} />
          ),
          tabBarColor: "#018786", // Teal for Transactions
        }}
      />
      <Tab.Screen
        name="Customers"
        component={Customers}
        options={{
          tabBarLabel: "Customers",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={24} />
          ),
          tabBarColor: "#3700B3", // Deep purple for Customers
        }}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog-outline" color={color} size={24} />
          ),
          tabBarColor: "#BB86FC", // Light purple for Settings
        }}
      />
    </Tab.Navigator>
  );
};

// Wrapper to ensure each screen has the header
const ScreenWithHeader = ({ children }) => {
  return (
    <View style={styles.screenContainer}>
      <Header />
      {children}
    </View>
  );
};

// Modified screen components with header
const HomeScreenWithHeader = ({ navigation }) => (
  <ScreenWithHeader>
    <RouterService navigation={navigation} />
  </ScreenWithHeader>
);

const TransactionScreenWithHeader = ({ navigation }) => (
  <ScreenWithHeader>
    <Transaction navigation={navigation} />
  </ScreenWithHeader>
);

const CustomersScreenWithHeader = ({ navigation }) => (
  <ScreenWithHeader>
    <Customers navigation={navigation} />
  </ScreenWithHeader>
);

const SettingScreenWithHeader = ({ navigation }) => (
  <ScreenWithHeader>
    <Setting navigation={navigation} />
  </ScreenWithHeader>
);

const Admin = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar barStyle="light-content" backgroundColor="#6200ee" />
        <SafeAreaView style={styles.container} edges={['top']}>
          <Tab.Navigator
            initialRouteName="RouterService"
            shifting={true}
            labeled={true}
            sceneAnimationEnabled={true}
            barStyle={styles.tabBar}
            activeColor="#ffffff"
            inactiveColor="rgba(255,255,255,0.7)"
          >
            <Tab.Screen
              name="RouterService"
              component={HomeScreenWithHeader}
              options={{
                tabBarLabel: "Home",
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="home" color={color} size={24} />
                ),
                tabBarColor: "#FF6B6B", // Purple for Home
              }}
            />
            <Tab.Screen
              name="Transaction"
              component={TransactionScreenWithHeader}
              options={{
                tabBarLabel: "Transactions",
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="cash-multiple" color={color} size={24} />
                ),
                tabBarColor: "#FF6B6B", // Teal for Transactions
              }}
            />
            <Tab.Screen
              name="Customers"
              component={CustomersScreenWithHeader}
              options={{
                tabBarLabel: "Customers",
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="account-group" color={color} size={24} />
                ),
                tabBarColor: "#3700B3", // Deep purple for Customers
              }}
            />
            <Tab.Screen
              name="Setting"
              component={SettingScreenWithHeader}
              options={{
                tabBarLabel: "Settings",
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="cog-outline" color={color} size={24} />
                ),
                tabBarColor: "#BB86FC", // Light purple for Settings
              }}
            />
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
    backgroundColor: "#f6f6f6", // Soft background color for better contrast
  },
  tabBar: {
    elevation: 8,
    borderTopWidth: 0,
    height: 60,
    backgroundColor: "#FF6B6B",
  },
  headerContainer: {
    elevation: 4,
    overflow: "hidden",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
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
