import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Button, HelperText, Text, TextInput, ActivityIndicator } from "react-native-paper";
import { useMyContextController, login ,isAuthenticated, getUserRole} from "../store/index"; // Updated import

const Login = ({ navigation }) => {
  const [controller, dispatch] = useMyContextController();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hiddenPassword, setHiddenPassword] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (authenticated) {
          const role = await getUserRole();
          // Navigate based on role
          if (role === "admin") {
            navigation.replace("Admin");
          } else {
            navigation.replace("Customer");
          }
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [navigation]);

  // Monitor auth state changes from context
  useEffect(() => {
    if (controller.userLogin) {
      // User is logged in through context, navigate accordingly
      if (controller.userLogin.role === "admin") {
        navigation.replace("Admin");
      } else {
        navigation.replace("Customer");
      }
    }
  }, [controller.userLogin, navigation]);

  const isValidEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9]{2,}$/.test(email.trim());

  const hasErrorEmail = () => email.length > 0 && !isValidEmail(email);
  const hasErrorPassword = () => password.length > 0 && password.length < 6;

  // Handle login process using context
  const handleLogin = async () => {
    setError(""); // Reset error before login attempt

    if (isValidEmail(email) && password.length >= 6) {
      setIsLoading(true);
      try {
        // Use the login function from context
        await login(dispatch, email, password);
        // No need to navigate here, the useEffect will handle it when userLogin changes
      } catch (error) {
        console.log("Login failed:", error.message);
        setError("Login failed. Please check your credentials.");
        setIsLoading(false);
      }
    } else {
      setError("Please provide valid email and password.");
    }
  };

  if (isLoading || controller.isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="blue" />
        <Text style={styles.loadingText}>Checking login status...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <HelperText type="error" visible={hasErrorEmail()}>
        <Text>Địa chỉ Email không hợp lệ</Text>
      </HelperText>

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={hiddenPassword}
        right={
          <TextInput.Icon
            icon={hiddenPassword ? "eye" : "eye-off"}
            onPress={() => setHiddenPassword(!hiddenPassword)}
          />
        }
        style={styles.input}
      />
      <HelperText type="error" visible={hasErrorPassword()}>
        <Text>Password ít nhất 6 kí tự</Text>
      </HelperText>

      {/* Display error message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button
        mode="contained"
        buttonColor="blue"
        onPress={handleLogin}
        disabled={!email || !password || hasErrorEmail() || hasErrorPassword()}
        style={styles.button}
        loading={controller.isLoading}
      >
        <Text>{controller.isLoading ? "Đang đăng nhập..." : "Login"}</Text>
      </Button>

      <View style={styles.footer}>
        <Text>Don't have an account?</Text>
        <Button onPress={() => navigation.navigate("Register")}>
          <Text>Create new account</Text>
        </Button>
      </View>

      <View style={styles.footer}>
        <Button onPress={() => navigation.navigate("ForgotPassword")}>
          <Text>Forgot Password</Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 40,
    fontWeight: "bold",
    alignSelf: "center",
    color: "pink",
    marginTop: 100,
    marginBottom: 50,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default Login;