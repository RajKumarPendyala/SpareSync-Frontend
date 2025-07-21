import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  Modal,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RouteProp, useRoute, useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackParamList } from '../../navigation/StackNavigator';
import Colors from '../../context/colors';
import { IP_ADDRESS } from '@env';
import styles from '../../styles/common/ChatDetailScreenStyle';


const ChatDetailScreen = () => {
  const route = useRoute<RouteProp<StackParamList, 'ChatDetail'>>();
  const { conversationId } = route.params;
  const [messages, setMessages] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const [otherParticipant, setOtherParticipant] = useState(Object);
  const [message, setMessage] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();


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
      const currentId = response.data.currentUser;
      setCurrentUserId(currentId);
      setOtherParticipant(response.data.conversation.participants.find((p: any) => p._id !== currentId));

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

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Delete',
      'Delete conversation from you and others?',
      [
        {
          text: 'No',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              const response = await axios.patch(
                `http://${IP_ADDRESS}:3000/api/users/conversations`,
                { id: otherParticipant._id },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              navigation.goBack();

              if (response.data.message) {
                Alert.alert('Success','Conversation deleted successfully!');
              }
            } catch (error: any) {
              console.error('Error removing conversation:', error?.response?.data || error.message);
              Alert.alert('Failed to remove conversation.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };


  const handleSend = async () => {
    if (!message.trim()){
      return;
    }

    const token = await AsyncStorage.getItem('token');

    try {
      const response = await axios.post(
        `http://${IP_ADDRESS}:3000/api/users/conversations/message`,
        {
          receiverId: otherParticipant._id,
          text: message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages(prev => [...prev, response.data.conversation.messages.slice(-1)[0]]);
      setMessage('');
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error: any) {
      console.error('Send message failed:', error?.response?.data || error.message);
      Alert.alert('Failed to send message');
    }
  };

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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} >
          <Icon name="arrow-left" size={24} color={Colors.black} />
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <Image
            source={
              otherParticipant?.image?.path
                ? { uri: otherParticipant.image.path }
                : { uri: 'https://res.cloudinary.com/dxcbw424l/image/upload/v1749116154/rccjtgfk1lt74twuxo3b.jpg' }
            }
            style={styles.avatar}
            onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
          />
          <Text style={styles.userName}>{otherParticipant?.name?.charAt(0)?.toUpperCase() + otherParticipant?.name?.slice(1)}</Text>
        </View>

        <TouchableOpacity onPress={() => setShowMenu(true)} style={styles.dots}>
          <Icon name="dots-vertical" size={24} color={Colors.black} />
        </TouchableOpacity>
      </View>

      <Modal visible={showMenu} transparent>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowMenu(false)}>
          <View style={styles.dropdown}>
            <TouchableOpacity onPress={() => { setShowMenu(false); handleDelete(); }}>
              <Text style={styles.dropdownItem}><Icon name="delete" size={18} color={Colors.secondary} />   Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

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
        <TouchableOpacity onPress={handleSend} style={styles.send}>
          <Icon name="send" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatDetailScreen;
