import React, { useState, useEffect } from 'react';
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
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useSpareParts } from '../../context/SparePartsContext';
import { StackParamList } from '../../navigation/StackNavigator';
import pickAndUploadImage from '../../utils/pickAndUploadImage';
import styles from '../../styles/seller/editProductScreenStyle';
import { validateSparePart, updateSparePart } from '../../services/seller/sellerEditProductService';



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
    const validationError = validateSparePart(sparePart);
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    setLoading(true);
    const result = await updateSparePart({ _id: sparePartId, ...sparePart });

    setLoading(false);

    if (result.success) {
      setSpareParts((prevSpareParts: any) =>
        prevSpareParts.map((part: any) =>
          part._id === sparePartId ? { ...sparePart } : part
        )
      );
      Alert.alert('Success', result.message);
      navigation.goBack();
    } else {
      Alert.alert('Error', result.message);
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

export default EditProductScreen;
