import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RouteProp, useRoute, useFocusEffect } from '@react-navigation/native';
import { StackParamList } from '../../navigation/StackNavigator';
import Colors from '../../context/colors';
import { IP_ADDRESS } from '@env';

const ChatDetailScreen = () => {
  const route = useRoute<RouteProp<StackParamList, 'ChatDetail'>>();
  const { conversationId } = route.params;
  const [messages, setMessages] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const [message, setMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);


  const fetchConversation = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get(
        `http://${IP_ADDRESS}:3000/api/users/conversations/messages`,
        {
          params: { conversationId: conversationId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(response.data.conversation.messages);
      setCurrentUserId(response.data.currentUser);
    } catch (error: any) {
      console.error('Failed to fetch conversation:', error?.response?.data || error.message);
      Alert.alert('Error loading chat');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchConversation();
    }, [])
  );


  // const handleSend = async () => {
  //   if (!message.trim()) return;

  //   const token = await AsyncStorage.getItem('token');

  //   try {
  //     const response = await axios.post(
  //       `http://${IP_ADDRESS}:3000/api/users/message`,
  //       {
  //         receiverId: '', // TODO: Pass correct receiverId based on participants
  //         text: message,
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     setMessages(prev => [...prev, response.data.conversation.messages.slice(-1)[0]]);
  //     setMessage('');
  //     flatListRef.current?.scrollToEnd({ animated: true });
  //   } catch (error: any) {
  //     console.error('Send message failed:', error?.response?.data || error.message);
  //     Alert.alert('Failed to send message');
  //   }
  // };

  const renderMessage = ({ item }: { item: any }) => {
    console.log(item);
    const isCurrentUser = item.senderId === currentUserId;
    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.sent : styles.received,
        ]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestamp}>{new Date(item.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputRow}>
        <TextInput
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
          style={styles.input}
        />
        <TouchableOpacity
        // onPress={handleSend}
        >
          <Icon name="send" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7faff',
  },
  chatContainer: {
    padding: 10,
  },
  messageContainer: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 12,
    marginVertical: 4,
  },
  sent: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primaryButtonBG,
  },
  received: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.secondaryButtonBG,
  },
  messageText: {
    fontSize: 15,
    color: Colors.black,
  },
  timestamp: {
    fontSize: 10,
    color: Colors.icon,
    marginTop: 4,
    textAlign: 'right',
  },
  inputRow: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.inputContainerBD,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.inputContainerBD,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: Colors.inputContainerBG,
  },
});

export default ChatDetailScreen;
