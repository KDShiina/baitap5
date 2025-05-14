import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { TextInput, Button, Text, Surface, IconButton, HelperText, ActivityIndicator, Portal, Dialog } from "react-native-paper";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase"; 
import { LinearGradient } from "expo-linear-gradient";

const EditService = ({ route, navigation }) => {
  const { service } = route.params;

  const [name, setName] = useState(service.name);
  const [price, setPrice] = useState(service.price.toString());
  const [category, setCategory] = useState(service.category || "");
  const [description, setDescription] = useState(service.description || "");
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  // Form validation states
  const [nameError, setNameError] = useState("");
  const [priceError, setPriceError] = useState("");

  // Format price with thousand separators for display
  const formatPrice = (value) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    // Add thousand separators
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Parse price for saving (remove separators)
  const parsePrice = (formattedPrice) => {
    return formattedPrice.replace(/\./g, '');
  };
  
  const handlePriceChange = (value) => {
    const formattedValue = formatPrice(value);
    setPrice(formattedValue);
    
    // Clear error if valid
    if (parseInt(parsePrice(formattedValue)) > 0) {
      setPriceError("");
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError("Tên dịch vụ không được để trống");
      isValid = false;
    } else {
      setNameError("");
    }

    const parsedPrice = parsePrice(price);
    if (!parsedPrice || parseInt(parsedPrice) <= 0) {
      setPriceError("Giá phải lớn hơn 0");
      isValid = false;
    } else {
      setPriceError("");
    }

    return isValid;
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const serviceRef = doc(db, "services", service.id);
      await updateDoc(serviceRef, {
        name: name.trim(),
        price: parseInt(parsePrice(price)),
        category: category.trim(),
        description: description.trim(),
        updatedAt: new Date(),
      });
      
      // Show success dialog
      Alert.alert(
        "Cập nhật thành công",
        "Thông tin dịch vụ đã được cập nhật",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Lỗi", "Không thể cập nhật dịch vụ. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const confirmCancel = () => {
    // Check if form has been modified
    if (
      name !== service.name ||
      parsePrice(price) !== service.price.toString() ||
      category !== (service.category || "") ||
      description !== (service.description || "")
    ) {
      setShowConfirmDialog(true);
    } else {
      // No changes, just go back
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={['#FF6B6B', '#FF8E8E']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <IconButton
              icon="arrow-left"
              iconColor="#FFF"
              size={24}
              style={styles.backButton}
              onPress={confirmCancel}
            />
            <Text variant="headlineSmall" style={styles.headerTitle}>
              Chỉnh sửa dịch vụ
            </Text>
          </View>
        </LinearGradient>

        {/* Form Content */}
        <Surface style={styles.formContainer} elevation={4}>
          <Text variant="titleMedium" style={styles.formTitle}>
            Thông tin dịch vụ
          </Text>

          <TextInput
            label="Tên dịch vụ"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (text.trim()) setNameError("");
            }}
            style={styles.input}
            mode="outlined"
            outlineColor="#ddd"
            activeOutlineColor="#FF6B6B"
            error={!!nameError}
            left={<TextInput.Icon icon="tag" color="#FF6B6B" />}
          />
          {nameError ? <HelperText type="error">{nameError}</HelperText> : null}

          <TextInput
            label="Giá (VNĐ)"
            value={price}
            onChangeText={handlePriceChange}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
            outlineColor="#ddd"
            activeOutlineColor="#FF6B6B"
            error={!!priceError}
            left={<TextInput.Icon icon="cash" color="#FF6B6B" />}
          />
          {priceError ? <HelperText type="error">{priceError}</HelperText> : null}

          <TextInput
            label="Danh mục"
            value={category}
            onChangeText={setCategory}
            style={styles.input}
            mode="outlined"
            outlineColor="#ddd"
            activeOutlineColor="#FF6B6B"
            left={<TextInput.Icon icon="folder" color="#FF6B6B" />}
          />

          <TextInput
            label="Mô tả"
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.multilineInput]}
            multiline
            numberOfLines={5}
            mode="outlined"
            outlineColor="#ddd"
            activeOutlineColor="#FF6B6B"
            left={<TextInput.Icon icon="information" color="#FF6B6B" />}
          />

          <View style={styles.actionButtons}>
            <Button
              mode="outlined"
              onPress={confirmCancel}
              style={[styles.button, styles.cancelButton]}
              labelStyle={styles.cancelButtonText}
              textColor="#FF6B6B"
            >
              Hủy
            </Button>
            
            <Button
              mode="contained"
              onPress={handleUpdate}
              loading={loading}
              disabled={loading}
              style={[styles.button, styles.updateButton]}
              labelStyle={styles.updateButtonText}
              buttonColor="#FF6B6B"
            >
              Cập nhật
            </Button>
          </View>

          {/* Information text */}
          <Text style={styles.noteText}>
            * Thông tin cập nhật sẽ được lưu ngay lập tức
          </Text>
        </Surface>

        {/* Service ID display at bottom */}
        <View style={styles.idContainer}>
          <Text style={styles.idText}>
            ID: {service.id}
          </Text>
        </View>
      </ScrollView>

      {/* Confirmation Dialog */}
      <Portal>
        <Dialog visible={showConfirmDialog} onDismiss={() => setShowConfirmDialog(false)}>
          <Dialog.Title>Xác nhận hủy</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Bạn có chắc chắn muốn hủy? Những thay đổi sẽ không được lưu.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowConfirmDialog(false)} textColor="#FF6B6B">Tiếp tục chỉnh sửa</Button>
            <Button onPress={() => {
              setShowConfirmDialog(false);
              navigation.goBack();
            }}>Hủy thay đổi</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // Compensate for back button width
  },
  formContainer: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "white",
  },
  formTitle: {
    marginBottom: 20,
    color: "#FF6B6B",
    fontWeight: "bold",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "white",
  },
  multilineInput: {
    height: 120,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 8,
    paddingVertical: 6,
  },
  cancelButton: {
    borderColor: "#FF6B6B",
    borderWidth: 1.5,
  },
  cancelButtonText: {
    fontWeight: "600",
  },
  updateButton: {
    elevation: 2,
  },
  updateButtonText: {
    fontWeight: "600",
  },
  noteText: {
    fontSize: 12,
    color: "#888",
    marginTop: 20,
    textAlign: "center",
    fontStyle: "italic",
  },
  idContainer: {
    padding: 16,
    alignItems: "center",
  },
  idText: {
    fontSize: 12,
    color: "#999",
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});

export default EditService;