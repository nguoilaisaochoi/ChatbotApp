import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Log } from "./Reducer/UserReducer";
import { Appcontext } from "./Navigation/Appcontext";
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");
const Login = (props) => {
  const dispatch = useDispatch();
  const { setIslogin } = useContext(Appcontext);
  const { LoginData, LoginStatus } = useSelector((state) => state.user);
  const [Showpass, setShowpass] = useState(false);
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [Islog, setIslog] = useState(false);
  const { navigation } = props;
  const showpassword = () => {
    setShowpass(!Showpass);
  };
  const goreg = () => {
    navigation.navigate("register");
  };
  const login = () => {
    if (Username == "" || Password == "") {
      Alert.alert("Thông báo", "Hãy nhập đầy đủ thông tin");
    } else {
      setIslog(true);
      const body = {
        username: Username,
        password: Password,
      };
      dispatch(Log(body));
    }
  };
  useEffect(() => {
    console.log(LoginStatus);
    if (LoginStatus == "succeeded" && Islog) {
      if (LoginData.data != null) {
        setIslogin(true);
      } else {
        Alert.alert("Thông báo", LoginData.messenger);
      }
    }
  }, [LoginStatus]);
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.welcome}>Login Your Account</Text>
        <View>
          <View style={styles.input1}>
            <TextInput
              style={styles.input2}
              placeholder="Username"
              onChangeText={(data) => setUsername(data)}
            />
          </View>
          <View style={styles.input1}>
            <TextInput
              secureTextEntry={Showpass == false ? true : false}
              style={styles.input2}
              placeholder="Password"
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
            <Text style={styles.text}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cfgnewacc} onPress={() => goreg()} activeOpacity={0.5}>
            <Text style={[styles.newacc, { color: "#ACADB9" }]}>Create New Account? </Text>
            <Text style={[styles.newacc, { color: "#323142", fontWeight: 700 }]}>Sign up</Text>
          </TouchableOpacity>
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
  },
  input2: {
    fontSize: height * 0.02,
    height: "100%",
    flex: 1,
  },
  eye: {
    resizeMode: "contain",
    flex: 0.4,
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
