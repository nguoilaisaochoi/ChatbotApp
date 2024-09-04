import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Log, Reg } from "./Reducer/UserReducer";
import { Appcontext } from "./Navigation/Appcontext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");
const Login = (props) => {
  const dispatch = useDispatch();
  const {
    setIslogin,
    setMessages,
    setIsnew,
    setIdchatrecent,
    setIssend,
    setFromhistory,
  } = useContext(Appcontext);
  const { LoginData, LoginStatus } = useSelector((state) => state.user);
  const { RegData, RegStatus } = useSelector((state) => state.user);
  const [Showpass, setShowpass] = useState(false);
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [Islog, setIslog] = useState(false);
  const [IsGGSignin, setIsGGSignin] = useState(false);

  const { navigation } = props;
  const showpassword = () => {
    setShowpass(!Showpass);
  };
  const goreg = () => {
    navigation.navigate("register");
  };
  const login = () => {
    if (IsGGSignin || (Username && Password)) {
      const body = {
        username: Username,
        password: Password,
      };
      dispatch(Log(body));
    } else {
      Alert.alert("Thông báo", "Hãy nhập đầy đủ thông tin");
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "358681957288-sc99n3hcngc0npi2agds95t2t0p7ru6g.apps.googleusercontent.com",
    });
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const response = await GoogleSignin.signIn();
      if (response.data.user) {
        setIsGGSignin(true);
        const username = response.data.user.email;
        const name = response.data.user.givenName;
        const password = response.data.idToken;
        reg(username, name, password);
        //console.log({ userInfo: response.data });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const reg = (username, name, password) => {
    const body = { username: username, name: name, password: password };
    setUsername(username);
    setPassword(password);
    dispatch(Reg(body));
  };
  useEffect(() => {
    if (RegStatus == "succeeded" && IsGGSignin) {
      setIslog(true);
      login();
    }
  }, [RegStatus]);

  useEffect(() => {
    console.log(LoginStatus);
    if (LoginStatus == "succeeded" && Islog) {
      if (LoginData.data != null) {
        setIsnew(true);
        setMessages([]);
        setIdchatrecent(null);
        setIssend(false);
        setFromhistory(false);
        setIslogin(true);
        setIsGGSignin(false);
        AsyncStorage.setItem("isLogged", "true");
      } else {
        Alert.alert("Thông báo", LoginData.messenger);
      }
    }
  }, [LoginStatus]);

  return (
    <View style={styles.container}>
      {IsGGSignin && (
        <View style={styles.loading}>
          <Image
            style={styles.loadinggif}
            source={require("../assets/img/loadingwhite.gif")}
          />
        </View>
      )}
      <View style={styles.body}>
        <Text style={styles.welcome}>
          Đăng nhập{"\n"}tài khoản{"\n"}của bạn
        </Text>
        <View>
          <View style={styles.input1}>
            <TextInput
              style={styles.input2}
              placeholder="Tên tài khoản"
              onChangeText={(data) => setUsername(data)}
            />
          </View>
          <View style={styles.input1}>
            <TextInput
              secureTextEntry={Showpass == false ? true : false}
              style={styles.input2}
              placeholder="Mật khẩu"
              onChangeText={(data) => setPassword(data)}
            />
            <TouchableOpacity
              onPress={() => {
                showpassword();
              }}
              activeOpacity={0.5}
            >
              <Image
                style={styles.eye}
                source={
                  Showpass == false
                    ? require("../assets/img/eyeclose.png")
                    : require("../assets/img/eyeopen.png")
                }
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flexDirection: "column", width: "100%" }}>
          <TouchableOpacity style={styles.button} onPress={() => login()}>
            <Text style={styles.text}>Đăng nhập</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cfgnewacc}
            onPress={() => goreg()}
            activeOpacity={0.5}
          >
            <Text style={[styles.newacc, { color: "#ACADB9" }]}>
              Bạn chưa có tài khoản?{" "}
            </Text>
            <Text
              style={[styles.newacc, { color: "#323142", fontWeight: 700 }]}
            >
              Đăng ký
            </Text>
          </TouchableOpacity>
          <GoogleSigninButton
            onPress={() => {
              signIn();
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    padding: "8%",
    flex: 1,
    backgroundColor: "#F7F8FA",
    justifyContent: "center",
  },
  loadinggif: { flex: 0.05, resizeMode: "contain" },
  loading: {
    position: "absolute",
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  cfgnewacc: {
    marginTop: "2%",
    width: "100%",
    padding: "5%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  newacc: {
    textAlign: "center",
    fontSize: width * 0.04,
    fontWeight: 500,
  },
  body: {
    justifyContent: "space-around",
    alignItems: "flex-start",
  },
  back: {
    flexDirection: "row",
    width: "20%",
    height: "15%",
  },
  input1: {
    width: "100%",
    height: height * 0.09,
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: "5%",
    marginBottom: "10%",
    borderRadius: 13,
    elevation: 5,
  },
  input2: {
    fontSize: height * 0.02,
    height: "100%",
    flex: 1,
  },
  eye: {
    resizeMode: "contain",
    flex: 0.35,
  },
  button: {
    width: "100%",
    height: height * 0.09,
    backgroundColor: "#141718",
    justifyContent: "center",
    borderRadius: 14,
  },
  text: {
    textAlign: "center",
    color: "white",
    fontSize: width * 0.04,
  },
  welcome: {
    width: width * 0.5,
    fontSize: width * 0.1,
    fontWeight: "600",
    color: "#323142",
    marginBottom: "10%",
    letterSpacing: -1.25,
  },
});
