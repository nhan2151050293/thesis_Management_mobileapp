// Chat.js

import React, { useState, useEffect, useContext } from "react";
import { View, ActivityIndicator, Text, TouchableOpacity, TextInput } from "react-native";
import { Icon } from "react-native-paper";
import { GiftedChat, MessageText } from "react-native-gifted-chat";
import { collection, addDoc, orderBy, query, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { MyUserContext } from "../../configs/Contexts";
import { database } from "../../configs/Firebase";
import ChatStyle from "./Style";
import moment from 'moment';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [userLoaded, setUserLoaded] = useState(false);
  const { thesesCode } = useRoute().params; 
  const user = useContext(MyUserContext);
  const nav = useNavigation();

  const handleBack = () => {
    nav.navigate('ContactList');
  };

  useEffect(() => {
    if (user) {
      setUserLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    if (!userLoaded || !thesesCode) return;

    const collectionRef = collection(database, `theses/${thesesCode}/messages`);
    const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, snapshot => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        _id: doc.id,
        createdAt: doc.data().createdAt.toDate(),
        text: doc.data().text,
        user: doc.data().user,
        read: doc.data().read || false // Thêm trường read, mặc định là false nếu không có trong dữ liệu
      }));
      setMessages(fetchedMessages);
    });

    return unsubscribe;
  }, [userLoaded, thesesCode]);

  const onSend = async (messages = []) => {
    const { _id, createdAt, text, user } = messages[0];

    try {
      const docRef = await addDoc(collection(database, `theses/${thesesCode}/messages`), {
        _id,
        createdAt,
        text,
        user,
        read: false // Tin nhắn mới sẽ có trạng thái chưa đọc
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleOnPressMessage = async (messageId) => {
    try {
      const messageRef = doc(database, `theses/${thesesCode}/messages/${messageId}`);
      await updateDoc(messageRef, {
        read: true // Đánh dấu tin nhắn là đã đọc khi người dùng xem tin nhắn
      });
    } catch (error) {
      console.error("Error updating message read status:", error);
    }
  };

  if (!userLoaded) {
    return <ActivityIndicator size="large" color='#da91a4' />;
  }

  return (
    <View style={ChatStyle.container}>
      <View style={ChatStyle.TopBackGround}>
        <TouchableOpacity style={ChatStyle.backButton} onPress={handleBack}>
          <Icon source="arrow-left" color="#f3e5e4" size={30} />
        </TouchableOpacity>
        <Text style={ChatStyle.greeting}>CHAT ROOM {thesesCode}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: user.id,
            avatar: user.avatar
          }}
          placeholder="Type your message here..."
          alwaysShowSend={true}
          renderSend={(props) => (
            <TouchableOpacity onPress={() => props.onSend({ text: props.text }, true)}>
              <Text style={{ color: 'blue', margin: 10 }}>Send</Text>
            </TouchableOpacity>
          )}
          renderBubble={(props) => (
            <TouchableOpacity onPress={() => handleOnPressMessage(props.currentMessage._id)}>
              <View style={{ 
                backgroundColor: props.position === 'left' ? 'white' : (props.currentMessage.read ? '#d3d3d3' : '#da91a4'), 
                borderRadius: 5, 
                padding: 10 
              }}>
                <Text style={{ color: props.position === 'left' ? 'black' : '#fff' }}>{props.currentMessage.text}</Text>
                <Text>{moment(props.currentMessage.createdAt).format('HH:mm')}</Text>
                {props.position === 'left' && ( 
                  <Text style={{ 
                    color: props.position === 'left' ? 'black' : '#fff', 
                    fontSize: 10, 
                    marginTop: 1, 
                    alignSelf: 'flex-start' 
                  }}>
                    {moment(props.currentMessage.createdAt).format('HH:mm')}
                    {props.currentMessage.read ? ' - Đã xem' : ' - Chưa đọc'}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
          
          
          renderInputToolbar={(props) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#da91a4', padding: 5, height: 50 }}>
              <TextInput
                style={{ flex: 1, backgroundColor: '#fff', borderRadius: 5 }}
                value={props.text}
                onChangeText={props.onTextChanged}
              />
              <TouchableOpacity onPress={() => props.onSend({ text: props.text }, true)} disabled={props.text.trim().length === 0}>
                <Text style={{ color: '#fff', margin: 5, fontWeight: 'bold' }}>Send</Text>
              </TouchableOpacity>
            </View>
          )}
          renderMessageText={(props) => (
            <MessageText
              {...props}
              textStyle={{
                left: { color: 'black' },
                right: { color: 'white' }
              }}
            />
          )}
        />
      </View>
    </View>
  );
};

export default Chat;
