import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackParamList } from '../../navigation/StackNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { IP_ADDRESS } from '@env';
import axios from 'axios';
import Colors from '../../context/colors';
import pickAndUploadImage from '../../utils/pickAndUploadImage';

type RootStackNavigationProp = StackNavigationProp<StackParamList, 'BuyerTabNav'>;

const BuyerReviewScreen = () => {
  const route = useRoute<RouteProp<StackParamList, 'ReviewScreen'>>();
  const navigation = useNavigation<RootStackNavigationProp>();
  const { sparePartId } = route.params;

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleUploadImage = async () => {
    const uploadedUrl = await pickAndUploadImage();
    if (uploadedUrl) {
      setImages([...images, uploadedUrl]);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Please log in to submit a review.');
        return;
      }

      const response = await axios.post(
        `http://${IP_ADDRESS}:3000/api/users/reviews`,
        {
            sparePartId,
            rating,
            comment,
            imagePaths: images.map((url) => ({ path: url })),
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
        );
        console.log(response);

      if (response.status === 201) {
        Alert.alert('Success', 'Review submitted successfully');
        navigation.goBack();
      }
    } catch (error: any) {
        console.error('Error Failed to submit review :', error?.response?.data || error.message);
        Alert.alert('Error','Failed to submit review.');
    } finally {
        setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Your Rating</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((val) => (
          <TouchableOpacity key={val} onPress={() => setRating(val)}>
            <Icon
              name={val <= rating ? 'star' : 'star-outline'}
              size={32}
              color={Colors.primary}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Your Comment</Text>
      <TextInput
        multiline
        numberOfLines={4}
        value={comment}
        onChangeText={setComment}
        placeholder="Write your thoughts..."
        style={styles.textInput}
      />

      <Text style={styles.label}>Upload Images</Text>
      <ScrollView horizontal>
        {images.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.image} />
        ))}
        <TouchableOpacity onPress={handleUploadImage} style={styles.uploadButton}>
          <Icon name="camera-plus" size={30} color={Colors.primary} />
        </TouchableOpacity>
      </ScrollView>

      <Button
        title={submitting ? 'Submitting...' : 'Submit Review'}
        onPress={handleSubmit}
        disabled={submitting || !rating || !comment}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    marginTop: 45,
    borderColor: Colors.inputContainerBD,
    padding: 16,
    borderWidth: 2,
    borderRadius: 8,
},
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  ratingContainer: { flexDirection: 'row', marginBottom: 15 },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.inputContainerBD,
    borderRadius: 6,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  uploadButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 30,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BuyerReviewScreen;
