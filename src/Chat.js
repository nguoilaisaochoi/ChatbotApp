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
import {
  Chatadd,
  Chatlist,
  Chatrecent,
  generateTextThunk,
  Uploadimg,
} from "./Reducer/ChatReducer";
import { Appcontext } from "./Navigation/Appcontext";
import Markdown from "react-native-markdown-display";
import * as ImagePicker from "expo-image-picker";
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");

const Chat = () => {
  const { LoginData } = useSelector((state) => state.user);
  const {
    ChatStatus,
    ChatrecentData,
    GeneratedTextData,
    GeneratedTextStatus,
    UploadimgStatus,
    UploadimgData,
  } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const {
    messages,
    setMessages,
    isNew,
    setIsnew,
    idchatrecent,
    fromHistory,
    isSend,
    setIssend,
  } = useContext(Appcontext);
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef(null);
  const [isGen, setIsgen] = useState(false);
  const [image, setImage] = useState(null);
  const [addimg, setaddImg] = useState(false);
  //gui chat
  const handSend = () => {
    if (newMessage !== "" && image) {
      setIsgen(true);
      dispatch(Uploadimg(image));
    } else if (newMessage !== "") {
      const fromuser = [
        ...messages,
        { id: messages.length + 1, role: "user", content: newMessage },
      ];
      setMessages(fromuser);
      const body = {
        newMessage: newMessage,
        messages: messages,
      };
      //Call API
      dispatch(generateTextThunk(body));
      setNewMessage("");
      setIssend(true);
      setIsgen(true);
    }
  };
  //anh
  const pickImage = async () => {
    setaddImg(false);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
      console.log(result.assets[0]);
    }
  };
  const pickcamImage = async () => {
    setaddImg(false);
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
      console.log(result.assets[0]);
    }
  };

  //state linkimg den api
  useEffect(() => {
    if (UploadimgStatus == "succeeded" && isSend) {
      console.log("UploadimgData" + UploadimgData);
      const fromuser = [
        ...messages,
        {
          id: messages.length + 1,
          role: "user",
          content: newMessage,
          img: UploadimgData,
        },
      ];
      setMessages(fromuser);
      setNewMessage("");
      const body = {
        messages: messages,
        newMessage: newMessage,
        url: UploadimgData,
      };
      dispatch(generateTextThunk(body));
      setImage(null);
    }
  }, [UploadimgStatus]);

  //update chathientai
  useEffect(() => {
    if (ChatStatus == "succeeded") {
      dispatch(Chatrecent(LoginData.data.username));
      dispatch(Chatlist(LoginData.data.username));
    }
  }, [ChatStatus]);
  //
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
    const firstMessageText = messages.length > 0 ? messages[0].content : "";
    const body = {
      username: LoginData.data.username,
      text: messages,
      name: firstMessageText,
      id: isNew ? null : fromHistory ? idchatrecent : ChatrecentData.data._id,
      img: UploadimgData ? null : UploadimgData,
    };
    console.log(UploadimgData);
    dispatch(Chatadd(body));
    setIsnew(false);
  };

  //kq gen text
  useEffect(() => {
    if (GeneratedTextStatus === "succeeded" && isSend) {
      messages.push({
        id: messages.length + 1,
        role: "assistant",
        content: GeneratedTextData,
      });
      setMessages([...messages]);
      setIssend(false);
      setIsgen(false);
      dispatch(Chatlist(LoginData.data.username));
    }
    console.log(GeneratedTextStatus);
  }, [GeneratedTextStatus, GeneratedTextData]);

  //flatlistitem
  const chat = ({ item }) => {
    //copy texxt
    const handlecopy = async () => {
      await Clipboard.setStringAsync(item.content);
      ToastAndroid.show("Đã sao chép vào bộ nhớ tạm!!", ToastAndroid.SHORT);
    };

    return (
      <View style={styles.message}>
        <View style={styles.headerchat}>
          <Text style={styles.senderName}>{LoginData.data.username}</Text>
          <TouchableOpacity style={styles.btncopy} onPress={() => handlecopy()}>
            <Image
              style={styles.imgcopy}
              source={require("../assets/img/clipboard.png")}
            />
          </TouchableOpacity>
        </View>
        {item.img ? (
          <Image
            style={styles.imginput}
            source={{
              uri: `${item.img}`,
            }}
          />
        ) : null}
        <Markdown style={styles.messageText}>{item.content}</Markdown>
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
      {/* img input*/}
      {addimg && (
        <View
          style={{
            paddingLeft: "3%",
          }}
        >
          <TouchableOpacity onPress={() => pickImage()}>
            <Image
              style={styles.imgimg}
              source={require("../assets/img/image.png")}
            />
            <Text>Thư viện</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => pickcamImage()}>
            <Image
              style={styles.imgimg}
              source={require("../assets/img/camera.png")}
            />
            <Text>Chụp ảnh</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.boxtext}>
        <View style={{ flexDirection: "column" }}>
          <TouchableOpacity onPress={() => setaddImg(!addimg)}>
            <Image
              style={styles.imgimg}
              source={require("../assets/img/addimg.png")}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          {image && (
            <View>
              <Image source={{ uri: image.uri }} style={styles.imginput} />
              {!isGen && (
                <TouchableOpacity
                  style={styles.canceled}
                  onPress={() => {
                    setImage(null);
                  }}
                >
                  <Text style={styles.textcanceled}>X</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={styles.input}>
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
                  isGen
                    ? require("../assets/img/loadinggen.gif")
                    : require("../assets/img/send.png")
                }
                style={styles.sendIcon}
              />
            </TouchableOpacity>
          </View>
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
  imginput: {
    width: width * 0.3,
    height: height * 0.1,
    marginTop: "5%",
    marginBottom: "2%",
  },
  imgimg: {
    margin: "2%",
    width: width * 0.1,
    height: width * 0.1,
  },
  imgcopy: {
    width: width * 0.1,
    height: width * 0.05,
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
    flexDirection: "row",
    padding: "3%",
    paddingBottom: height * 0.03,
    justifyContent: "space-around",
    alignItems: "center",
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
    width: width * 0.68,
    fontWeight: "bold",
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    width: "85%",
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#A3A3A8",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 7,
    minHeight: height * 0.08,
  },
  imginput: {
    width: width * 0.3,
    height: height * 0.1,
    alignContent: "flex-start",
  },
  input: {
    flexDirection: "row",
  },
  canceled: {
    position: "absolute",
    right: width * 0.43,
    top: 0,
    zIndex: 1,
  },
  textcanceled: {
    fontWeight: "bold",
    backgroundColor: "black",
    paddingBottom: "1%",
    paddingTop: "1%",
    paddingLeft: "3%",
    paddingRight: "3%",
    borderRadius: 55,
    color: "white",
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
