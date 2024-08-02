import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  ToastAndroid,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useDispatch, useSelector } from "react-redux";
import { Chatadd, Chatlist, Chatrecent, generateTextThunk } from "./Reducer/ChatReducer";
import { Appcontext } from "./Navigation/Appcontext";
import Markdown from "react-native-markdown-display";
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");
const Chat = () => {
  const { LoginData } = useSelector((state) => state.user);
  const { ChatStatus, ChatrecentData, GeneratedTextData, GeneratedTextStatus } =
    useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const { messages, setMessages, isNew, setIsnew, idchatrecent, fromHistory, isSend, setIssend } =
    useContext(Appcontext);
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef(null);
  const [isGen, setIsgen] = useState(false);
  const handSend = () => {
    if (newMessage !== "") {
      const fromuser = [
        ...messages,
        { id: messages.length + 1, name: LoginData.data.name, text: newMessage },
      ];
      setMessages(fromuser);
      setNewMessage("");
      //Call API
      dispatch(generateTextThunk(newMessage));
      setIssend(true);
      setIsgen(true);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current.scrollToEnd({ animated: true });
    }, 120);
    dispatch(Chatlist(LoginData.data.username));
    if (GeneratedTextStatus == "succeeded" && messages.length > 0) {
      savechat();
      console.log("thực hiện lưu chat");
    }
  }, [messages]);
  // save chat api
  const savechat = () => {
    const firstMessageText = messages.length > 0 ? messages[0].text : "";
    const body = {
      username: LoginData.data.username,
      text: messages,
      name: firstMessageText,
      id: isNew ? null : fromHistory ? idchatrecent : ChatrecentData.data._id,
    };
    dispatch(Chatadd(body));
    setIsnew(false);
  };
  //update chathientai
  useEffect(() => {
    if (ChatStatus == "succeeded") {
      dispatch(Chatrecent(LoginData.data.username));
      dispatch(Chatlist(LoginData.data.username));
    }
  }, [ChatStatus]);

  //kq gen text
  useEffect(() => {
    if (GeneratedTextStatus === "succeeded" && isSend) {
      const fromAI = [
        ...messages,
        { id: messages.length + 1, name: "RytonGPT", text: GeneratedTextData },
      ];
      setMessages(fromAI);
      setIssend(false);
      setIsgen(false);
      dispatch(Chatlist(LoginData.data.username));
    }
    console.log(GeneratedTextStatus);
  }, [GeneratedTextStatus, GeneratedTextData]);
  const chat = ({ item}) => {
    //copy texxt
    const handlecopy = async () => {
      await Clipboard.setStringAsync(item.text);
      ToastAndroid.show("Đã sao chép vào bộ nhớ tạm!!", ToastAndroid.SHORT);
    };

    return (
      <View style={styles.message}>
        <View style={styles.headerchat}>
          <Text style={styles.senderName}>{item.name}</Text>
          <TouchableOpacity style={styles.btncopy} onPress={() => handlecopy()}>
            <Image style={styles.imgcopy} source={require("../assets/img/clipboard.png")} />
          </TouchableOpacity>
        </View>
        <Markdown style={styles.messageText}>{item.text}</Markdown>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.chatContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={chat}
        />
        {/* Chat*/}
      </View>
      <View style={styles.boxtext}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={newMessage}
            onChangeText={(data) => setNewMessage(data)}
            placeholder="Nhập tin nhắn của bạn ở đây"
            multiline={true}
          />
          <TouchableOpacity
            onPress={() => {
              isGen ? null : handSend();
              setIssend(true);
            }}
          >
            <Image
              source={
                isGen ? require("../assets/img/loadinggen.gif") : require("../assets/img/send.png")
              }
              style={styles.sendIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  imgcopy: {
    width: width*0.1,
    height: width*0.05,
    resizeMode: "contain",
  },
  btncopy: {
    paddingLeft: "4%",
    paddingRight: "4%",
  },
  headerchat: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  boxtext: {
    padding: "3%",
    paddingBottom: height * 0.03,
  },
  imgback: {
    aspectRatio: 1,
    flex: 1,
    resizeMode: "contain",
  },
  header: {
    marginTop: height * 0.04,
    marginLeft: "5%",
    marginRight: "5%",
    padding: "2%",
    flexShrink: 1,
    height: height * 0.08,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  chatContainer: {
    flex: 1,
  },
  message: {
    paddingTop: height * 0.01,
    paddingBottom: height * 0.01,
    paddingLeft: width * 0.1,
    paddingRight: width * 0.1,
    marginVertical: 5,
    backgroundColor: "#F7F7F8",
  },
  senderName: {
    width:width*0.68,
    fontWeight: "bold",
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#A3A3A8",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 7,
    height: height * 0.08,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
  },
  sendIcon: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
});

export default Chat;
