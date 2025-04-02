import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Appprovider } from "./src/Navigation/Appcontext";
import AppNavigation from "./src/Navigation/AppNavigation";
import React from "react";
import { persistor, store } from "./src/Store/Store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Appprovider>
          <StatusBar />
          <View style={{ flex: 1 }}>
            <AppNavigation></AppNavigation>
          </View>
        </Appprovider>
      </PersistGate>
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
