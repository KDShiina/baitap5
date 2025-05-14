// App.js
import { useEffect } from "react";
import { Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { MyContextControllerProvider } from "./src/store/index";
import Router from "./src/routers/Router";

// Firebase Web SDK
import { app } from "./firebase";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const App = () => {
  const db = getFirestore(app);
  const auth = getAuth(app);

  const admin = {
    fullName: "Admin",
    email: "vanhuudhsp@gmail.com",
    password: "123456",
    phone: "0913131732",
    address: "Binh Duong",
    role: "admin",
  };

  useEffect(() => {
    const createAdminIfNotExist = async () => {
      try {
        const userDocRef = doc(db, "USERS", admin.email);
        const docSnap = await getDoc(userDocRef);

        if (!docSnap.exists()) {
          await createUserWithEmailAndPassword(auth, admin.email, admin.password);
          await setDoc(userDocRef, admin);
          console.log("Add new account admin");
        }
      } catch (error) {
        console.error("Error creating admin user:", error);
        Alert.alert("Firebase Error", error.message);
      }
    };

    createAdminIfNotExist();
  }, []);

  return (
    <MyContextControllerProvider>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </MyContextControllerProvider>
  );
};

export default App;