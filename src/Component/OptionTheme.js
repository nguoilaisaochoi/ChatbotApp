import { Text, TouchableOpacity, StyleSheet, Appearance } from "react-native";
import React, { useEffect, useState } from "react";
import { getTheme } from "../Style/Theme";
import { useSelector } from "react-redux";

const OptionTheme = ({ onPress, text, selectedTheme }) => {
  const selTheme = useSelector((state) => state.user.Theme);
  const [isDarkMode, setisDarkMode] = useState(false);
  const styles = createStyle(isDarkMode);
  //check che do he thong
  useEffect(() => {
    let subscription;
    if (selTheme == "system") {
      const colorScheme = Appearance.getColorScheme();
      setisDarkMode(colorScheme == "light" ? false : true);
      subscription = Appearance.addChangeListener(({ colorScheme }) => {
        setisDarkMode(selTheme == "light" ? false : true);
      });
    } else {
      setisDarkMode(selTheme == "light" ? false : true);
    }
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [selTheme]);
  return (
    <TouchableOpacity
      style={[styles.option, { borderWidth: selectedTheme ? 1 : 0 }]}
      onPress={onPress}
    >
      <Text style={styles.optionText}>{text}</Text>
    </TouchableOpacity>
  );
};

export default OptionTheme;

const createStyle = (isDarkMode) => {
  const theme = getTheme(isDarkMode);
  return StyleSheet.create({
    title: {
      fontSize: 24,
      marginBottom: 20,
    },
    option: {
      flexShrink: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: "5%",
      backgroundColor: theme.itemchatColor,
      flexDirection: "row",
      padding: "5%",
      borderRadius: 12,
      elevation: 5,
      borderColor: theme.borderColor,
    },
    optionText: {
      fontSize: 18,
      flex: 1,
      color: theme.textColor,
      textAlign: "center",
    },
    radio: {
      fontSize: 22,
      color: theme.textColor,
    },
  });
};
