import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ImageBackground,
  Pressable,
  Alert,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput } from "react-native-paper";
import { auth } from "../../firebase/Config";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/Config";
import { forgetPass } from "../../firebase/auth";
import { updateUser } from "../../firebase/users";
import { router } from "expo-router";

export default function Profile() {
  const [name, setName] = useState("");
  const [name2, setName2] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const [count, setCount] = useState(1);

  const handlePress2 = async () => {
    try {
      await auth.signOut();
      router.replace("components/Login");
    } catch (e) {
      console.log(e.code);
    }
  };

  const getUser = async () => {
    try {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      setName(docSnap.data().Name);
      setEmail(docSnap.data().Email);
      setPassword(docSnap.data().Password);
    } catch (e) {
      console.log(e.code);
    }
  };

  useEffect(() => {
    getUser();
  }, [count]);

  const changePassword = async () => {
    try {
      await forgetPass(email);
      auth.signOut();
      Alert.alert(
        "Password Reset Email Sent",
        "Please check your email to change your password."
      );
      router.replace("components/Login");
    } catch (e) {
      console.log(e.code);
    }
  };

  const handlePress = () => {
    setIsDisable(!isDisable);
    setName2(name);
  };

  const changeName = async () => {
    try {
      if (name !== name2 && name.trim() !== "") {
        await updateUser(name, email, password);
        Alert.alert("Success", "The Name has been changed successfully");
        setCount(count + 1);
        setIsDisable(!isDisable);
      } else {
        Alert.alert("Error", "Please enter a new username");
      }
    } catch (e) {
      console.log(e.code);
    }
  };

  return (
    <ImageBackground
      style={styles.imageContainer}
      source={require("../../assets/images/profile.jpg")}
    >
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.innerContainer}>
          <Text style={styles.text}>Upload Photo</Text>
        </View>
        <View style={styles.innerContainer2}>
          <Text style={styles.label}>Name:</Text>
          <View style={styles.container2}>
            <TextInput
              value={name}
              style={styles.input}
              editable={isDisable}
              onChangeText={(text) => setName(text)}
            />
            <Pressable style={styles.btn} onPress={handlePress}>
              <Text style={styles.btnText}>Change</Text>
            </Pressable>
          </View>
          <Text style={styles.label}>Email:</Text>
          <TextInput value={email} style={styles.input2} disabled />
          <Text style={styles.label}>Password:</Text>
          <View style={styles.container2}>
            <TextInput
              value={password}
              style={styles.input}
              disabled
              secureTextEntry={true}
            />
            <Pressable style={styles.btn} onPress={changePassword}>
              <Text style={styles.btnText}>Change</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.container4}>
          {auth.currentUser.uid === "kBYESUR4aaV26K3hINjpUiUKQTq2" ? (
            <Pressable
              style={styles.btn2}
              onPress={() => router.push("../components/Admin")}
            >
              <Text style={styles.btnText2}>Admin</Text>
            </Pressable>
          ) : null}
          {isDisable ? (
            <Pressable style={styles.btn2} onPress={changeName}>
              <Text style={styles.btnText2}>Save</Text>
            </Pressable>
          ) : null}
          <Pressable style={styles.btn2} onPress={handlePress2}>
            <Text style={styles.btnText2}>Log Out</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  text: {
    padding: 10,
  },
  innerContainer: {
    backgroundColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: height * 0.01,
    borderRadius: 10,
    marginTop: height * 0.02,
  },
  container2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer2: {
    backgroundColor: "#f9b344",
    justifyContent: "center",
    // alignItems: "center",
    paddingVertical: height * 0.02,
    borderRadius: 10,
    paddingHorizontal: width * 0.03,
    marginTop: height * 0.02,
  },
  label: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    marginLeft: width * 0.02,
    marginTop: width * 0.02,
  },
  input: {
    // flex: 1,
    height: height * 0.05,
    paddingHorizontal: width * 0.02,
    borderWidth: 3,
    borderColor: "black",
    fontSize: width * 0.05,
    fontWeight: "bold",
    backgroundColor: "#ddd",
    borderRadius: 10,
    marginTop: height * 0.02,
    marginRight: width * 0.01,
    width: "60%",
  },
  input2: {
    // flex: 1,
    height: height * 0.05,
    paddingHorizontal: width * 0.02,
    borderWidth: 3,
    borderColor: "black",
    fontSize: width * 0.05,
    fontWeight: "bold",
    backgroundColor: "#ddd",
    borderRadius: 10,
    marginTop: height * 0.02,
    marginLeft: width * 0.02,
    marginRight: width * 0.01,
  },
  btn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    paddingHorizontal: width * 0.06,
    paddingVertical: width * 0.03,
    marginTop: height * 0.02,
    borderRadius: 10,
  },
  btnText: {
    fontWeight: "bold",
    color: "white",
    fontSize: width * 0.04,
  },
  btn2: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9b344",
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
    marginTop: height * 0.02,
    width: width * 0.3,
    borderRadius: 10,
    marginLeft: width * 0.03,
  },
  btnText2: {
    fontWeight: "bold",
    fontSize: width * 0.05,
  },
  container4: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    // width: "70%",
    // backgroundColor: "red",
  },
});
