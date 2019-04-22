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
import { WebBrowser, Constants, SQLite } from 'expo';

import { MonoText } from '../components/StyledText';

const db = SQLite.openDatabase('db.db');

export default class HomeScreen extends React.Component {
  state = {
    username: '',
    bioreviews: [],
  }
  static navigationOptions = {
    header: null,
  };

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('username');
      if (value !== null) {
        // We have data!!
        console.log(value);
        this.setState({ username: value})
      }
    } catch (error) {
      // Error retrieving data
    }
  } 

  showReviews = () => {
    db.transaction(
      tx => {
        tx.executeSql('select bioreview from feedback where username = ?', [this.state.username], (tx, results) => {
          var temp = [];
          var length = results.rows.length;
          console.log('length: ', length);
          for (let i = 0; i < length; i++) {
            console.log('bio review: ', results.rows.item(i).bioreview)
            temp.push(results.rows.item(i));
          }
          this.setState({
            bioreviews: temp,
          });
        })
      },
      null,
      this.update
    );
  }

  componentDidMount() {
    this._retrieveData();
    db.transaction(tx => {
      tx.executeSql(
        'create table if not exists reviews (id integer primary key not null, username text, bio text, pic text);'
      );
      tx.executeSql(
        'create table if not exists feedback (id integer primary key not null, username text, bioreview text);'
      );
    });
  }

  render() {
    const name = this.props.navigation.getParam('name', 'no name');
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/robot-dev.png')
                  : require('../assets/images/robot-prod.png')
              }
              style={styles.welcomeImage}
            />
          </View>

          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>
              {name}
            </Text>
          </View>
        </ScrollView>

        <View style={styles.bottom}>
          <TouchableOpacity
            onPress={() => this.showReviews()} 
            style={styles.button}>
            <Text style={styles.text}> show reviews </Text>
          </TouchableOpacity>
          <FlatList
            data={this.state.bioreviews}
            ItemSeparatorComponent={this.ListViewItemSeparator}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View key={item.user_id} style={{ backgroundColor: 'white', padding: 20 }}>
                <Text>review: {item.bioreview}</Text>
              </View>
            )}
          />
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Login')} 
            style={styles.button}>
            <Text style={styles.text}> Sign Out </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
  getStartedText: {
    fontSize: 17,
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
});
