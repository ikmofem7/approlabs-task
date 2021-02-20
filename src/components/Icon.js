import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
const Icon = (props) => {
  return (
    <TouchableOpacity activeOpacity={0.5} onPress={() => props.iconAction()}>
      <Ionicons name={props.iconName} color="white" size={100} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});
export default Icon;
