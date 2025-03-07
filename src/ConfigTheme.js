import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Appearance,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getTheme } from "./Style/Theme";
import OptionTheme from "./Component/OptionTheme";
import { useDispatch, useSelector } from "react-redux";
import { setThemme } from "./Reducer/UserReducer";

const ConfigTheme = () => {
  const dispath = useDispatch();
  const [isDarkMode, setisDarkMode] = useState(false);
  const styles = createStyle(isDarkMode);
  const selectedTheme = useSelector((state) => state.user.Theme);
  const setSelectedTheme = (data) => {
    dispath(setThemme(data));
  };
  //check che do he thong
  useEffect(() => {
    let subscription;
    if (selectedTheme == "system") {
      const colorScheme = Appearance.getColorScheme();
      setisDarkMode(colorScheme == "light" ? false : true);
      subscription = Appearance.addChangeListener(({ colorScheme }) => {
        setisDarkMode(colorScheme == "light" ? false : true);
      });
    } else {
      setisDarkMode(selectedTheme == "light" ? false : true);
    }
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [selectedTheme]);
  return (
    <View style={styles.container}>
      <OptionTheme
        onPress={() => setSelectedTheme("light")}
        text="Sáng"
        selectedTheme={selectedTheme == "light" ?? null}
      />
      <OptionTheme
        onPress={() => setSelectedTheme("dark")}
        text="Tối"
        selectedTheme={selectedTheme == "dark" ?? null}
      />
      <OptionTheme
        onPress={() => setSelectedTheme("system")}
        text="Theo thiết bị"
        theme={"system"}
        selectedTheme={selectedTheme == "system" ?? null}
      />
    </View>
  );
};

export default ConfigTheme;
const createStyle = (isDarkMode) => {
  const theme = getTheme(isDarkMode);
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
      padding: "4%",
      gap: 10,
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
    },
    optionText: {
      fontSize: 18,
      flex: 1,
      color: theme.textColor,
    },
    radio: {
      fontSize: 24,
      color: theme.textColor,
    },
  });
};
