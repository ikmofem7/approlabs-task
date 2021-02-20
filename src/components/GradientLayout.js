import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GradientLayout = (props) => {
  return (
    <LinearGradient colors={['#f86c51', '#cc5057']} style={{flex: 1}}>
      {props.children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({});
export default GradientLayout;
