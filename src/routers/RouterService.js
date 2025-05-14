import { createStackNavigator } from "@react-navigation/stack";
import Services from "../screens/Services";
import AddNewService from "../screens/AddNewService";
import ServiceDetail from "../screens/ServiceDetail";
import EditService from "../screens/EditService";
import { useMyContextController } from "../store";

const Stack = createStackNavigator();

const RouterService = () => {
  const [controller] = useMyContextController();
  const { userLogin } = controller;

  return (
    <Stack.Navigator
      initialRouteName="Services"
      screenOptions={{
        title: userLogin ? userLogin.name : 'Services',
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#FF6B6B",
          height: 60, // Làm header nhỏ lại
        },
      }}
    >
      <Stack.Screen
        name="Services"
        component={Services}
        options={{ headerLeft: () => null }}
      />
      <Stack.Screen name="AddNewService" component={AddNewService} />
      <Stack.Screen name="ServiceDetail" component={ServiceDetail} />
      <Stack.Screen name="EditService" component={EditService} />

    </Stack.Navigator>
  );
};

export default RouterService;
