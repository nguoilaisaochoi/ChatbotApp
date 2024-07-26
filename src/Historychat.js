import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Chatdelete, Chatlist } from "./Reducer/ChatReducer";
import { Appcontext } from "./Navigation/Appcontext";
import { useNavigation } from "@react-navigation/native";
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");
import moment from "moment";

const Historychat = () => {
  const { LoginData } = useSelector((state) => state.user);
  const { ChatlistData, ChatdeleteStatus } = useSelector((state) => state.chat);
  const { setMessages } = useContext(Appcontext);
  const { setIsnew, setIdchatrecent, setFromhistory } = useContext(Appcontext);
  const dispatch = useDispatch();
  const navigation = useNavigation();

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
    Alert.alert("Confirm", "Are you sure? ", [
      { text: "Hủy", styles: "cancel" },
      {
        text: "Ok",
        onPress: () => {
          console.log(item);
          dispatch(Chatdelete(item));
        },
      },
    ]);
  };

  useEffect(() => {
    console.log(ChatdeleteStatus);
    if (ChatdeleteStatus == "succeeded") {
      dispatch(Chatlist(LoginData.data.username));
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
      >
        <View style={styles.box1}>
          <Text style={styles.txtedit1}>{limitTextLength(item.name, 30)}</Text>
          <Text style={styles.txtedit2}>{formattedDate}</Text>
        </View>
        <TouchableOpacity style={styles.box2} onPress={() => handledelete(item._id)}>
          <Image style={styles.imgedit} source={require("../assets/img/trash.png")} />
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  item: {
    width: "90%",
    backgroundColor: "#fff",
    margin: "3%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    elevation: 5,
  },
  box1: {
    padding: "3%",
  },
  box2: {
    padding: "3%",
  },
  imgedit: {
    resizeMode: "contain",
    width: width * 0.07,
  },
  txtedit1: {
    fontSize: height * 0.02 + 2,
    fontWeight: "500",
  },

  txtedit2: {
    marginTop: "4%",
    fontSize: height * 0.02 - 2,
    color: "#a0a0a5",
  },
});
