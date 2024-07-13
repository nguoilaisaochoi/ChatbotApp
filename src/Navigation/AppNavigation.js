import { View, Text } from "react-native";
import React, { useContext } from "react";
import { Appcontext } from "./Appcontext";
import Main from "./Main";
import Stacklogin from "./Stacklogin";
import { NavigationContainer } from "@react-navigation/native";

const AppNavigation = () => {
  const { isLogin } = useContext(Appcontext);
  return <NavigationContainer>{isLogin ? <Main /> : <Stacklogin />}</NavigationContainer>;
};

export default AppNavigation;
