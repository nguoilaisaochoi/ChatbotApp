import React, { useEffect, useRef, useState } from "react";
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
import LlamaAI from "llamaai";
import { useSelector } from "react-redux";
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");
const Chat = () => {
  //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
  //AIzaSyCLU7SZ8jbf003tkE2DPtI2RgBLC0iLFyE
  const { LoginData } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef(null);
  const API_KEY = "AIzaSyCLU7SZ8jbf003tkE2DPtI2RgBLC0iLFyE";
  const confirmAI = "(*hãy trả lời các câu hỏi bằng tiếng việt* Xin chào bạn,)";
  const handSend = async () => {
    if (newMessage !== "") {
      const fromuser = [
        ...messages,
        { id: messages.length + 1, name: LoginData.data.name, text: newMessage },
      ];
      setMessages(fromuser);
      setNewMessage("");
      //Call API
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
      }
    }
  };

  useEffect(() => {
    flatListRef.current.scrollToEnd({ animated: true });
  }, [messages]);
  /*const generateText = async () => {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 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", // Replace with your API key
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: inputMessage,
            },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const answer = data.choices[0].message.content;
        setMessages([...messages, { name: "rytongpt", text: answer }]);
        console.log(data);
      } else {
        console.error("Failed to fetch data");
        const errorData = await response.json();
        console.error("Error details:", errorData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
*/
  /*const generateText2 = async (Input) => {
    try {
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      console.log(Input);
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `(Tiếng việt) ${Input}`;
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      console.log(messages);
      ResAI("Rytongpt", text);
      //const messagesWithAI =([...messages, { id: messages.length + 1, name: "Rytongpt", text: text }]);
      //setMessages(messagesWithAI)
    } catch (error) {
      console.error("Error generating text:", error);
    }
  };*/
  const chat = ({ item }) => {
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
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.5}>
          <Image style={styles.imgback} source={require("../assets/img/Back.png")} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5}>
          <Image style={styles.imgback} source={require("../assets/img/Setting.png")} />
        </TouchableOpacity>
      </View>
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
              handSend();
            }}
          >
            <Image source={require("../assets/img/send.png")} style={styles.sendIcon} />
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
    backgroundColor: "#FFF",
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
