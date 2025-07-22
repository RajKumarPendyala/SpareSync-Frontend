import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackParamList } from '../../navigation/StackNavigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import Colors from '../../context/colors';
import pickAndUploadImage from '../../utils/pickAndUploadImage';
import styles from '../../styles/buyer/buyerReviewScreenStyle';
import { submitReview } from '../../services/buyer/buyerReviewService';

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
    setSubmitting(true);

    const result = await submitReview({
      sparePartId,
      rating,
      comment,
      imagePaths: images,
    });

    setSubmitting(false);

    if (result.success) {
      Alert.alert('Success', result.message);
      navigation.goBack();
    } else {
      Alert.alert('Error', result.message);
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

export default BuyerReviewScreen;
