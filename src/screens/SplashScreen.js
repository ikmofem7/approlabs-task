import React from 'react';
import {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {getData} from '../AppUtility';

const SplashScreen = (props) => {
  navigateToScreen = async () => {
    const length = await getData('length');
    console.log(length);
    if (length) {
      return props.navigation.replace('List');
    } else {
      return props.navigation.replace('Record');
    }
  };
  useEffect(() => {
    navigateToScreen();
  }, []);

  return null;
};
const styles = StyleSheet.create({});
export default SplashScreen;
