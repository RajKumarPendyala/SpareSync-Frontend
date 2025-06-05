import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import { IP_ADDRESS } from '@env';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackParamList } from '../../navigation/StackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import Colors from '../../context/colors';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Conversation = {
  _id: string;
  participants: {
    _id: string;
    name: string;
    image?: any;
  }[];
  lastMessage?: {
    text: string;
    senderId: string;
    read: boolean;
    sentAt: string;
  };
  updatedAt: string;
};

type ChatScreenNavigationProp = StackNavigationProp<StackParamList, 'BuyerTabNav'>;

const ChatScreen = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const navigation = useNavigation<ChatScreenNavigationProp>();

  const fetchConversations = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`http://${IP_ADDRESS}:3000/api/users/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

console.log('conversation response: ',response);

      setConversations(response.data.conversations);
      setCurrentUserId(response.data.userId);
    } catch (error: any) {
        console.error('Error removing to cart:', error?.response?.data || error.message);
        Alert.alert('Failed to remove item from cart.');
      }
  };

    useFocusEffect(
      useCallback(() => {
        fetchConversations();
      }, [])
    );

    // const handleDelete = async (otherParticipant: any) => {
    //   try {
    //     const token = await AsyncStorage.getItem('token');
    //     const response = await axios.patch(
    //       `http://${IP_ADDRESS}:3000/api/users/conversations`,
    //       { id: otherParticipant._id },
    //       {
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //         },
    //       }
    //     );

    //     await fetchConversations();

    //     if (response.data.message) {
    //       Alert.alert('Success','Conversation removed from chat successfully!');
    //     }
    //   } catch (error: any) {
    //     console.error('Error removing conversation:', error?.response?.data || error.message);
    //     Alert.alert('Failed to remove conversation.');
    //   }
    // };

  const renderItem = ({ item }: { item: Conversation }) => {
    const today = new Date();
    const yy =  String(today.getFullYear()).slice(2);
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    const dbDate = new Date(item.updatedAt.split('T')[0]);
    const year = String(dbDate.getFullYear()).slice(2);
    const month = String(dbDate.getMonth() + 1).padStart(2, '0');
    const day = String(dbDate.getDate()).padStart(2, '0');

    const currentData = `${dd}/${mm}/${yy}`;
    const formattedDate = `${day}/${month}/${year}`;

    const time = new Date(item.updatedAt).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });



  const otherParticipant = item.participants.find(p => p._id !== currentUserId);

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => navigation.navigate('ChatDetail', { conversationId: item._id })}
      >
        <Image
          source={
            otherParticipant?.image?.path
              ? { uri: otherParticipant.image.path }
              : { uri: 'https://res.cloudinary.com/dxcbw424l/image/upload/v1749116154/rccjtgfk1lt74twuxo3b.jpg' }
          }
          style={styles.avatar}
          onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
        />
        <View style={styles.chatInfo}>
          <Text style={styles.name}>{otherParticipant?.name || 'Unknown'}</Text>
          <Text style={styles.message} numberOfLines={1}>
            {item.lastMessage?.text || 'Start chatting'}
          </Text>
        </View>

        <Text style={styles.date}>
          {
            currentData === formattedDate ? time : formattedDate
          }
        </Text>

      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chats</Text>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 30,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputContainerBG,
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 24,
    marginRight: 20,
  },
  chatInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: Colors.icon,
  },
  date: {
    color: Colors.icon,
    alignSelf: 'flex-start',
    textAlignVertical: 'top',
  },
});

export default ChatScreen;
