import { View, Text, StyleSheet, Appearance } from "react-native";
import React, { useContext, useEffect, useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { getTheme } from "../Style/Theme";
import ConfigTheme from "../ConfigTheme";

const Main = () => {
  const { LoginData } = useSelector((state) => state.user);
  const selectedTheme = useSelector((state) => state.user.Theme);
  const { setIslogin } = useContext(Appcontext);
  const [isDarkMode, setisDarkMode] = useState(true);
  const Drawer = createDrawerNavigator();
  const { setMessages, setIsnew, setIdchatrecent, setIssend, setFromhistory } =
    useContext(Appcontext);
  const navigation = useNavigation();
  const theme = getTheme(isDarkMode);
  //check che do he thong
  useEffect(() => {
    let subscription;
    if (selectedTheme == "system") {
      console.log("đã bật sub");
      const colorScheme = Appearance.getColorScheme();
      console.log(`1.Chế độ hiện tại: ${colorScheme}`);
      setisDarkMode(colorScheme == "light" ? false : true);
      subscription = Appearance.addChangeListener(({ colorScheme }) => {
        console.log(`2.Đã đổi chế độ: ${colorScheme}`);
        setisDarkMode(colorScheme == "light" ? false : true);
      });
    } else {
      setisDarkMode(selectedTheme == "light" ? false : true);
    }
    return () => {
      if (subscription) {
        console.log("đã huỷ sub");
        subscription.remove();
      }
    };
  }, [selectedTheme]);
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "358681957288-sc99n3hcngc0npi2agds95t2t0p7ru6g.apps.googleusercontent.com",
    });
  }, []);
  const signOut = async () => {
    AsyncStorage.removeItem("isLogged");
    setIslogin(false);
    try {
      await GoogleSignin.signOut();
      console.log({ user: null });
    } catch (error) {
      console.error(error);
    }
  };
  const CustomDrawerContent = (props) => {
    const styles = creatStyles(isDarkMode);
    return (
      <DrawerContentScrollView>
        <View>
          <Text style={styles.txthead}>Chào mừng! {LoginData.data.name}</Text>
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
          labelStyle={styles.label}
        />
        <DrawerItemList {...props} />
        <DrawerItem
          label="Đăng xuất"
          onPress={() => {
            signOut();
          }}
          labelStyle={styles.label}
        />
      </DrawerContentScrollView>
    );
  };
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveBackgroundColor: theme.drawerActiveBackgroundColor, //mau nen khi active drawer
        drawerActiveTintColor: theme.drawerActiveTintColor, //mau chu khi dc active drawer
        drawerInactiveTintColor: theme.textColor, //mau chu khi khong active drawer
        headerTitleAlign: "center",
        drawerLabelStyle: {
          letterSpacing: 1.5,
          fontSize: 16,
        },
        drawerStyle: { backgroundColor: theme.backgroundColor }, //mau nen drawer
        headerTintColor: theme.textColor, //mau chu header
        headerStyle: { backgroundColor: theme.backgroundColor }, //style header
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Chat" component={Chat} />
      <Drawer.Screen name="Lịch sử chat" component={Historychat} />
      <Drawer.Screen name="Giao diện" component={ConfigTheme} />
    </Drawer.Navigator>
  );
};

export default Main;

const creatStyles = (isDarkMode) => {
  const theme = getTheme(isDarkMode);
  return StyleSheet.create({
    itemContainer: {
      padding: 16,
      borderRadius: 10,
      marginVertical: 4,
    },
    txthead: {
      fontSize: 19,
      fontWeight: "500",
      marginLeft: "5%",
      marginTop: "5%",
      letterSpacing: 1.5,
      color: theme.textColor,
    },
    activeItem: {
      backgroundColor: theme.drawerActiveBackgroundColor, // Màu nền khi active
    },
    label: {
      letterSpacing: 1.5,
      fontSize: 16,
      color: theme.textColor, // Màu chữ
    },
  });
};
