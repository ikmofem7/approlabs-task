import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  PermissionsAndroid,
  Platform,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import {getData, storeData} from '../AppUtility';
import Circle from '../components/Circle';
import GradientLayout from '../components/GradientLayout';
import Icon from '../components/Icon';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CommonActions} from '@react-navigation/native';

class RecordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recordSecs: 0,
      recordTime: '00:00:00',
      fileName: 'record0',
      count: 1,
      currentIcon: 'play',
      disabled: false,
      stopped: false,
      breathingStatus: false,
    };
    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.09);
    this.breatheTimeInterval = '';
  }

  componentDidMount = () => {
    this.fetchLength();
  };

  fetchLength = async () => {
    const length = await getData('length');
    if (length) {
      this.setState({fileName: `record${length}`});
    }
  };

  componentWillUnmount() {
    clearInterval(this.breatheTimeInterval);
  }

  onStartRecord = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Permissions for write access',
            message: 'Give permission to your storage to write a file',
            buttonPositive: 'ok',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the storage');
        } else {
          console.log('permission denied');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Permissions for write access',
            message: 'Give permission to your storage to write a file',
            buttonPositive: 'ok',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the camera');
        } else {
          console.log('permission denied');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }

    const path = Platform.select({
      ios: `${this.state.fileName}.m4a`,
      android: `sdcard/${this.state.fileName}.mp4`,
    });
    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };

    const result = await this.audioRecorderPlayer.startRecorder(path, audioSet);
    if (this.state.count) {
      setTimeout(() => {
        if (!this.state.stopped) {
          this.onStopRecord();
        }
      }, this.state.count * 1000 * 60);
    }
    this.breatheTimeInterval = setInterval(() => {
      let breathingStatus = !this.state.breathingStatus;
      this.setState({breathingStatus: breathingStatus});
    }, 10000);
    this.setState({currentIcon: 'stop', disabled: true});
    this.audioRecorderPlayer.addRecordBackListener((e) => {
      this.setState({
        recordSecs: e.current_position,
        recordTime: this.audioRecorderPlayer.mmssss(
          Math.floor(e.current_position),
        ),
      });
      return;
    });
    console.log('result', result);
  };

  onStopRecord = async () => {
    const result = await this.audioRecorderPlayer.stopRecorder();
    this.audioRecorderPlayer.removeRecordBackListener();
    clearInterval(this.breatheTimeInterval);
    const length = await getData('length');
    let storedRecords = await getData('records');
    let storingLength;
    let records;
    if (length) {
      const parseRecord = JSON.parse(storedRecords);
      storingLength = +length + 1;
      records = [
        ...parseRecord,
        {time: new Date().toUTCString(), fileName: this.state.fileName},
      ];
    } else {
      storingLength = 1;
      records = [
        {time: new Date().toUTCString(), fileName: this.state.fileName},
      ];
    }
    await storeData('length', storingLength.toString());
    await storeData('records', JSON.stringify(records));
    this.setState({
      recordSecs: 0,
      disabled: false,
      stopped: true,
    });
    console.log(result);
    Alert.alert(
      'Hurray !!!',
      'You have successfully recorded your breathe',
      [
        {
          text: 'OK',
          onPress: () => {
            this.props.navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'List'}],
              }),
            );
          },
        },
      ],
      {cancelable: false},
    );
  };

  deductTime = () => {
    if (this.state.count <= 1) {
      return alert('You need to select atleast 1 min');
    }
    this.setState((prevstate) => ({...prevstate, count: prevstate.count - 1}));
  };
  addTime = () => {
    if (this.state.count >= 59) {
      return alert('You need to select less than 1 hour');
    }
    this.setState((prevstate) => ({...prevstate, count: prevstate.count + 1}));
  };

  renderIcon = () => {
    let IconComponent;
    if (this.state.currentIcon === 'play') {
      IconComponent = (
        <Icon iconName="play-circle" iconAction={this.onStartRecord} />
      );
    } else {
      IconComponent = (
        <Icon iconName="stop-circle" iconAction={this.onStopRecord} />
      );
    }
    return IconComponent;
  };

  render() {
    const {params} = this.props.route;
    const fromList = params?.fromList ?? false;
    return (
      <View style={{flex: 1}}>
        <GradientLayout>
          <View style={{marginTop: 20, marginLeft: 10}}>
            {fromList && (
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Ionicons name={'chevron-back'} color="white" size={20} />
              </TouchableOpacity>
            )}
            <Text style={styles.breatheText}>Breathe</Text>
          </View>
          <View style={styles.container}>
            <Circle>{this.renderIcon()}</Circle>
            <Text style={{color: 'white', fontSize: 16}}>
              {this.state.breathingStatus ? 'Breathe-Out' : 'Breathe-In'}
            </Text>
            <Text style={{color: 'white', fontSize: 16}}>
              {Math.floor(this.state.recordSecs / 1000)}
            </Text>
            <View style={styles.timeContainer}>
              <TouchableOpacity
                onPress={() => this.deductTime()}
                disabled={this.state.disabled}>
                <Ionicons name={'remove'} color="white" size={24} />
              </TouchableOpacity>
              <View style={styles.circleBorder}>
                <Text
                  style={{color: 'white'}}>{`${this.state.count} min`}</Text>
              </View>
              <TouchableOpacity
                onPress={() => this.addTime()}
                disabled={this.state.disabled}>
                <Ionicons name={'add'} color="white" size={24} />
              </TouchableOpacity>
            </View>
          </View>
        </GradientLayout>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  circleBorder: {
    borderColor: 'white',
    borderWidth: 1,
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  breatheText: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 6,
    fontSize: 16,
  },
});

export default RecordScreen;
