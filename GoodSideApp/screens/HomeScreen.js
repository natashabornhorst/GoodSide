import React from 'react';
import { Google } from 'expo';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  AsyncStorage,
  FlatList } from 'react-native';
import { WebBrowser, Constants } from 'expo';
import firebase from '../global/Firebase.js';

import { MonoText } from '../components/StyledText';


export default class HomeScreen extends React.Component {
  state = {
    username: '',
    bioreviews: [],
    image: null,
  }
  static navigationOptions = {
    header: null,
  };

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('username');
      if (value !== null) {
        // We have data!!
        this.setState({ username: value})
        console.log("this.state.username: ", this.state.username);
      }
      firebase.database().ref('users/' + this.state.username).on('value', (snapshot) => {
        const image = snapshot.val().image;
        this.setState({ image: image});
      });

    } catch (error) {
      // Error retrieving data
    }
  } 

  showReviews = () => {
    var feedback;

    firebase.database().ref('profiles/' + this.state.username).on('value', (snapshot) => {

        if (snapshot.val() != null) {
          feedback = snapshot.val().feedback;
        } else {
          feedback = "no feedback yet :("
        }
    });

    return (
      <Text> { feedback } </Text>
    );

  }

  showPoints = () => {
    var points;

    firebase.database().ref('users/' + this.state.username).on('value', (snapshot) => {

        if (snapshot.val() != null) {
          points = snapshot.val().points;
          console.log("points: ", points);
        } else {
          points = 0;
        }
    });

    return (
      <Text style={styles.pText}> Points: {points} </Text>
    );

  }

  componentDidMount() {
    this._retrieveData();
  }

  render() {
    let { image } = this.state;
    return (
      <View style={styles.container}>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          flexWrap: 'wrap',
          alignItems: 'stretch',}}>
          <View style={{marginLeft: 100, marginTop: 50}}>
            {this._maybeRenderImage()}
          </View>

          <View style={styles.getStartedContainer}>
            <Text style={styles.headerText}>
              {this.state.username}
            </Text>
          </View>
        </View>
        { this.showPoints() }
        <View style={styles.bottom}>
          <TouchableOpacity
            onPress={() => this.showReviews()}
            style={styles.button}>
            <Text style={styles.text}> See Reviews </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Login')} 
            style={styles.buttonWhite}>
            <Text style={styles.textYellow}> Sign Out </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }


  _maybeRenderImage = () => {
    let { image } = this.state;
    if (!image) {
      return;
    }

    return (
      <View
        style={{
          marginTop: 30,
          width: 250,
          borderRadius: 3,
          elevation: 2,
        }}>
        <View
          style={{
            borderTopRightRadius: 3,
            borderTopLeftRadius: 3,
            shadowColor: 'rgba(0,0,0,1)',
            shadowOpacity: 0.2,
            shadowOffset: { width: 4, height: 4 },
            shadowRadius: 5,
            overflow: 'hidden',
          }}>
          <Image source={{ uri: image }} style={{width: 150, height: 150, borderRadius: 150/ 2}}  />
        </View>

        <Text
          style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
        </Text>
      </View>
    );
  };

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#f8cc1f',
    width: 300,
    height: 50,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  buttonWhite: {
    backgroundColor: '#fff',
    width: 300,
    height: 50,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#f8cc1f',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  text: {
    color: '#fff',
  },
  bottom: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  headerText: {
    fontSize: 30,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 34,
    textAlign: 'center',
  },
  pText: {
    fontSize: 20,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  textYellow: {
    color: '#f8cc1f',
  },
});
