import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ImageBackground, Image ,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Make sure to install the vector-icons package
import { NavigationRouteContext } from '@react-navigation/native';
import { Button, Dialog } from 'react-native-paper';
import firebase from '../Config';


const database = firebase.database();

export default function ListProfils(props) {
  const [data, setData] = useState([]);
  const [currentitem, setcurrentitem] = useState({})
  const [currentitemm, setcurrentitemm] = useState({})
  const [visible, setvisible] = useState(false)
  const currentid =props.route.params.currentid;
  const ref_profils = database.ref('profils');

  useEffect(() => {
    ref_profils.on("value",(snapshot)=>{
      var d=[];
      snapshot.forEach((un_profil)=>{
        console.log(un_profil.val());
        if(un_profil.val().id==currentid){
          setcurrentitem(un_profil.val());
          console.log("jawha behi ");
        }
        else
          d.push(un_profil.val());
      });
      setData(d);
    });

  
    return () => {
      ref_profils.off();
    }
  }, [])
  
  
  const renderItem = ({ item }) => (
   
    <View style={styles.contactItem}>
      <View style={styles.contactContent}>
        <TouchableOpacity onPress={()=>{setvisible(true)}}>
        <Image
          source={{uri:item.url}}
          style={{ width: 50, height: 50 }}
        />
        </TouchableOpacity>
        <View style={styles.contactText}>
          <Text style={styles.contactName}>{item.name} {item.surname}</Text>
          <Text style={styles.contactPhone}>{item.phone}</Text>
        </View>
      </View>
      {/* <TouchableOpacity onPress={() => { 
             props.navigation.navigate("Chat" , {currentid, secondid:item}); }}>
      <Icon name="chat" size={24} color="pink" style={styles.chatIcon} />
      </TouchableOpacity> */}
    </View>
  );

  return (
    <ImageBackground
      source={require("../assets/back.jpg")}
      style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>My contacts</Text>
        <FlatList
          data={data}
          renderItem={({ item }) => {
            return (
            <View style={styles.contactItem}>
            <View style={styles.contactContent}>
            <TouchableOpacity
            onPress={() => {
            setvisible (true);
            setcurrentitem(item);
            }}>
            <Image
              source={{uri:item.url}}
              style={{ width: 50, height: 50 }}
            />
            </TouchableOpacity>
            <View style={styles.contactText}>
              <Text style={styles.contactName}>{item.name} {item.surname}</Text>
              <Text style={styles.contactPhone}>{item.phone}</Text>
              <TouchableOpacity
              onPress={() => {
                props.navigation.navigate("chat", {currentid, secondid:item})
              }}>
              <Icon name="chat" size={24} color="#FFC436" style={styles.chatIcon} />
              </TouchableOpacity>
            </View>
            </View>
            </View>
          );
        }}
        />
      <Dialog visible={visible} onDismiss={()=>{}}>
        <Dialog.Title>
          Profile Details
        </Dialog.Title>
        <Dialog.Content>
          <Text>Details of Selected Profile</Text>
          <Image resizeMode='center'
          style={{width:80 , height:80}}
          source={require('../assets/account.jpeg')}
          >
          </Image>
        </Dialog.Content>
        <Dialog.Actions>
        <Button> Call </Button>
        <Button> SMS </Button>
        <Button onPress={()=>setvisible(false)}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
      </View>
    </ImageBackground>
  );
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
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    overflow: 'hidden',
    margin: 20,
    backgroundColor: '#FFF', // Set your background color here
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#333333',
    marginBottom: 16,
    marginTop: 16,

  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Add space between items
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    margin: 12,
    width: 350,
  },
  contactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    marginLeft: 10,
  },
  chatIcon: {
    marginRight: 16,
    marginLeft: 200,
    marginTop:0,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  contactPhone: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },
});


