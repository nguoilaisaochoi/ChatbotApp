import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "../Welcome";
import Login from "../Login";
import Register from "../Register";


const Stacklogin = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" component={Welcome} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="register" component={Register} />
    </Stack.Navigator>
  );
};

export default Stacklogin;
