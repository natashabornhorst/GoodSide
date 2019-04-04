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
  TouchableOpacity } from 'react-native';
import { Google } from 'expo';
import { Constants, SQLite } from 'expo';

const db = SQLite.openDatabase('db.db');

export default class Login extends React.Component {
  state = {
    username: '',
    password: '',
  }

  handleUsername = (text) => {
    this.setState({ username: text })
  }
  handlePassword = (text) => {
    this.setState({ password: text })
  }

  signup = (username, password) => {
        // is text empty?
    if (username === null || username === '' || password === null || password === '') {
      return false;
    }

    db.transaction(
      tx => {
        tx.executeSql('insert into users (username, password) values (?, ?)', [username, password]);
        tx.executeSql('select * from users', [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );
      },
      null,
      this.update
    );
  }

  signin = (username, password) => {
        // is text empty?
    if (username === null || username === '') {
      alert('Please enter a username')
      return false;
    } else if (password === null || password === '') {
      alert('Please enter a password')
      return false;
    }

    db.transaction(
      tx => {
        tx.executeSql('select * from users where username = ? and password = ?', [username, password], (tx, results) => {
          var length = results.rows.length;
          console.log('length: ', length);
          if (length > 0) {
            this.props.navigation.navigate('Main');
          } else {
            alert('Wrong username or password');
          }
        })
      },
      null,
      this.update
    );
  }

  componentDidMount() {
    db.transaction(tx => {
      tx.executeSql(
        'create table if not exists users (id integer primary key not null, username text, password text);'
      );
    });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.top}>
          <Image
            source={require('../assets/images/GoodSideLogo.png')}
            style={styles.image}
          />
        </View>

        <View style={styles.bottom}>
          <Input onChangeText = {this.handleUsername} containerStyle={styles.inputField} shake={true} placeholder='email' rightIcon={{ type: 'font-awesome', name: 'envelope', color: '#f8cc1f' }}/>
          <Input onChangeText = {this.handlePassword} containerStyle={styles.inputField} shake={true} placeholder='password' rightIcon={{ type: 'font-awesome', name: 'lock', color: '#f8cc1f', size: 30 }}/>
          <TouchableOpacity 
            onPress = {() => this.signin(this.state.username, this.state.password)}
            style={styles.button}>
            <Text style={styles.text}> sign in </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress = {() => this.props.navigation.navigate('SignUp')}
            style={styles.buttonWhite}>
            <Text style={styles.textYellow}> sign up </Text>
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
  },
  bottom: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputField: {
    marginBottom: 30,
  },
  image: {
    flex: 1,
    width: 300,
    height: 300,
    resizeMode: 'contain',
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
  textYellow: {
    color: '#f8cc1f',
  },
});
