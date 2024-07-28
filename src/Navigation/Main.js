import { View, Text, Image, StyleSheet } from "react-native";
import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import Chat from "../Chat";
import Historychat from "../Historychat";
import { useSelector } from "react-redux";
import { Appcontext } from "./Appcontext";
import { useNavigation } from "@react-navigation/native";

const Main = () => {
  const { LoginData } = useSelector((state) => state.user);
  const { setIslogin } = useContext(Appcontext);
  const Drawer = createDrawerNavigator();
  const { setMessages, setIsnew, setIdchatrecent, setIssend, setFromhistory } =
    useContext(Appcontext);
  const navigation = useNavigation();
  const CustomDrawerContent = (props) => {
    return (
      <DrawerContentScrollView {...props}>
        <View>
          <Text style={{ fontSize: 18, fontWeight: "500", marginLeft: "5%", marginTop: "5%" }}>
            Chào mừng! {LoginData.data.name}
          </Text>
        </View>
        <DrawerItem
          label="Trò chuyện mới"
          onPress={() => {
            setIsnew(true);
            setMessages([]);
            setIdchatrecent(null);
            setIssend(false);
            setFromhistory(false);
            navigation.navigate("Chat");
          }}
        />
        <DrawerItemList {...props} />
        <DrawerItem
          label="Đăng xuất"
          onPress={() => {
            setIslogin(false);
          }}
        />
      </DrawerContentScrollView>
    );
  };
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveBackgroundColor: "#323142",
        drawerActiveTintColor: "#fff",
        headerTitleAlign: "center",
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Chat" component={Chat}></Drawer.Screen>
      <Drawer.Screen name="Lịch sử chat" component={Historychat}></Drawer.Screen>
    </Drawer.Navigator>
  );
};

export default Main;
