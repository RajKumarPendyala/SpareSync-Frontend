import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  TextInput,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Button,
} from 'react-native';
import axios from 'axios';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { IP_ADDRESS } from '@env';
import { useSpareParts } from '../../context/SparePartsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackParamList } from '../../navigation/StackNavigator';
import pickAndUploadImage from '../../utils/pickAndUploadImage';
import Colors from '../../context/colors';

type EditScreenRouteProp = RouteProp<StackParamList, 'EditProductScreen'>;

const EditProductScreen = () => {
  const route = useRoute<EditScreenRouteProp>();
  const navigation = useNavigation();
  const { sparePartId } = route.params;

  const [loading, setLoading] = useState(false);
  const [sparePart, setSparePart] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [newImageUrls, setNewImageUrls] = useState<string[]>([]);
  const { spareParts, setSpareParts } = useSpareParts();


  const categories = [
    { id: '1', name: 'Mobile Devices', value: 'MobileDevices' },
    { id: '2', name: 'Computers & Laptops', value: 'ComputingDevices' },
    { id: '3', name: 'Home Appliances', value: 'HomeAppliances' },
    { id: '4', name: 'Gaming Consoles', value: 'GamingConsoles' },
    { id: '5', name: 'Wearables & Smart Tech', value: 'Wearable&SmartDevices' },
    { id: '6', name: 'Entertainment Devices', value: 'Entertainment&MediaDevices' },
  ];

  useEffect(() => {
    const product = spareParts.find((item: any) => item._id === sparePartId);
    if (product) {
      setSparePart(product);
    }
  }, [spareParts, sparePartId]);


  const handleImageUpload = async () => {
    const imageUrl = await pickAndUploadImage();
    if (!imageUrl) {
      Alert.alert('Upload Failed', 'Please try again.');
      return;
    }
    setNewImageUrls([...newImageUrls, imageUrl]);
    console.log('handleImageUrl: ',imageUrl);
    setSpareParts((prevSpareParts: any) =>
      prevSpareParts.map((part: any) =>
        part._id === sparePartId
          ? {
              ...part,
              images: [
                ...part.images,
                ...(Array.isArray(imageUrl)
                  ? imageUrl.map(url => ({ path: url }))
                  : [{ path: imageUrl }]),
              ],
            }
          : part
      )
    );
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updatedImages = sparePart.images.filter((_: any, index: number) => index !== indexToRemove);
    const updatedImagePaths = (sparePart.imagePaths || []).filter((_: any, index: number) => index !== indexToRemove);

    const updatedSparePart = {
      ...sparePart,
      images: updatedImages,
      imagePaths: updatedImagePaths,
    };

    setSparePart(updatedSparePart);

    setSpareParts((prevSpareParts: any) =>
      prevSpareParts.map((part: any) =>
        part._id === sparePartId ? updatedSparePart : part
      )
    );
  };


  const handleSave = async () => {
    try {
      const qtyNumber = Number(sparePart.quantity);
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
      if (!sparePart.quantity?.toString().trim() || isNaN(qtyNumber) || qtyNumber < 0) {
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
        _id: sparePartId,
        ...sparePart,
        quantity: qtyNumber,
        imagePaths: sparePart.images,
      };


      setLoading(true);

      const response = await axios.patch(
        `http://${IP_ADDRESS}:3000/api/users/products/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSpareParts((prevSpareParts: any) =>
          prevSpareParts.map((part: any) =>
            part._id === sparePartId ? { ...sparePart } : part
          )
        );
        setLoading(false);
        Alert.alert('Success', 'Spare part updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Update failed');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Update failed');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }
  if (!sparePart) {
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
          value={sparePart.name}
          onChangeText={(text) => setSparePart({ ...sparePart, name: text })}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Enter description"
          placeholderTextColor="#999"
          value={sparePart.description}
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
            value={sparePart.price?.$numberDecimal ?? ''}
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
            value={sparePart.discount?.$numberDecimal ?? ''}
            onChangeText={(text) => {
              if (/^\d*\.?\d*$/.test(text)) {
                setSparePart((prev: any) => ({
                  ...prev,
                  discount: { $numberDecimal: text === '' ? '' : text },
                }));
              }
            }}
          />
        </View>
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Quantity *</Text>
          <TextInput
            style={styles.halfInput}
            placeholder="Enter quantity"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={String(sparePart?.quantity ?? '')}
            onChangeText={(text) => setSparePart({ ...sparePart, quantity: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.halfInput}
            placeholder="Enter weight"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={sparePart.weight?.$numberDecimal ?? ''}
            onChangeText={(text) => {
              if (/^\d*\.?\d*$/.test(text)) {
                setSparePart((prev: any) => ({
                  ...prev,
                  weight: { $numberDecimal: text === '' ? '' : text },
                }));
              }
            }}
          />
        </View>
      </View>


      <View style={styles.rowContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Dimensions</Text>
          <TextInput
            style={styles.halfInput}
            placeholder="Enter dimensions"
            placeholderTextColor="#999"
            value={sparePart.dimension}
            onChangeText={(text) => setSparePart({ ...sparePart, dimension: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Color</Text>
          <TextInput
            style={styles.halfInput}
            placeholder="Enter color"
            placeholderTextColor="#999"
            value={sparePart.color}
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
            placeholderTextColor="#999"
            value={sparePart.brand}
            onChangeText={(text) => setSparePart({ ...sparePart, brand: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Warranty Period (months)</Text>
          <TextInput
            style={styles.halfInput}
            placeholder="Warranty period"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={String(sparePart.warrentyPeriod)}
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

      <Button title="Save Changes"
      onPress={handleSave}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.secondaryButtonBG,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.inputContainerBD,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    height: 45,
    backgroundColor: Colors.inputContainerBG,
    color: '#000',
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.inputContainerBD,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 15,
    fontSize: 16,
    backgroundColor:  Colors.inputContainerBG,
    color: '#000',
    height: 100,
    textAlignVertical: 'top',
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
    overflow: 'visible',
    marginBottom: 30,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeIcon: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff3333',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  removeIconText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.inputContainerBG,
    marginBottom: 30,
  },
  addImageText: {
    fontSize: 32,
    color: '#999',
  },
  dropdown: {
    borderWidth: 1,
    height: 45,
    borderColor: Colors.inputContainerBD,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: Colors.inputContainerBG,
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: Colors.inputContainerBD,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: Colors.inputContainerBG,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: Colors.inputContainerBD,
  },
  dropdownItemText: {
    fontSize: 15,
  },

  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  halfInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.inputContainerBD,
    borderRadius: 8,
    width: 170,
    padding: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.inputContainerBG,
    height: 45,
  },
});

export default EditProductScreen;
