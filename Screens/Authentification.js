import React, { useRef, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { BackHandler, ImageBackground, StyleSheet, Text, TextInput, View, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { NavigationRouteContext } from '@react-navigation/native';
import firebase from '../Config';

export default function Authentification(props) {
  const [email , setmail]=useState("nada@gmail.com");
  const [pwd, setpwd] = useState("abcddcba");
  const refinput2 = useRef()
const auth =firebase.auth()
  return (
   
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        style={styles.background}
        source={require("../assets/back.jpg")}

      >

        <View
          style={
            styles.transparentView
          }
        >
          <Text style={styles.title}>Authentification</Text>
          <TextInput
          keyboardType='email-address'
            onChangeText={(text) => {
              setmail(text)
            }}
            onSubmitEditing={() => {refinput2.current.focus()}}
            blurOnSubmit={false}
            style={styles.inputText}

            placeholder="Email"
            placeholderTextColor="#000"
          />
          <TextInput
          ref={refinput2}
            onChangeText={(text) => {
              setpwd(text)
            }}
            style={styles.inputText}
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="#464E51"
          />


          <Button style={styles.button} labelStyle={{ color: "#fff" }}
            onPress={() => {
                //alert("success");
                auth.signInWithEmailAndPassword(email,pwd).then(()=>{
                  const currentid=auth.currentUser.uid;

                  props.navigation.navigate("accueil", {currentid})})

                .catch((err)=>{alert(err)});
            }}>Login
          </Button>
          
          <Button style={styles.button} labelStyle={{ color: "#fff" }}
            onPress={() => { 
              BackHandler.exitApp(); }}
          >Cancel</Button>
          <Button style={styles.bottomButton} labelStyle={{ color: "#fff" }}
            onPress={() => { 
             props.navigation.navigate("newuser"); }}
          >Sign Up</Button>
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
    alignItems:'center'
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

    margin: 0,

  },
  title: {
    fontWeight: "bold",
    fontSize: 30,
    color: "#ffffff",
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
    color: "#fff5",
    backgroundColor: "#FFC436",


    margin: 20,
  },
  smallText: {
    fontWeight: "bold",
    color: "#ff02",
    fontSize: 20,
  },
  transparentView: {
    backgroundColor: "#0001",
    width: "90%",
    height: 500,
    borderRadius:10,
    alignItems:'center',
    justifyContent:'center'
  },
  bottomButton:{
borderBottomWidth: 1.2,
color:"#ff02",
borferBottomColor:"#fff5",

  }
});











