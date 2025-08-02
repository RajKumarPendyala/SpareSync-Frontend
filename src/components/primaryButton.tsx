import React from 'react';
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import styles from '../styles/primaryButtonStyle';
import  Colors  from '../context/colors';

interface Props {
  title?: string;
  onPress?: () => void;
  width?: number;
  height?: number;
  borderRadius?: number;
  loading?: boolean;
  textStyle?: TextStyle;
  viewStyle?: ViewStyle;
  disabled?: boolean;
}

const PrimaryButton: React.FC<Props> = ({
  title,
  onPress,
  width,
  height,
  borderRadius,
  loading = false,
  textStyle,
  viewStyle,
  disabled = false,
}) => {
  const dynamicStyle: ViewStyle = {
    width: width ?? 'auto',
    height: height ?? 'auto',
    borderRadius: borderRadius ?? 10,
  };

  return (
    <TouchableOpacity
      style={[styles.button, dynamicStyle, viewStyle,  (disabled || loading) && styles.disabled]}
      onPress={onPress}
      // activeOpacity={0.8}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={Colors.background} />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default PrimaryButton;
