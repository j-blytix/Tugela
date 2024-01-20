import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import PagerView from "react-native-pager-view";
import Freelancer from "./Freelancer";
import Client from "./Client";
import colors from "../../colors";
import CustomText from "../../components/ui/Text";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import { Global } from "../../globalStyles";
import avata from "../../assets/images/profile.png";
import * as ImagePicker from "expo-image-picker";
import DropdownSelect from "react-native-input-select";
import { Fonts } from "../../theme";

const Onboarding = () => {
  const pagerRef = useRef(null);
  const [initialPage, setInitialPage] = useState(0);
  const [name, setName] = useState("");
  const [image, setImage] = useState(avata);
  const [usertype, setUsertype] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const handleImagePicker = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log(result);

      if (!result.canceled) {
        setImage({ uri: result.assets[0].uri });
        validateForm();
      }
    } catch (error) {
      console.error("Error picking an image: ", error);
    }
  };

  const validateForm = () => {
    const isNameValid = name.trim() !== "";
    const isUsertypeValid = usertype !== "";
    const isImageValid = !!image.uri;

    const isValid = isNameValid && isUsertypeValid && isImageValid;
    setIsFormValid(isValid);

    console.log("Name valid:", isNameValid);
    console.log("Usertype valid:", isUsertypeValid);
    console.log("Image valid:", isImageValid);
    console.log("Form valid:", isValid);
  };

  const handleNameChange = (text) => {
    console.log("Input Text:", text);
    setName(text);
    validateForm();
  };

  const moveToNext = () => {
    if (isFormValid && pagerRef.current) {
      if (usertype === "1") {
        pagerRef.current.setPage(1);
      } else if (usertype === "2") {
        pagerRef.current.setPage(2);
      } else {
        pagerRef.current.setPage(initialPage + 1);
      }

      setInitialPage(initialPage + 1);
    }
  };
  return (
    <PagerView
      ref={pagerRef}
      style={styles.pagerView}
      initialPage={initialPage}
      scrollEnabled
    >
      <View key="0" style={styles.container}>
        <View style={styles.profile}>
          <CustomText weight="medium" style={Global.h2}>
            Profile Update
          </CustomText>
          <View style={styles.upload}>
            {image && <Image source={image} style={styles.image} />}
            <TouchableOpacity style={styles.edit} onPress={handleImagePicker}>
              <CustomText weight="medium" style={styles.text}>
                Add Photo
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
        <KeyboardAvoidingView style={styles.form}>
          <CustomInput
            type="Text"
            label="Full Name"
            placeholder={"Enter your full name"}
            onChange={handleNameChange}
            value={name}
          />
          <DropdownSelect
            label="Select User Type"
            placeholder="Select"
            options={[
              { label: "Freelancer", value: "1" },
              { label: "Client", value: "2" },
            ]}
            dropdownStyle={styles.dropdownStyle}
            selectedValue={usertype}
            onValueChange={(itemValue) => {
              setUsertype(itemValue);
              validateForm();
            }}
            placeholderStyle={styles.placeholderStyle}
            labelStyle={styles.labelStyle}
            checkboxStyle={styles.checkBox}
            checkboxLabelStyle={styles.checkBoxLabel}
            modalBackgroundStyle={styles.modalBackground}
            selectedItemStyle={styles.selectedItems}
          />
        </KeyboardAvoidingView>
        <View style={styles.button}>
          <CustomButton
            title={"Continue"}
            disabled={!isFormValid}
            onPress={moveToNext}
          />
        </View>
      </View>
      <Freelancer key="1" />
      <Client key="2" />
    </PagerView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    margin: 20,
  },
  profile: {
    width: "100%",
  },
  upload: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 40,
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 200,
  },
  text: {
    fontSize: 18,
    color: colors.primary,
    marginTop: 10,
  },
  form: {
    flex: 2,
    flexDirection: "column",
    marginVertical: 20,
  },
  radioButton: {
    width: 16,
    height: 16,
    borderRadius: 20 / 2,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  selectedItems: {
    color: colors.title,
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  modalBackground: {
    backgroundColor: "rgba(0 , 0, 0, 0.25)",
  },
  checkBoxLabel: {
    fontSize: 18,
    fontFamily: Fonts.regular,
    paddingVertical: 16,
    paddingHorizontal: 4,
    color: colors.label,
  },
  checkBox: {
    backgroundColor: colors.primary,
    borderColor: colors.borderColor,
    borderWidth: 2,
    borderRadius: 8,
  },
  labelStyle: {
    color: colors.label,
    fontSize: 14,
    fontFamily: Fonts.regular,
    marginBottom: 8,
  },
  placeholderStyle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "500",
  },
  dropdownStyle: {
    backgroundColor: colors.background,
    borderColor: colors.borderColor,
    height: 56,
  },
});
