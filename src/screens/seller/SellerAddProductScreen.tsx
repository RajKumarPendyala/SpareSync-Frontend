import React, { useState } from 'react';
import {
  ScrollView,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Button,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { IP_ADDRESS } from '@env';
import { useSpareParts } from '../../context/SparePartsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import pickAndUploadImage from '../../utils/pickAndUploadImage';
import styles from '../../styles/seller/EditProductScreenStyle';

const SellerAddProductScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [newImageUrls, setNewImageUrls] = useState<string[]>([]);
  const { spareParts, setSpareParts } = useSpareParts();

  const [sparePart, setSparePart] = useState<any>({
    name: '',
    description: '',
    price: '',
    discount: '',
    quantity: '',
    weight: '',
    dimension: '',
    color: '',
    brand: '',
    warrantyPeriod: '',
    gadgetType: '',
    images: [],
  });

  const categories = [
    { id: '1', name: 'Mobile Devices', value: 'MobileDevices' },
    { id: '2', name: 'Computers & Laptops', value: 'ComputingDevices' },
    { id: '3', name: 'Home Appliances', value: 'HomeAppliances' },
    { id: '4', name: 'Gaming Consoles', value: 'GamingConsoles' },
    { id: '5', name: 'Wearables & Smart Tech', value: 'Wearable&SmartDevices' },
    { id: '6', name: 'Entertainment Devices', value: 'Entertainment&MediaDevices' },
  ];

  const handleImageUpload = async () => {
    const imageUrl = await pickAndUploadImage();
    if (!imageUrl) {
      Alert.alert('Upload Failed', 'Please try again.');
      return;
    }
    setNewImageUrls([...newImageUrls, imageUrl]);
    setSparePart((prev: any) => ({
      ...prev,
      images: [
        ...prev.images,
        ...(Array.isArray(imageUrl)
          ? imageUrl.map(url => ({ path: url }))
          : [{ path: imageUrl }]),
      ],
    }));
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updatedImages = sparePart.images.filter((_: any, index: number) => index !== indexToRemove);
    setSparePart((prev: any) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  const handleSave = async () => {
    try {
      if (!sparePart.name?.trim()) {
        Alert.alert('Validation Error', 'Name is required');
        return;
      }
      if (!sparePart.description?.trim()) {
        Alert.alert('Validation Error', 'Description is required');
        return;
      }
      if (
        !sparePart.price?.$numberDecimal ||
        Number(sparePart.price.$numberDecimal) < 0
      ) {
        Alert.alert('Validation Error', 'Price must be zero or positive');
        return;
      }
      if (
        sparePart.quantity === null ||
        sparePart.quantity === undefined ||
        isNaN(sparePart.quantity) ||
        sparePart.quantity < 0
      ) {
        Alert.alert('Validation Error', 'Quantity must be zero or positive');
        return;
      }
      if (!sparePart.brand?.trim()) {
        Alert.alert('Validation Error', 'Brand is required');
        return;
      }
      if (!sparePart.gadgetType) {
        Alert.alert('Validation Error', 'Gadget type is required');
        return;
      }
      const token = await AsyncStorage.getItem('token');

      const payload = {
        ...sparePart,
        quantity: Number(sparePart.quantity),
        imagePaths: sparePart.images || [],
      };

      console.log('Payload:', payload);

      setLoading(true);

      const response = await axios.post(
        `http://${IP_ADDRESS}:3000/api/users/products/seller`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('after saving data',response.data.createdSparePart);

      if (response.status === 201) {
        setSpareParts([...spareParts, response.data.createdSparePart]);
        setLoading(false);
        Alert.alert('Success', 'Spare part added successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Creation failed');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Creation failed');
    }
  };

  if (loading){
    return <ActivityIndicator size="large" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter name"
          placeholderTextColor="#999"
          onChangeText={(text) => setSparePart({ ...sparePart, name: text })}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Enter description"
          placeholderTextColor="#999"
          onChangeText={(text) => setSparePart({ ...sparePart, description: text })}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Price ₹ *</Text>
          <TextInput
            style={styles.halfInput}
            placeholder="Enter price"
            placeholderTextColor="#999"
            keyboardType="numeric"
            onChangeText={(text) => {
              if (/^\d*\.?\d*$/.test(text)) {
                setSparePart((prev: any) => ({
                  ...prev,
                  price: { $numberDecimal: text === '' ? '' : text },
                }));
              }
            }}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Discount %</Text>
          <TextInput
            style={styles.halfInput}
            placeholder="Enter discount"
            placeholderTextColor="#999"
            keyboardType="numeric"
            onChangeText={(text) => setSparePart({ ...sparePart, discount: text })}
          />
        </View>
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Quantity *</Text>
          <TextInput
            style={styles.halfInput}
            placeholder="Enter quantity"
            keyboardType="numeric"
            onChangeText={(text) => {
              const numericValue = text.trim() === '' ? null : Number(text);
              setSparePart({ ...sparePart, quantity: numericValue });
            }}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.halfInput}
            placeholder="Enter weight"
            keyboardType="numeric"
            onChangeText={(text) => setSparePart({ ...sparePart, weight: text })}
          />
        </View>
      </View>


      <View style={styles.rowContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Dimensions</Text>
          <TextInput
            style={styles.halfInput}
            placeholder="Enter dimensions"
            onChangeText={(text) => setSparePart({ ...sparePart, dimension: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Color</Text>
          <TextInput
            style={styles.halfInput}
            placeholder="Enter color"
            onChangeText={(text) => setSparePart({ ...sparePart, color: text })}
          />
        </View>
      </View>


      <View style={styles.rowContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Brand *</Text>
          <TextInput
            style={styles.halfInput}
            placeholder="Enter brand"
            onChangeText={(text) => setSparePart({ ...sparePart, brand: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Warranty Period (months)</Text>
          <TextInput
            style={styles.halfInput}
            placeholder="Warranty period"
            keyboardType="numeric"
            onChangeText={(text) => setSparePart({ ...sparePart, warrentyPeriod: text })}
          />
        </View>
      </View>


      <Text style={styles.label}>Gadget Type *</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <Text style={styles.dropdownText}>
          {categories.find(cat => cat.value === sparePart.gadgetType)?.name || 'Select Gadget Type'}
        </Text>
      </TouchableOpacity>
      {showDropdown && (
        <ScrollView style={styles.dropdownList}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => {
                setSparePart({ ...sparePart, gadgetType: cat.value });
                setShowDropdown(false);
              }}
              style={styles.dropdownItem}
            >
              <Text style={styles.dropdownItemText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <Text style={styles.label}>Images</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {sparePart?.images?.length > 0 &&
          sparePart.images.map((img: any, index: number) => (
            <View key={index} style={styles.imageWrapper}>
              <Image
                source={{ uri: img.path }}
                style={styles.imagePreview}
                onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
              />
              <TouchableOpacity
                style={styles.removeIcon}
                onPress={() => handleRemoveImage(index)}
              >
                <Text style={styles.removeIconText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}

        <TouchableOpacity
          style={styles.addImageButton}
          onPress={handleImageUpload}
        >
          <Text style={styles.addImageText}>＋</Text>
        </TouchableOpacity>
      </ScrollView>

      <Button title="Add Product"
      onPress={handleSave}
      />
    </ScrollView>
  );
};


export default SellerAddProductScreen;
