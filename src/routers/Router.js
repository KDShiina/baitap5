import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/Login";
import Register from "../screens/Register";
import Admin from "../screens/Admin";
import Customer from "../screens/Customer";
import { auth, db } from "../../firebase"; // Firebase import
import { doc, getDoc } from "firebase/firestore";

const Stack = createStackNavigator();

const Router = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // Lưu role của người dùng

  // Hàm lấy role từ Firestore
  const getUserRole = async (uid) => {
    try {
      const userDocRef = doc(db, "USERS", uid); // Tìm kiếm người dùng theo UID
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userRole = userDocSnap.data().role; // Lấy role
        setRole(userRole); // Lưu role vào state
      } else {
        console.log("No such user document!");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Lấy thông tin người dùng từ Firebase Auth
        setUser(user);
        // Sau khi đăng nhập, lấy role của người dùng từ Firestore
        getUserRole(user.uid);
      } else {
        setUser(null);
        setRole(null); // Reset role khi người dùng logout
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Stack.Navigator
      initialRouteName={user ? (role === "admin" ? "Admin" : "Customer") : "Login"}
      screenOptions={{
        headerShown: false, // Hide header for all screens
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Admin" component={Admin} />
      <Stack.Screen name="Customer" component={Customer} />
    </Stack.Navigator>
  );
};

export default Router;
