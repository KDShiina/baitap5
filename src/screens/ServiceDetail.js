import React from "react";
import { SafeAreaView, StyleSheet, View, ScrollView, Image } from "react-native";
import { Text, Surface, Divider, Button, Avatar, Chip, IconButton } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

const ServiceDetail = ({ route, navigation }) => {
  const { service } = route?.params || {};

  const formatDateTime = (timestamp) => {
    if (!timestamp?.seconds) return "Không xác định";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString("vi-VN");
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const InfoRow = ({ label, value, icon }) => (
    <View style={styles.row}>
      <View style={styles.labelContainer}>
        {icon && (
          <Avatar.Icon 
            size={32} 
            icon={icon} 
            color="#FF6B6B" 
            style={styles.labelIcon} 
          />
        )}
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      <Divider style={styles.divider} />
    </View>
  );

  // Return early with nice UI if no service
  if (!service) {
    return (
      <SafeAreaView style={styles.container}>
        <Surface style={styles.noDataSurface}>
          <Avatar.Icon size={80} icon="alert-circle-outline" color="#FFF" style={styles.noDataIcon} />
          <Text variant="titleMedium" style={styles.noDataText}>
            Không tìm thấy thông tin dịch vụ
          </Text>
          <Button 
            mode="contained" 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            buttonColor="#FF6B6B"
          >
            Quay lại
          </Button>
        </Surface>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with gradient background */}
        <LinearGradient
          colors={['#FF6B6B', '#FF8E8E']}
          style={styles.header}
        >
          
          {service.imageUrl ? (
            <Image source={{ uri: service.imageUrl }} style={styles.serviceImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Avatar.Icon size={80} icon="spa" color="#FFF" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />
            </View>
          )}
          
          <Text variant="headlineSmall" style={styles.serviceName}>
            {service.name}
          </Text>
          
          <Chip 
            style={styles.priceChip}
            textStyle={styles.priceText}
            icon="cash"
          >
            {formatPrice(service.price)} VNĐ
          </Chip>
        </LinearGradient>

        {/* Service details */}
        <Surface style={styles.surface}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Chi tiết dịch vụ
          </Text>
          
          {service.category && (
            <InfoRow 
              label="Danh mục" 
              value={service.category} 
              icon="tag"
            />
          )}
          
          <InfoRow 
            label="Mô tả" 
            value={service.description || "Không có mô tả"} 
            icon="information-outline"
          />
          
          <View style={styles.separator} />
          
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Thông tin khác
          </Text>
          
          <InfoRow 
            label="Người tạo" 
            value={service.createdBy?.email || "Không rõ"} 
            icon="account"
          />
          
          <InfoRow 
            label="Thời gian tạo" 
            value={formatDateTime(service.createdAt)} 
            icon="clock-outline"
          />
          
          {service.updatedAt && (
            <InfoRow 
              label="Cập nhật lần cuối" 
              value={formatDateTime(service.updatedAt)} 
              icon="update"
            />
          )}
        </Surface>
        
        {/* Action buttons */}
        <View style={styles.actionContainer}>
          <Button 
            mode="contained" 
            icon="square-edit-outline"
            buttonColor="#FF6B6B"
            style={styles.actionButton}
            onPress={() => navigation.navigate("EditService", { service })}
          >
            Chỉnh sửa
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  serviceImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 16,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 107, 107, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: 'white',
  },
  serviceName: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  priceChip: {
    backgroundColor: 'white',
  },
  priceText: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  surface: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: "white",
  },
  sectionTitle: {
    color: '#FF6B6B',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  row: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  labelIcon: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    marginRight: 8,
  },
  label: {
    fontWeight: "600",
    color: "#555",
    fontSize: 15,
  },
  value: {
    fontSize: 16,
    marginTop: 4,
    paddingLeft: 40,
    color: '#333',
  },
  divider: {
    marginTop: 12,
    backgroundColor: "#eeeeee",
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 16,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  outlinedButton: {
    borderColor: '#FF6B6B',
    borderWidth: 1.5,
  },
  noDataSurface: {
    margin: 24,
    padding: 30,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: "white",
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataIcon: {
    backgroundColor: '#FF6B6B',
    marginBottom: 16,
  },
  noDataText: {
    marginBottom: 24,
    textAlign: 'center',
    color: '#555',
  },
  backButton: {
    paddingHorizontal: 24,
    borderRadius: 24,
  }
});

export default ServiceDetail;