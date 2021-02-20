import React, {Component} from 'react';
import {Text, StyleSheet, View, Platform, TouchableOpacity} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Circle from '../components/Circle';
import GradientLayout from '../components/GradientLayout';
import Icon from '../components/Icon';

class PlayerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playTime: '00:00:00',
      fileName: 'record0',
      timer: 0,
      currentIcon: 'play',
    };
    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.09);
    this.breatheTimeInterval = '';
  }

  componentDidMount = () => {
    this.fetchFileName();
  };
  fetchFileName = async () => {
    const {fileName} = this.props.route.params;
    this.setState({fileName: fileName});
  };

  onStartPlay = async () => {
    console.log('onStartPlay');
    this.setState({currentIcon: 'pause'});
    const path = Platform.select({
      ios: `${this.state.fileName}.m4a`,
      android: `sdcard/${this.state.fileName}.mp4`,
    });
    const msg = await this.audioRecorderPlayer.startPlayer(path);
    this.audioRecorderPlayer.setVolume(1.0);
    this.audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.current_position === e.duration) {
        console.log('finished');
        this.onStopPlay();
      }
      this.setState({
        playTime: this.audioRecorderPlayer.mmssss(
          Math.floor(e.current_position),
        ),
        timer: Math.floor(e.current_position / 1000),
      });
    });
  };

  onPausePlay = async () => {
    await this.audioRecorderPlayer.pausePlayer();
    this.setState({currentIcon: 'play'});
  };

  onStopPlay = async () => {
    console.log('onStopPlay');
    this.setState({playTime: '00:00:00', currentIcon: 'replay'});
    await this.audioRecorderPlayer.stopPlayer();
    await this.audioRecorderPlayer.removePlayBackListener();
  };

  renderIcon = () => {
    let IconComponent;
    if (this.state.currentIcon === 'play') {
      IconComponent = (
        <Icon iconName="play-circle" iconAction={this.onStartPlay} />
      );
    } else if (this.state.currentIcon === 'pause') {
      IconComponent = (
        <Icon iconName="pause-circle" iconAction={this.onPausePlay} />
      );
    } else if (this.state.currentIcon === 'replay') {
      IconComponent = (
        <Icon iconName="reload-circle" iconAction={this.onStartPlay} />
      );
    }
    return IconComponent;
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <GradientLayout>
          <View style={{marginTop: 20, marginLeft: 10}}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Ionicons name={'chevron-back'} color="white" size={20} />
            </TouchableOpacity>
            <Text style={styles.breatheText}>Breathe</Text>
          </View>
          <View style={styles.container}>
            <Circle>{this.renderIcon()}</Circle>
            <Text style={{color: 'white', fontSize: 16}}>
              {this.state.timer}
            </Text>
          </View>
        </GradientLayout>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  breatheText: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 6,
    fontSize: 16,
  },
});

export default PlayerScreen;
