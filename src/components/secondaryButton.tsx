import React from 'react';
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';
import styles from '../styles/SecondaryButtonStyle';

interface Props {
  title?: string;
  onPress?: () => void;
  width?: number;
  height?: number;
  textStyle?: TextStyle;
  viewStyle?: ViewStyle;
  disabled?: boolean;
}

const SecondaryButton: React.FC<Props> = ({
  title,
  onPress,
  width,
  height,
  textStyle,
  viewStyle,
  disabled,
}) => {
  const dynamicStyle: ViewStyle = {
    width: width ?? 'auto',
    height: height ?? 'auto',
  };

  return (
    <TouchableOpacity
      style={[styles.button, dynamicStyle, viewStyle, disabled && styles.disabled]}
      onPress={onPress}
      // activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default SecondaryButton;
