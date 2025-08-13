import React from 'react';
import { Text as DefaultText, View as DefaultView, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export function Text(props) {
  const { style, ...otherProps } = props;
  const { theme } = useTheme();

  return <DefaultText style={[{ color: theme.colors.text }, style]} {...otherProps} />;
}

export function View(props) {
  const { style, ...otherProps } = props;
  const { theme } = useTheme();

  return <DefaultView style={[{ backgroundColor: theme.colors.background }, style]} {...otherProps} />;
}

export function Card(props) {
  const { style, ...otherProps } = props;
  const { theme } = useTheme();

  return <DefaultView style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }, style]} {...otherProps} />;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
