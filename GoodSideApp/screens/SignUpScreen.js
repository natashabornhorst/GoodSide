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

export default class SignUpScreen extends React.Component {
  state = {
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  }

  handleName = (text) => {
    this.setState({ name: text })
  }
  handleUsername = (text) => {
    this.setState({ username: text })
  }
  handlePassword = (text) => {
    this.setState({ password: text })
  }
  handleConfirmPassword = (text) => {
    this.setState({ confirmPassword: text })
  }

  signup = (name, username, password, confirmPassword) => {
        // is text empty?
    if (name === null || name === '') {
      alert('Please enter a full name')
      return false;
    } else if (username === null || username === '') {
      alert('Please enter a username')
      return false;
    } else if (password === null || password === '') {
      alert('Please enter a password')
      return false;
    } else if (password != confirmPassword) {
      alert('Your passwords did not match')
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
    this.props.navigation.navigate('Login');
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
            <Text style={styles.header}> sign up </Text>
        </View>

        <View style={styles.bottom}>
          <Input onChangeText = {this.handleName} containerStyle={styles.inputField} shake={true} placeholder='full name' />
          <Input onChangeText = {this.handleUsername} containerStyle={styles.inputField} shake={true} placeholder='email' />
          <Input secureTextEntry={true} onChangeText = {this.handlePassword} containerStyle={styles.inputField} shake={true} placeholder='password' />
          <Input secureTextEntry={true} onChangeText = {this.handleConfirmPassword} containerStyle={styles.inputField} shake={true} placeholder='confirm password' />
          <TouchableOpacity 
            onPress = {() => this.signup(this.state.name, this.state.username, this.state.password, this.state.confirmPassword)}
            style={styles.button}>
            <Text style={styles.text}> sign up </Text>
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
