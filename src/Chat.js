import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { Chatadd, Chatlist, Chatrecent, generateTextThunk } from "./Reducer/ChatReducer";
import { Appcontext } from "./Navigation/Appcontext";
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");
const Chat = () => {
  //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
  //AIzaSyCLU7SZ8jbf003tkE2DPtI2RgBLC0iLFyE
  const { LoginData } = useSelector((state) => state.user);
  const { ChatData, ChatStatus, ChatrecentData, GeneratedTextData, GeneratedTextStatus } =
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
      /*
      try {
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro-latest" });
        const prompt = `${confirmAI} ${newMessage}`;
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        const fromAI = [...fromuser, { id: fromuser.length + 1, name: "Rytongpt", text: text }];
        setMessages(fromAI);
      } catch (error) {
        console.error("Error generating text:", error);
      }*/
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
    console.log(body);
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
  const chat = ({ item }) => {
    //lam chu in dam
    const renderBoldText = (text) => {
      const parts = text.split("**");
      console.log(parts);
      return parts.map((part, index) => {
        if (index % 2 === 0) {
          return <Text key={index}>{part}</Text>;
        } else {
          return (
            <Text key={index} style={{ fontWeight: "bold" }}>
              {part}
            </Text>
          );
        }
      });
    };

    return (
      <View style={styles.message}>
        <Text style={styles.senderName}>{item.name}</Text>
        <Text style={styles.messageText}>{item.text}</Text>
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
            placeholder="Type your message here"
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
    backgroundColor: "#fff",
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
    paddingTop: height * 0.02,
    paddingBottom: height * 0.02,
    paddingLeft: width * 0.1,
    paddingRight: width * 0.1,
    marginVertical: 5,
    backgroundColor: "#F7F7F8",
  },
  senderName: {
    fontWeight: "bold",
    marginBottom: 5,
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
