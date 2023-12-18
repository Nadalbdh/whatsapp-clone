// ChatScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet , ImageBackground } from 'react-native';
import firebase from '../Config';


const Chat = (props) => {
   // const currentitem=props.route.params.currentitem;
    const secondid=props.route.params.secondid;
    const currentitem=props.route.params.currentid;
const database=firebase.database();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
const ref_chats=database.ref().child('chats');
const chatid=
currentitem.id && secondid?
currentitem.id > secondid?

currentitem.id+secondid:
currentitem.id+secondid:null;

    const ref_un_chat = chatid?ref_chats.child():null;


  const handleSend = () => {
    if (newMessage.trim() === '') {
      return;
    }

    setMessages(prevMessages => [
      ...prevMessages,
      { id: prevMessages.length + 1, text: newMessage, user: 'me' },
    ]);
    setNewMessage('');
  };

  return (
    <View style={styles.container}>
          
      <FlatList
        data={messages}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={item.user === 'me' ? styles.sentMessageContainer : styles.receivedMessageContainer}>
            <Text style={styles.messageText}>{currentitem.name}{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={newMessage}
          onChangeText={text => setNewMessage(text)}
        />
        <TouchableOpacity onPress={handleSend}>
          <Text style={styles.sendButton}>Send</Text>
        </TouchableOpacity>
      </View>
         </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sentMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    padding: 8,
    borderRadius: 8,
    marginVertical: 4,
  },
  receivedMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 8,
    marginVertical: 4,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  sendButton: {
    color: 'pink',
    fontWeight: 'bold',
  },
  background: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

});

export default Chat;
