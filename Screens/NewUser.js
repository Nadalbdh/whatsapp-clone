import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-paper';
import firebase from '../Config';

const auth = firebase.auth();

export default function NewUser(props) {
  const [name, setname] = useState()
  const [phone, setphone] = useState()

  const [password, setpassword] = useState()
  const [confirmpwd, setconfirmpwd] = useState()
  const [email, setemail] = useState()

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
          <Text style={styles.title}>Create Account</Text>
          <TextInput
            onChangeText={(text) => {
              setname(text)
            }} style={styles.inputText}

            placeholder="name"
            placeholderTextColor="#464E51"
          />

          <TextInput
            onChangeText={(text) => {
              setemail(text)
            }}

            style={styles.inputText}

            placeholder="Email"
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
          <TextInput

            onChangeText={(text) => {
              setpassword(text)
            }}
            style={styles.inputText}
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="#464E51"
          />
          <TextInput

            onChangeText={(text) => {
              setconfirmpwd(text)
            }}
            style={styles.inputText}
            secureTextEntry
            placeholder="confirm Password"
            placeholderTextColor="#464E51"
          />

          <Button style={styles.button} labelStyle={{ color: "#fff", fontSize: 20 }}

            onPress={() => {
              if (password === confirmpwd) {
                auth.createUserWithEmailAndPassword(email, password).then(
                  () => { props.navigation.navigate("auth") }
                )
                  .catch((err) => { alert(err) });
              }

            }}
          >Sign up</Button>

          <Text style={styles.smallText}>Already have an account ? </Text>
          <Button style={styles.button} labelStyle={{ color: "#fff", fontSize: 20  }}
            onPress={() => { 
             props.navigation.navigate("auth"); }}
          > Login</Button>

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
    color: "#fff",
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
  button: {
    width: '60%',
    backgroundColor: "#fff",
    height: 50,


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
    color: "#fff",
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

