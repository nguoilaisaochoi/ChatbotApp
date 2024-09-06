import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
} from "react-native";
import { Image } from "expo-image";
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
import moment from "moment";
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
  //dispatch danhsachchat
  useEffect(() => {
    dispatch(Chatlist(LoginData.data._id));
  }, []);
  //lay ngay hien tai
  const currentDate = new Date();
  const formattedDateTime = moment(currentDate).format("DD/MM/YYYY HH:mm:ss");
  //gui chat
  const handSend = () => {
    if (newMessage !== "" && image) {
      setIsgen(true);
      dispatch(Uploadimg(image));
    } else if (newMessage !== "") {
      const fromuser = [
        ...messages,
        {
          id: messages.length + 1,
          role: "user",
          content: newMessage,
          created: formattedDateTime,
        },
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
  //chon anh tu thiet bi
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
  //chup hinh tu thiet bi
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
  //dua anh da dua len cloudinary vao messages
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
          created: formattedDateTime,
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

  //lay idchathientai sau khi thuc hien doan chat moi
  useEffect(() => {
    if (ChatStatus == "succeeded") {
      dispatch(Chatrecent(LoginData.data._id));
      dispatch(Chatlist(LoginData.data._id));
    }
  }, [ChatStatus]);
  //thuc hien luu chat vao messages
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current.scrollToEnd({ animated: true });
    }, 120);
    if (GeneratedTextStatus == "succeeded" && messages.length > 0) {
      savechat();
      console.log("thực hiện lưu chat");
    }
  }, [messages]);
  // save chat API nodejs
  const savechat = () => {
    const firstMessageText = messages.length > 0 ? messages[0].content : "";
    const body = {
      iduser: LoginData.data._id,
      text: messages,
      name: firstMessageText,
      id: isNew ? null : fromHistory ? idchatrecent : ChatrecentData.data._id,
      img: UploadimgData ? null : UploadimgData,
    };
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
        created: formattedDateTime,
      });
      setMessages([...messages]);
      setIssend(false);
      setIsgen(false);
    }
    console.log(GeneratedTextStatus);
  }, [GeneratedTextStatus, GeneratedTextData]);

  //copy text tu flatlist item
  const handlecopy = async (content) => {
    await Clipboard.setStringAsync(content);
    ToastAndroid.show("Đã sao chép vào bộ nhớ tạm!!", ToastAndroid.SHORT);
  };
  //flatlistitem
  const chat = ({ item }) => {
    return (
      <View style={styles.message}>
        <View style={styles.headerchat}>
          <Text style={styles.senderName}>
            {item.role == "assistant" ? "RytonGPT" : LoginData.data.name}
          </Text>
          <TouchableOpacity
            style={styles.btncopy}
            onPress={() => handlecopy(item.content)}
          >
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
        <Markdown style={styles}>{item.content}</Markdown>
        {item.created ? (
          <Text style={styles.txtcreated}>{item.created}</Text>
        ) : null}
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
          initialNumToRender={10}
        />
        {/* Chat*/}
      </View>
      {/* img input*/}
      <View style={styles.boxtext}>
        <View
          style={{
            flexDirection: "column",
            paddingRight: "1%",
          }}
        >
          <TouchableOpacity
            style={{
              alignItems: "center",
              opacity: isGen ? 0.5 : 1,
            }}
            onPress={() => (isGen ? null : setaddImg(!addimg))}
          >
            <Image
              style={styles.imgimg}
              source={require("../assets/img/addimg.png")}
            />
            <Text style={{ fontSize: width * 0.03, letterSpacing: 1 }}>
              Chọn ảnh
            </Text>
          </TouchableOpacity>
        </View>
        {/* select input img*/}
        {addimg && (
          <View style={styles.selimginput}>
            <TouchableOpacity onPress={() => pickImage()}>
              <Image
                style={styles.imgimg}
                source={require("../assets/img/image.png")}
              />
              <Text style={{ fontSize: width * 0.03,letterSpacing: 1  }}>Thư viện</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => pickcamImage()}>
              <Image
                style={styles.imgimg}
                source={require("../assets/img/camera.png")}
              />
              <Text style={{ fontSize: width * 0.03,letterSpacing: 1  }}>Chụp ảnh</Text>
            </TouchableOpacity>
          </View>
        )}
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
                  <Text style={styles.textcanceled}>Hủy</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={styles.input}>
            <TextInput
              style={styles.textInput}
              value={newMessage}
              onChangeText={(data) => setNewMessage(data)}
              placeholder="Tin nhắn"
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
  selimginput: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginRight:"2%"
  },
  txtcreated: {
    fontSize: width * 0.03,
    opacity: 0.5,
    letterSpacing: 1,
  },
  imginput: {
    width: width * 0.3,
    height: height * 0.1,
    marginTop: "5%",
    marginBottom: "3%",
  },
  imgimg: {
    margin: "2%",
    width: width * 0.1,
    height: width * 0.1,
    alignSelf: "center",
  },
  imgcopy: {
    width: width * 0.1,
    height: width * 0.045,
    contentFit: "contain",
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
    paddingLeft: "1%",
    paddingBottom: height * 0.03,
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  imgback: {
    aspectRatio: 1,
    flex: 1,
    contentFit: "contain",
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
    backgroundColor: "#fafafa",
  },
  senderName: {
    width: width * 0.68,
    fontWeight: "bold",
    letterSpacing:1,
    fontSize:width*0.035
  },
  inputContainer: {
    flexGrow: 1,
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#A3A3A8",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 7,
    minHeight: height * 0.08,
    justifyContent: "center",
  },
  imginput2: {
    width: width * 0.3,
    height: height * 0.1,
    alignContent: "flex-start",
  },
  input: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  canceled: {
    width: width * 0.3,
    marginBottom: "2%",
  },
  textcanceled: {
    width: "100%",
    fontWeight: "bold",
    backgroundColor: "black",
    color: "white",
    textAlign: "center",
    borderRadius: 5,
    fontSize: width * 0.04,
  },
  textInput: {
    flex: 1,
    fontSize: width * 0.04,
    minHeight: height * 0.04,
    maxHeight: height * 0.08,
    letterSpacing: 1.5,
  },
  sendIcon: {
    width: 25,
    height: 25,
    marginLeft: 10,
    marginBottom: "10%",
  },
  //text markdown npm
  text: {
    letterSpacing: 1,
  },
  strong: {
    letterSpacing: 1,
    fontWeight: "bold",
  },
});

export default Chat;
