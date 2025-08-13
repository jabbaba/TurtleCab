import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from './Themed';
import { useTheme } from '../hooks/useTheme';

export function Button(props) {
  const { title, onPress, style, textStyle, ...otherProps } = props;
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: theme.colors.primary },
        style,
      ]}
      onPress={onPress}
      {...otherProps}
    >
      <Text style={[styles.text, { color: theme.colors.buttonText }, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
