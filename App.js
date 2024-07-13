import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Appprovider } from "./src/Navigation/Appcontext";
import AppNavigation from "./src/Navigation/AppNavigation";
import React from "react";
import { store } from "./src/Store/Store";
import { Provider } from "react-redux";

export default function App() {

  return (
    <Provider store={store}>
      <Appprovider>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar />
          <View style={{ flex: 1 }}>
            <AppNavigation></AppNavigation>
          </View>
        </SafeAreaView>
      </Appprovider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
