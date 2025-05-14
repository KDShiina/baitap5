import { View, StyleSheet, FlatList, StatusBar, ActivityIndicator } from "react-native";
import { IconButton, Text, Card, Avatar, Surface, Chip } from "react-native-paper";
import { auth, db } from "../../firebase"; // Import firebase config
import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";

const Services = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "services"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setServices(data);
      setLoading(false);
    });

    return () => unsubscribe(); // hủy lắng nghe khi component unmount
  }, []);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const renderServiceCard = ({ item }) => (
    <Surface style={styles.cardSurface} elevation={2}>
      <Card 
        style={styles.card} 
        onPress={() => navigation.navigate("ServiceDetail", { service: item })}
        mode="elevated"
      >
        {item.imageUrl ? (
          <Card.Cover source={{ uri: item.imageUrl }} style={styles.cardImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Avatar.Icon size={60} icon="spa" color="#FFF" style={{ backgroundColor: '#FF6B6B' }} />
          </View>
        )}
        <Card.Content style={styles.cardContent}>
          <Text style={styles.serviceCategory} variant="labelSmall">
            {item.category || 'Dịch vụ'}
          </Text>
          <Text style={styles.name} variant="titleMedium">{item.name}</Text>
          <View style={styles.cardFooter}>
            <Chip 
              style={styles.priceChip} 
              textStyle={styles.priceText}
              icon="cash"
            >
              {formatPrice(item.price)} VNĐ
            </Chip>
            <IconButton
              icon="chevron-right"
              iconColor="#555"
              size={20}
              style={styles.arrowIcon}
            />
          </View>
        </Card.Content>
      </Card>
    </Surface>
  );

  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Avatar.Icon size={80} icon="spa" style={{ backgroundColor: '#e0e0e0' }} />
      <Text style={styles.emptyText}>Chưa có dịch vụ nào</Text>
      <Text style={styles.emptySubtext}>Nhấn nút + để thêm dịch vụ mới</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B6B" />
      <LinearGradient
        colors={['#FF6B6B', '#FF8E8E']}
        style={styles.header}
      >
        <Text style={styles.title}>Danh sách dịch vụ</Text>
        <IconButton
          icon="plus-circle"
          iconColor="#FFF"
          size={32}
          onPress={() => navigation.navigate("AddNewService")}
          style={styles.addButton}
        />
      </LinearGradient>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Đang tải dịch vụ...</Text>
        </View>
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={renderServiceCard}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyListComponent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  list: {
    padding: 16,
    paddingBottom: 24,
  },
  cardSurface: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
  },
  cardImage: {
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  imagePlaceholder: {
    height: 100,
    backgroundColor: '#ffdcdc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    paddingVertical: 12,
  },
  serviceCategory: {
    color: '#FF6B6B',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceChip: {
    backgroundColor: '#f0f0f0',
  },
  priceText: {
    fontWeight: '700',
    color: '#FF6B6B',
  },
  arrowIcon: {
    margin: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#888',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
});

export default Services;