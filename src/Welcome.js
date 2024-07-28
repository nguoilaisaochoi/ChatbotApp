import { View, Text, StyleSheet, Image } from "react-native";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Connect } from "./Reducer/UserReducer";
import packageJson from "../package.json";
const Welcome = (props) => {
  const dispatch = useDispatch();
  const { ConnectStatus } = useSelector((state) => state.user);
  const { navigation } = props;

  useEffect(() => {
    dispatch(Connect());
  }, []);

  useEffect(() => {
    if (ConnectStatus == "succeeded") {
      setTimeout(() => {
        navigation.navigate("login");
      }, 1000);
    }
    console.log("Done");
  }, [ConnectStatus]);
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("../assets/img/Logo.png")} />
      <View style={styles.box}>
        <Text style={styles.txt1}>RytonGPT</Text>
        <Text style={styles.txt2}>Phiên bản {packageJson.version} </Text>
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
  },
  txt2: {
    marginTop: "2%",
    fontSize: 12,
  },
});
