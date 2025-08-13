import React from 'react';
import { Image, StyleSheet } from 'react-native';

export function Logo(props) {
  const { style, ...otherProps } = props;
  return (
    <Image
      source={require('../../assets/TurtleCab Logo.jpg')}
      style={[styles.logo, style]}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});
