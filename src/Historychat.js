import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
  Appearance,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Chatdelete, Chatlist } from "./Reducer/ChatReducer";
import { Appcontext } from "./Navigation/Appcontext";
import { useNavigation } from "@react-navigation/native";
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");
import moment from "moment";
import { getTheme } from "./Style/Theme";
import { Translate } from "./Translate";

const Historychat = () => {
  const { LoginData } = useSelector((state) => state.user);
  const { ChatlistData, ChatdeleteStatus } = useSelector((state) => state.chat);
  const { setMessages } = useContext(Appcontext);
  const { setIsnew, setIdchatrecent, setFromhistory, setIssend } =
    useContext(Appcontext);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isDarkMode, setisDarkMode] = useState(true);
  const styles = createStyles(isDarkMode);
  const selectedTheme = useSelector((state) => state.user.Theme);
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

  const setchat = (item) => {
    setMessages(item.text);
    setIsnew(false);
    setIdchatrecent(item._id);
    setFromhistory(true);
    navigation.navigate("Chat");
  };

  const limitTextLength = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const handledelete = (item) => {
    Alert.alert(Translate('confirm'), Translate("wantdeletethischat"), [
      { text: Translate("Cancel"), styles: "cancel" },
      {
        text: "Ok",
        onPress: () => {
          setIsnew(true);
          setMessages([]);
          setIdchatrecent(null);
          setIssend(false);
          setFromhistory(false);
          dispatch(Chatdelete(item));
        },
      },
    ]);
  };

  useEffect(() => {
    console.log(ChatdeleteStatus);
    if (ChatdeleteStatus == "succeeded") {
      dispatch(Chatlist(LoginData.data._id));
    }
  }, [ChatdeleteStatus]);

  const chathis = ({ item }) => {
    const formattedDate = moment(item.createdAt).format("DD/MM/YYYY HH:mm");
    return (
      <TouchableOpacity
        onPress={() => {
          setchat(item);
        }}
        style={styles.item}
        activeOpacity={0.8}
      >
        <View style={styles.box1}>
          <Text style={styles.txtedit1}>{limitTextLength(item.name, 30)}</Text>
          <Text style={styles.txtedit2}>{formattedDate}</Text>
        </View>
        <TouchableOpacity
          style={styles.box2}
          onPress={() => handledelete(item._id)}
        >
          <Image
            style={styles.imgedit}
            source={require("../assets/img/trash.png")}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={ChatlistData.data}
        keyExtractor={(item) => item._id}
        renderItem={chathis}
        contentContainerStyle={{ alignItems: "center" }}
      />
    </View>
  );
};

export default Historychat;

const createStyles = (isDarkMode) => {
  const theme = getTheme(isDarkMode);
  return StyleSheet.create({
    container: {
      backgroundColor: theme.backgroundColor,
      flex: 1,
    },
    item: {
      width: "90%",
      backgroundColor: theme.itemchatColor,
      margin: "3%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: 12,
      elevation: 5,
    },
    box1: {
      padding: "2%",
    },
    box2: {
      padding: "2%",
    },
    imgedit: {
      resizeMode: "contain",
      width: width * 0.05,
      tintColor: theme.textColor,
    },
    txtedit1: {
      fontSize: height * 0.024,
      fontWeight: "500",
      letterSpacing: 1,
      height: height * 0.03,
      color: theme.textColor,
    },

    txtedit2: {
      marginTop: "4%",
      fontSize: height * 0.015,
      opacity: 0.7,
      letterSpacing: 1,
      color: theme.textColor,
    },
  });
};
