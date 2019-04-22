import React from 'react';
import { Input, Icon } from 'react-native-elements'
import { 
  ScrollView, 
  StyleSheet, 
  Text, 
  Button, 
  View, 
  AppRegistry, 
  Image, 
  TouchableOpacity,
  AsyncStorage } from 'react-native';
import { Google } from 'expo';
import { Constants, SQLite } from 'expo';

const db = SQLite.openDatabase('db.db');

export default class SubmitReviewScreen extends React.Component {
  state = {
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  }

  handleBio = (text) => {
    this.setState({ bio: text })
  }
  handlePic = (text) => {
    this.setState({ pic: text })
  }

  submit = (bio, pic) => {
        // is text empty?
    if (bio === null || bio === '') {
      alert('Please enter a bio')
      return false;
    } else if (pic === null || pic === '') {
      alert('Please choose a pic')
      return false;
    } 

    db.transaction(
      tx => {
        tx.executeSql('insert into reviews (bio, pic, username) values (?, ?, ?)', [bio, pic, this.state.username]);
        tx.executeSql('select * from reviews', [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );
      },
      null,
      this.update
    );
    this.props.navigation.navigate('Main');
  }

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

  componentDidMount() {
    this._retrieveData();
    db.transaction(tx => {
      tx.executeSql(
        'create table if not exists reviews (id integer primary key not null, username text, bio text, pic text);'
      );
    });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.top}>
            <Text style={styles.header}> submit review </Text>
        </View>

        <View style={styles.bottom}>
          <Input onChangeText = {this.handleBio} containerStyle={styles.inputField} shake={true} placeholder='bio' />
          <Input onChangeText = {this.handlePic} containerStyle={styles.inputField} shake={true} placeholder='pic' />
          <TouchableOpacity 
            onPress = {() => this.submit(this.state.bio, this.state.pic)}
            style={styles.button}>
            <Text style={styles.text}> submit </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
AppRegistry.registerComponent('GoodSide', () => FlexDimensionsBasics);
AppRegistry.registerComponent('GoodSide', () => DisplayAnImage);
AppRegistry.registerComponent('GoodSide', () => JustifyContentBasics);

const styles = StyleSheet.create({
  top: {
    flex: 1,
    backgroundColor: '#f8cc1f',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50
  },
  bottom: {
    flex: 3,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputField: {
    marginBottom: 30,
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
  header: {
    color: '#fff',
    fontSize: 30
  },
  textYellow: {
    color: '#f8cc1f',
  },
});
