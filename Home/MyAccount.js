import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Image, ImageBackground } from 'react-native';
import { Button } from 'react-native-paper';
import firebase from '../Config';
import { TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const database = firebase.database();

export default function MyAccount(props) {

  const currentid =props.route.params.currentid;
  const [name, setname] = useState()
  const [surname, setsurname] = useState()
  const [phone, setphone] = useState()
  const [isdefault, setisdefault] = useState(true)
  const [urlLocal, seturlLocal] = useState()


    const uploadedLocalImageToStorage = async (url) => {
        try {
        // Convert image to blob
        const blob = await imageToBlob(url);

        // Upload blob to storage with a unique name (currentid + timestamp)
        const storage = firebase.storage();
        const ref_lesImages = storage.ref().child("Lesimages");
        const imageName = `image${currentid}_${Date.now()}.jpg`;
        const ref_uneImage = ref_lesImages.child(imageName);
        await ref_uneImage.put(blob);

        // Get the download URL
        const link = await ref_uneImage.getDownloadURL();
        return link;
        } catch (error) {
        console.error("Error uploading image:", error);
        throw error; // Rethrow the error to handle it in the calling function
        }
    }

  const imageToBlob = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob"; //bufferArray
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    return blob;
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setisdefault(false);
      seturlLocal(uri);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/back.jpg")}
        style={styles.background}>
        <View
          style={
            styles.transparentView
          }
        >
          <TouchableOpacity
            onPress={() => {
              pickImage();
            }}
          >
            <Image
              source={isdefault ? require("../assets/account.jpeg") : { uri: urlLocal }} style={{ width: 100, height: 100, }}

            />
          </TouchableOpacity>
          <Text style={styles.title}>My Account</Text>
          <TextInput
            onChangeText={(text) => {
              setname(text)
            }} style={styles.inputText}

            placeholder="name"
            placeholderTextColor="#464E51"
          />

          <TextInput
            onChangeText={(text) => {
              setsurname(text)
            }}

            style={styles.inputText}

            placeholder="surname"
            placeholderTextColor="#464E51"
          />
          <TextInput

            onChangeText={(text) => {
              setphone(text)
            }}

            style={styles.inputText}

            placeholder="Phone"
            placeholderTextColor="#363737"
          />

          <Button style={styles.button} labelStyle={{ color: "#464E51", fontSize: 20 }}

            onPress={async () => {
              if(urlLocal!==null){

                const link=await uploadedLocalImageToStorage(urlLocal);

             
              const ref_profils = database.ref("profils");
              const ref_un_profil = ref_profils.child("profil" + currentid);
              ref_un_profil.set({
                id:currentid,
                name: name,
                surname: surname,
                phone: phone,
                url:link,
              });
            }
            }}
          >Save</Button>
        </View>
      </ImageBackground>
    </View>


  )
}

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

    margin: 0,

  },
  title: {
    fontWeight: "bold",
    fontSize: 25,
    color: "#464E51",
    marginBottom: 20,
  },
  inputText: {
    width: "80%",
    backgroundColor: "#ffffff",
    opacity: 0.2,
    borderRadius: 25,
    height: 60,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20
  },

  inputText: {
    width: "80%",
    backgroundColor: "#ffffff",
    opacity: 0.2,
    borderRadius: 25,
    height: 60,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20
  },
  button: {
    width: '60%',
    color: "#fff",
    backgroundColor: "#FFC436",


    margin: 20,
  },
  smallText: {
    fontWeight: "bold",
    color: "#464E51",
    fontSize: 20,
  },
  transparentView: {
    backgroundColor: "#0001",
    width: "90%",
    height: 600,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

