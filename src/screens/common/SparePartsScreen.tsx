import { Text, View } from 'react-native';
import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../navigation/StackNavigator';


type SparePartsScreenNavigationProp = StackNavigationProp<StackParamList, 'SpareParts'>;

interface Props {
  navigation: SparePartsScreenNavigationProp;
  route: {
    params: {
      gadgetType: string;
    };
  };
}

const SparePartsScreen: React.FC<Props> = ({ route }) => {
  const { gadgetType } = route.params;

  return (
    <View>
      <Text>{gadgetType}</Text>
    </View>
  );
};

export default SparePartsScreen;
