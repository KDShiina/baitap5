import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { Alert } from "react-native";
import { auth, db } from "../../firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MyContext = createContext();
MyContext.displayName = "MyAppContext";

// Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "USER_LOGIN":
      return { ...state, userLogin: action.value, isLoading: false };
    case "LOGOUT":
      return { ...state, userLogin: null, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.value };
    default:
      return state;
  }
};

// Provider
const MyContextControllerProvider = ({ children }) => {
  const initialState = {
    userLogin: null,
    services: [],
    isLoading: true, // Add loading state to prevent flickering during auth check
  };

  const [controller, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);

  // Check for existing auth state when app loads
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        try {
          // Get user data from Firestore
          const userDocRef = doc(db, "USERS", user.email);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            // Store user data in context
            dispatch({
              type: "USER_LOGIN",
              value: { ...userData, uid: user.uid, email: user.email },
            });
            
            // Save user data to AsyncStorage for persistence
            await AsyncStorage.setItem("userAuth", JSON.stringify({
              uid: user.uid,
              email: user.email,
              role: userData.role
            }));
          } else {
            console.log("No user document found for authenticated user");
            dispatch({ type: "SET_LOADING", value: false });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          dispatch({ type: "SET_LOADING", value: false });
        }
      } else {
        // No user is signed in
        await AsyncStorage.removeItem("userAuth"); // Clear stored auth data
        dispatch({ type: "SET_LOADING", value: false });
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
};

// Custom hook
const useMyContextController = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error(
      "useMyContextController must be used within a MyContextControllerProvider"
    );
  }
  return context;
};

// Login function
const login = async (dispatch, email, password) => {
  try {
    dispatch({ type: "SET_LOADING", value: true });
    const res = await signInWithEmailAndPassword(auth, email.trim(), password);
    const user = res.user;

    // Get user document in Firestore using email as the key
    const userDocRef = doc(db, "USERS", user.email);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      // Update context
      dispatch({
        type: "USER_LOGIN",
        value: { ...userData, uid: user.uid, email: user.email },
      });
      
      // Save to AsyncStorage
      await AsyncStorage.setItem("userAuth", JSON.stringify({
        uid: user.uid,
        email: user.email,
        role: userData.role
      }));
    } else {
      dispatch({ type: "SET_LOADING", value: false });
      Alert.alert("Login Failed", "Không tìm thấy tài khoản người dùng.");
    }
  } catch (e) {
    dispatch({ type: "SET_LOADING", value: false });
    let message = "Sai email hoặc mật khẩu";
    if (e.code === "auth/user-not-found") {
      message = "Tài khoản không tồn tại.";
    } else if (e.code === "auth/wrong-password") {
      message = "Sai mật khẩu.";
    } else if (e.code === "auth/invalid-email") {
      message = "Email không hợp lệ.";
    }
    Alert.alert("Login Failed", message);
  }
};

// Logout function
const logout = async (dispatch) => {
  try {
    dispatch({ type: "SET_LOADING", value: true });
    await signOut(auth);
    await AsyncStorage.removeItem("userAuth"); // Clear stored auth data
    dispatch({ type: "LOGOUT" });
  } catch (e) {
    dispatch({ type: "SET_LOADING", value: false });
    Alert.alert("Logout Failed", e.message);
  }
};

// Function to check if user is logged in (useful for navigation guards)
const isAuthenticated = async () => {
  try {
    const userAuth = await AsyncStorage.getItem("userAuth");
    return userAuth !== null;
  } catch (error) {
    console.error("Error checking authentication status:", error);
    return false;
  }
};

// Function to get stored user role (useful for role-based navigation)
const getUserRole = async () => {
  try {
    const userAuth = await AsyncStorage.getItem("userAuth");
    if (userAuth) {
      const userData = JSON.parse(userAuth);
      return userData.role;
    }
    return null;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
};

export {
  MyContextControllerProvider,
  useMyContextController,
  login,
  logout,
  isAuthenticated,
  getUserRole
};