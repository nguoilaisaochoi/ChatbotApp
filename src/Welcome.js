import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  BackHandler,
} from "react-native";
import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Connect, Log } from "./Reducer/UserReducer";
import packageJson from "../package.json";
import { Appcontext } from "./Navigation/Appcontext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Translate } from "./Translate";

const Welcome = (props) => {
  const dispatch = useDispatch();
  const { ConnectStatus, ConnectData } = useSelector((state) => state.user);
  const { navigation } = props;
  const { setIslogin } = useContext(Appcontext);

  useEffect(() => {
    dispatch(Connect());
  }, []);

  //check da dang nhap truoc do chua
  const getdata = async () => {
    const value = await AsyncStorage.getItem("isLogged");
    if (value === "true") {
      console.log("isLogged!!");
      setIslogin(true);
    } else {
      navigation.navigate("login");
    }
  };

  useEffect(() => {
    if (ConnectStatus == "succeeded") {
      if (packageJson.version == ConnectData.versionapp) {
        setTimeout(() => {
          getdata();
        }, 900);
      } else {
        Alert.alert(
          "Thông báo",
          "Đã có phiên bản mới hơn và các phiên bản cũ không còn hỗ trợ",
          [{ text: "Thoát", onPress: () => BackHandler.exitApp() }]
        );
      }
    }
    console.log("Done");
  }, [ConnectStatus]);

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("../assets/img/logo.png")} />
      <View style={styles.box}>
        <Text style={styles.txt1}>RytonGPT</Text>
        <Text style={styles.txt2}>
          {Translate("version")} {packageJson.version}{" "}
        </Text>
      </View>
    </View>
  );
};

export default Welcome;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "63.87%",
    height: "26.28%",
    resizeMode: "contain",
  },
  box: {
    position: "absolute",
    bottom: 0,
    marginBottom: "2%",
    alignItems: "center",
  },
  txt1: {
    fontSize: 23,
    fontWeight: "500",
    letterSpacing: 1.5,
  },
  txt2: {
    marginTop: "2%",
    fontSize: 12,
    letterSpacing: 1.5,
  },
});
