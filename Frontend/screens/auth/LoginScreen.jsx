import {
  StyleSheet,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";

import fav from "../../assets/images/fav.png";
import { Fonts } from "../../theme";
import colors from "../../colors";
import CustomText from "../../components/ui/Text";
import { Global } from "../../globalStyles";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import { useNavigation } from "@react-navigation/native";
import { Dialog } from "@rneui/themed";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../../utils/mutations";
import CustomBottomSheet from "../../components/ui/BottomSheet";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER);
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [bottomSheetMessage, setBottomSheetMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const toggleDialog = () => {
    setVisible(!visible);
  };

  const navigateToForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };
  const navigateToSignup = () => {
    navigation.navigate("Signup");
  };

  const isFormValid = () => {
    return email !== "" && password !== "";
  };

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const displayBottomSheet = (message, isError) => {
    setBottomSheetMessage(message);
    setIsError(isError);
    setVisible1(true);
  };

  const closeBottomSheet = () => {
    setVisible1(!visible1);
  };

  const handleLogin = async () => {
    if (!isFormValid()) return;

    try {
      const response = await loginUser({
        variables: {
          input: {
            email: email,
            password: password,
          },
        },
      });

      console.log("Login successful:", response.data.login);
      setVisible(true);
      setTimeout(() => {
        setVisible(false); // Hide loading dialog
        navigation.navigate("Home"); // Navigate to Home
      }, 2000);
    } catch (error) {
      displayBottomSheet(`${error.message}`, true);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.title}>
          <Image source={fav} style={styles.fav} />
          <CustomText style={Global.h2} weight="medium">
            Tugela
          </CustomText>
        </View>
        <CustomText weight="regular" style={Global.h4}>
          Sign In
        </CustomText>
      </View>
      <TouchableWithoutFeedback>
        <KeyboardAvoidingView style={styles.form}>
          <View>
            <CustomInput
              type="Email"
              label="Email"
              placeholder={"Enter your email address"}
              onChange={handleEmailChange}
            />
            <CustomInput
              type="Password"
              label="Password"
              placeholder={"Enter your password"}
              onChange={handlePasswordChange}
            />
            <CustomButton
              title={"Sign In"}
              disabled={!isFormValid()}
              onPress={handleLogin}
            />
            <View style={styles.account}>
              <View style={styles.signup}>
                <CustomText style={Global.small}>
                  Don't have an account?
                </CustomText>
                <TouchableOpacity onPress={navigateToSignup}>
                  <CustomText style={styles.caption} weight="semibold">
                    Sign Up
                  </CustomText>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={navigateToForgotPassword}>
                <CustomText style={styles.forgot} weight="semibold">
                  Forgot Password?
                </CustomText>
              </TouchableOpacity>
            </View>
            <View style={styles.divider}>
              <View style={styles.divide}></View>
              <CustomText
                style={{ fontSize: 14, color: colors.text }}
                weight="medium"
              >
                or
              </CustomText>
              <View style={styles.divide}></View>
            </View>
            <CustomButton
              title={"Sign in with Google"}
              disabled={false}
              icon={"google"}
              iconColor={colors.primary}
              buttonStyle={styles.button}
              titleStyle={styles.buttonText}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <Dialog isVisible={visible} onBackdropPress={toggleDialog}>
        <Dialog.Loading />
      </Dialog>
      <CustomBottomSheet
        visible={visible1}
        onClose={closeBottomSheet}
        isError={isError}
        message={bottomSheetMessage}
        onPress={isError ? closeBottomSheet : ""}
      />
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    fontFamily: Fonts.regular,
    justifyContent: "space-between",
    flexDirection: "column",
    height: "100%",
    width: "100%",
  },
  header: {
    flex: 3,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  fav: {
    width: 50,
    height: 50,
    marginRight: 4,
  },
  text: {
    fontFamily: Fonts.bold,
    fontSize: 24,
  },
  form: {
    flex: 7,
    fontFamily: Fonts.medium,
    paddingHorizontal: 16,
  },
  title: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  account: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 32,
  },
  signup: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  caption: {
    color: colors.primary,
    fontSize: 14,
    paddingLeft: 4,
  },
  forgot: {
    color: colors.primary,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  divider: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  divide: {
    width: "40%",
    borderWidth: 0.3,
    color: colors.borderColor,
  },
  button: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
    marginTop: 16,
  },
  buttonText: {
    fontFamily: Fonts.medium,
    color: colors.primary,
  },
});
