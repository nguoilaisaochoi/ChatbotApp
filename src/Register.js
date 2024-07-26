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
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Reg } from "./Reducer/UserReducer";
const { height } = Dimensions.get("window");
const { width } = Dimensions.get("window");
const Register = (props) => {
  const dispatch = useDispatch();
  const { RegData, RegStatus } = useSelector((state) => state.user);
  const [showpass, setShowpass] = useState(false);
  const [showpass2, setShowpass2] = useState(false);
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [Name, setName] = useState("");
  const [Isreg, setIsReg] = useState(false);
  const { navigation } = props;
  const gologin = () => {
    navigation.goBack();
  };
  const Register = () => {
    if (Username == "" || Password == "" || Name == "" || ConfirmPassword == "") {
      Alert.alert("Thông báo", "Hãy nhập đầy đủ thông tin");
    } else if (Password !== ConfirmPassword) {
      Alert.alert("Thông báo", "2 mật khẩu không khớp");
    } else {
      const body = {
        username: Username,
        password: Password,
        name: Name,
      };
      setIsReg(true);
      dispatch(Reg(body));
    }
  };
  useEffect(() => {
    if (RegStatus == "succeeded" && Isreg) {
      if (RegData.data != null) {
        navigation.goBack();
      } else {
        Alert.alert("Thông báo", RegData.messenger);
      }
      console.log(RegData);
    }
  }, [RegStatus]);
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.welcome}>Create your Account</Text>
        <View>
          <View style={styles.input1}>
            <TextInput
              style={styles.input2}
              placeholder="Username"
              onChangeText={(data) => {
                setUsername(data);
              }}
            />
          </View>
          <View style={styles.input1}>
            <TextInput
              style={styles.input2}
              placeholder="Name"
              onChangeText={(data) => {
                setName(data);
              }}
            />
          </View>
          <View style={styles.input1}>
            <TextInput
              secureTextEntry={showpass == false ? true : false}
              style={styles.input2}
              placeholder="Password"
              onChangeText={(data) => {
                setPassword(data);
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setShowpass(!showpass);
              }}
              activeOpacity={0.5}
            >
              <Image
                style={styles.eye}
                source={
                  showpass == false
                    ? require("../assets/img/eyeclose.png")
                    : require("../assets/img/eyeopen.png")
                }
              />
            </TouchableOpacity>
          </View>
          <View style={styles.input1}>
            <TextInput
              secureTextEntry={showpass2 == false ? true : false}
              style={styles.input2}
              placeholder="ConfirmPassword"
              onChangeText={(data) => {
                setConfirmPassword(data);
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setShowpass2(!showpass2);
              }}
              activeOpacity={0.5}
            >
              <Image
                style={styles.eye}
                source={
                  showpass2 == false
                    ? require("../assets/img/eyeclose.png")
                    : require("../assets/img/eyeopen.png")
                }
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => Register()} activeOpacity={0.5}>
          <Text style={styles.text}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cfgnewacc} onPress={() => gologin()} activeOpacity={0.5}>
          <Text style={[styles.newacc, { color: "#ACADB9" }]}>Already Have An Account? </Text>
          <Text style={[styles.newacc, { color: "#323142", fontWeight: 700 }]}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Register;

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
    marginBottom: "5%",
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
