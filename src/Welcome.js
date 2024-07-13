import { View, Text, StyleSheet, Image } from "react-native";
import React, { useEffect } from "react";
import { SvgFromUri, SvgUri } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import { Connect } from "./Reducer/UserReducer";

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
      <Image style={styles.image} source={require("../assets/img/logo.png")} />
    </View>
  );
};

export default Welcome;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#3369ff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "69.87%",
    height: "32.28%",
    resizeMode: "contain",
  },
});
