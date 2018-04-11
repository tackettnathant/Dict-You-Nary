import React from 'react';
import { Image, StyleSheet } from 'react-native';
class HeaderLogo extends React.Component {
  render() {
    return (
      <Image
        source={require('../../images/cover_texture.jpg')}
        style={StyleSheet.absoluteFill}
      />
    );
  }
}

export default HeaderLogo;
