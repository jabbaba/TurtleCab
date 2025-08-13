import React from 'react';
import { TextInput as DefaultTextInput, StyleSheet, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Text } from './Themed';

export function TextInput(props) {
  const { style, error, ...otherProps } = props;
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <DefaultTextInput
        style={[
          styles.input,
          {
            color: theme.colors.text,
            backgroundColor: theme.colors.inputBackground,
            borderColor: error ? theme.colors.error : theme.colors.border,
          },
          style,
        ]}
        placeholderTextColor={theme.colors.placeholder}
        {...otherProps}
      />
      {error && <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorText: {
    marginTop: 4,
    marginLeft: 12,
    fontSize: 12,
  },
});
