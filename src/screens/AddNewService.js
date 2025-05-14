import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View, Alert, ScrollView, ImageBackground } from "react-native";
import { Text, TextInput, Button, Surface, IconButton } from "react-native-paper";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase";

const AddNewService = ({ navigation }) => {
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddService = async () => {
    if (!serviceName || !price) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ tên dịch vụ và giá");
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "services"), {
        name: serviceName,
        price: parseFloat(price),
        description: description || "",
        createdAt: serverTimestamp(),
        createdBy: {
          uid: user.uid,
          email: user.email,
        },
      });

      setLoading(false);
      Alert.alert("✅ Thành công", "Dịch vụ đã được thêm", [
        {
          text: "OK",
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
      setServiceName("");
      setPrice("");
      setDescription("");
    } catch (error) {
      setLoading(false);
      Alert.alert("❌ Lỗi", "Không thể thêm dịch vụ. Chi tiết: " + error.message);
    }
  };

  const formatPrice = (text) => {
    // Xóa các ký tự không phải số
    const numericValue = text.replace(/[^0-9]/g, '');
    
    // Định dạng số với dấu phân cách hàng nghìn
    if (numericValue) {
      const formattedValue = new Intl.NumberFormat('vi-VN').format(parseInt(numericValue));
      setPrice(formattedValue);
    } else {
      setPrice('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
    
        <ScrollView contentContainerStyle={styles.scroll}>
          <Surface style={styles.surface}>
            <View style={styles.headerContainer}>
              <Text variant="headlineMedium" style={styles.title}>
                Thêm Dịch Vụ Mới
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Tên dịch vụ</Text>
              <TextInput
                value={serviceName}
                onChangeText={setServiceName}
                style={styles.input}
                mode="outlined"
                outlineColor="#FF6B6B"
                activeOutlineColor="#FF6B6B"
                placeholder="Nhập tên dịch vụ"
                left={<TextInput.Icon icon="tag" color="#FF6B6B" />}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Giá (VNĐ)</Text>
              <TextInput
                value={price}
                onChangeText={formatPrice}
                keyboardType="numeric"
                style={styles.input}
                mode="outlined"
                outlineColor="#FF6B6B"
                activeOutlineColor="#FF6B6B"
                placeholder="0"
                left={<TextInput.Icon icon="currency-usd" color="#FF6B6B" />}
                right={<TextInput.Affix text="VNĐ" />}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mô tả</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                style={[styles.input, styles.multilineInput]}
                mode="outlined"
                outlineColor="#FF6B6B"
                activeOutlineColor="#FF6B6B"
                placeholder="Nhập mô tả chi tiết về dịch vụ"
                left={<TextInput.Icon icon="text" color="#FF6B6B" />}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button 
                mode="outlined" 
                onPress={() => navigation.goBack()} 
                style={styles.cancelButton}
                textColor="#636e72"
              >
                Hủy
              </Button>
              <Button 
                mode="contained" 
                onPress={handleAddService} 
                style={styles.addButton}
                loading={loading}
                buttonColor="#FF6B6B"
              >
                Thêm Dịch Vụ
              </Button>
            </View>
          </Surface>
        </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  surface: {
    padding: 24,
    elevation: 8,
    borderRadius: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  icon: {
    backgroundColor: "#f8e8f8",
  },
  title: {
    fontWeight: "bold",
    color: "#FF6B6B",
    marginLeft: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "500",
    color: "#636e72",
    marginLeft: 4,
  },
  input: {
    backgroundColor: "white",
  },
  multilineInput: {
    height: 120,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    borderColor: "#dfe6e9",
  },
  addButton: {
    flex: 2,
    borderRadius: 8,
  },
});

export default AddNewService;