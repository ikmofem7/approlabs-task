import React, {Component} from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import {Text, StyleSheet, View, TouchableOpacity, Platform} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getData} from '../AppUtility';

const ListScreen = (props) => {
  const [recordList, setRecordList] = useState([]);
  const fetchList = async () => {
    const records = await getData('records');
    console.log(records);
    const setRecords = JSON.parse(records);
    setRecordList(setRecords);
  };
  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      title: 'Your Records',
      headerTitleStyle: {color: '#cc5057', alignSelf: 'center'},
      headerRight: () => (
        <TouchableOpacity
          style={{marginRight: 20}}
          onPress={() => props.navigation.navigate('Record', {fromList: true})}>
          <Ionicons name={'mic'} color="#cc5057" size={24} />
        </TouchableOpacity>
      ),
    });
  }, [props.navigation]);
  useEffect(() => {
    fetchList();
  }, []);
  console.log('recordList', recordList);
  return (
    <View>
      {recordList.map((record, index) => {
        const capitalizedFileName =
          record.fileName.charAt(0).toUpperCase() + record.fileName.slice(1);
        console.log(capitalizedFileName);
        const fileName =
          Platform.OS === 'android'
            ? `${capitalizedFileName}.mp4`
            : `${capitalizedFileName}.m4a`;
        const time = `Recorded at: ${record.time.slice(0, -4)}`;
        console.log(time);
        return (
          <TouchableOpacity
            onPress={() => {
              return props.navigation.navigate('Player', {
                fileName: record.fileName,
              });
            }}
            key={index}
            style={{
              margin: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 20,
              backgroundColor: 'white',
            }}>
            <View>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: 'black',
                  fontSize: 20,
                }}>
                {fileName}
              </Text>
              <Text>{time}</Text>
            </View>
            <Ionicons name={'play-circle'} color="#cc5057" size={24} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({});

export default ListScreen;
