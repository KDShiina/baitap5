import { Text, View, StyleSheet } from "react-native";

const Transaction = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Customers Screens</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default Transaction;