import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackParamList } from '../../navigation/StackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import styles from '../../styles/common/chatScreenStyle';
import { fetchConversations } from '../../services/common/chatService';


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

  const loadConversations = async () => {
    try {
      const data = await fetchConversations();
      setConversations(data.conversations);
      setCurrentUserId(data.userId);
    } catch (error) {
      Alert.alert('Failed to load conversations.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadConversations();
    }, [])
  );

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



  const otherParticipant: any = item.participants.find(p => p._id !== currentUserId);

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
          <Text style={styles.name}>{otherParticipant?.name?.charAt(0)?.toUpperCase() + otherParticipant.name.slice(1)  || 'Unknown'}</Text>
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
      {
        conversations.length === 0 ?
        (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Your chat is empty.</Text>
          </View>
        )
        :
        (
          <FlatList
            data={conversations}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
          />
        )
      }
    </View>
  );
};

export default ChatScreen;
