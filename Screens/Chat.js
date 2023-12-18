import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { Audio } from 'expo-av';
import firebase from '../Config';
import ChatHeader from './ChatHeader';

const Chat = (props) => {
  const [recording, setRecording] = useState();
  const [sound, setSound] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const { currentid, seconditem } = props.route.params;
  console.log("current: ", currentid);
  console.log("second:", seconditem);
  const [groupData, setGroupData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [senderNames, setSenderNames] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [Chatid,setChatid] = useState("")

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Start');
      const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('ga3ed yrecordi');
    } catch (err) {
      console.error('error recording', err);
    }
  }

  async function stopRecording() {
    try {
      console.log('recording stopped..');
      setRecording(undefined);
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      
      const uri = recording.getURI();
      console.log('Recording stopped and stored at', uri);
      const response = await fetch(uri);
      const blob = await response.blob();
  
      const storageRef = firebase.storage().ref().child(`audio/${new Date().toISOString()}.aac`);
      await storageRef.put(blob);
  
      const downloadURL = await storageRef.getDownloadURL();
  
      const commonGroupMessagesRef = firebase.database().ref(`Chats/Chat${Chatid}/messages`);
      const newMessageRef = commonGroupMessagesRef.push();
  
      const messageData = {
        sender: currentid,
        timestamp: new Date().getTime(),
        audioURL: downloadURL,
      };
  
      newMessageRef.set(messageData);
  
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  }
  async function playSound( url ) {
    console.log('Loading recording');
    const { sound } = await Audio.Sound.createAsync(
      { uri: url },
     { shouldPlay: true }
    );
    setSound(sound);

    console.log('sout yemchi');
    await sound.playAsync();
  }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log('Sout ça va');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const setChatidentification = async () => {
    if(currentid<seconditem.id)
     setChatid(currentid+seconditem.id)
  else
     setChatid(seconditem.id+currentid)
  }
  
  useEffect(() => {
    const setChatIdAndInitializeChat = async () => {
      setChatidentification();
      await new Promise(resolve => setTimeout(resolve, 500)); 

      if (Chatid) {
        const Allgroupref = firebase.database().ref('Chats');
        const commonGroupRef = Allgroupref.child(`Chat${Chatid}`);

        const handleGroupData = (snapshot) => {
          const data = snapshot.val();
          setGroupData(data);

          if (!data) {
            commonGroupRef.set({
              members: { [currentid]: true, [seconditem.id]: true },
              messages: {},
              typing: {},
            });
          }
        };

        commonGroupRef.on('value', handleGroupData);

        return () => {
          commonGroupRef.off('value', handleGroupData);
        };
      }
    };

    setChatIdAndInitializeChat();
  }, [Chatid, currentid, seconditem.id]);

  useEffect(() => {
    if (groupData) {
      const commonGroupMessagesRef = firebase.database().ref(`Chats/Chat${Chatid}/messages`);
      const commonGroupTypingRef = firebase.database().ref(`Chats/Chat${Chatid}/typing`);

      const handleMessages = async (messagesSnapshot) => {
        const messagesData = messagesSnapshot.val();
        const messagesArray = messagesData ? Object.values(messagesData) : [];
        const senderNamesMap = {};
        for (const message of messagesArray) {
          if (!senderNames[message.sender]) {
            const senderName = await getUserNameById(message.sender);
            senderNamesMap[message.sender] = senderName;
          }
        }
        setSenderNames((prevSenderNames) => ({ ...prevSenderNames, ...senderNamesMap }));
        setMessages(messagesArray);
      };
      const handleTyping = (typingSnapshot) => {
        const typingData = typingSnapshot.val() || {};
        setTypingUsers(typingData);
      };

      commonGroupMessagesRef.on('value', handleMessages);
      commonGroupTypingRef.on('value', handleTyping);

      return () => {
        commonGroupMessagesRef.off('value', handleMessages);
        commonGroupTypingRef.off('value', handleTyping);
      };
    }
  }, [groupData]);

  const sendMessage = () => {
    if (newMessage.trim() === '') {
      return;
    }

    const commonGroupMessagesRef = firebase.database().ref(`Chats/Chat${Chatid}/messages`);
    const newMessageRef = commonGroupMessagesRef.push();

    const messageData = {
      text: newMessage,
      sender: currentid,
      timestamp: new Date().getTime(),
    };

    newMessageRef.set(messageData);

    clearTypingStatus();
    setNewMessage('');
  };

  const startTyping = () => {
    const commonGroupTypingRef = firebase.database().ref(`Chats/Chat${Chatid}/typing`);
    commonGroupTypingRef.child(currentid).set(true);
  };

  const stopTyping = () => {
    const commonGroupTypingRef = firebase.database().ref(`Chats/Chat${Chatid}/typing`);
    commonGroupTypingRef.child(currentid).remove();
  };

  const clearTypingStatus = () => {
    const commonGroupTypingRef = firebase.database().ref(`Chats/Chat${Chatid}/typing`);
    commonGroupTypingRef.child(currentid).remove();
  };

  const getUserNameById = async (profileId) => {
    try {
      const profileRef = firebase.database().ref(`profils/profil${profileId}`);
      const snapshot = await profileRef.once('value');

      if (snapshot.exists()) {
        const userProfile = snapshot.val();
        return `${userProfile.surname} ${userProfile.name}`;
      } else {
        return 'Unknown User';
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return 'Unknown User';
    }
  };

  
  return (
    <View style={styles.container}>
      {groupData ? (
        <>
        <ChatHeader user={seconditem} />
          <FlatList
            data={messages}
            keyExtractor={(item) => item.timestamp.toString()}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageContainer,
                  {
                    alignSelf: item.sender === currentid ? 'flex-end' : 'flex-start',
                    backgroundColor: item.sender === currentid ? '#C3E6F5' : '#87CEEB',
                  },
                ]}
              >{item.audioURL ? (
                <TouchableOpacity >
                  <View>
                    <Text style={styles.senderText}>{senderNames[item.sender]}</Text>
                    <TouchableOpacity onPress={() => playSound(item.audioURL)} >
                      < Icon name="play-circle" size={30} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.timestampText}>
                      {new Date(item.timestamp).toLocaleString()}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                  <View>
                <Text style={styles.senderText}>{senderNames[item.sender]}</Text>
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.timestampText}>
                  {new Date(item.timestamp).toLocaleString()}
                </Text>
              </View>
            )}
                          </View>
            )}
          />
          <TextInput
            style={styles.input}
            placeholder="..."
            value={newMessage}
            onChangeText={(text) => {
              setNewMessage(text);
              if (text.trim() !== '') {
                startTyping();
              } else {
                stopTyping();
              }
            }}
            onBlur={() => stopTyping()}
          />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.sendButton}>
              <Button title="Send" onPress={sendMessage} color="#FFC436" style={{width:50}}/>
              </TouchableOpacity>
            {recording ? (
              <TouchableOpacity onPress={stopRecording} style={styles.iconContainer}>
                <Icon name="stop-circle" size={30} color="#FF0000" />
              </TouchableOpacity>
              ) : (
              <TouchableOpacity onPress={startRecording} style={styles.iconContainer}>
                <Icon name="microphone" size={30} color="#333" />
              </TouchableOpacity>
              )}
            </View>
          {Object.keys(typingUsers).length > 0 && !typingUsers[currentid] && (
            <Text>{`${Object.keys(typingUsers)
              .map(id => senderNames[id])
              .join(', ')} ${
              Object.keys(typingUsers).length > 1 ? 'are typing...' : 'is typing...'
            }`}</Text>
          )}
        </>
      ) : (
        <Text>Chat </Text>
      )}

    </View>
  );
  
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  sendButton: {
    flex: 0.9,
    marginRight: 8,
    width: 200 ,
    paddingVertical: 6,
    borderRadius: 100,
  },
  iconContainer: {
    flex: 0.1,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFC436',
    padding: 10,
    borderRadius: 8,
    marginLeft:5
    },
  container: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#C3E6F5',
    borderRadius: 8,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  senderText: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  timestampText: {
    color: '#888',
  },
  input: {
    height: 40,
    borderWidth: 0.5,
    marginBottom: 8,
    paddingHorizontal: 8,
    borderColor:'#888'
  },
});

export default Chat;