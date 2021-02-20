import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Circle = (props) => {
  return (
    <View style={styles.circleBorder}>
      <View
        style={{
          ...styles.circleBorder,
          width: 200,
          height: 200,
          borderRadius: 200,
        }}>
        {props.children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  circleBorder: {
    alignItems: 'center',
    borderColor: '#D3D3D3',
    borderWidth: 5,
    justifyContent: 'center',
    width: 230,
    height: 230,
    borderRadius: 230,
  },
});
export default Circle;
