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

export default class SignUpScreen extends React.Component {
  state = {
    name: '',
    username: '',
    password: '',
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

  signup = (name, username, password) => {
        // is text empty?
    if (username === null || username === '' || password === null || password === '') {
      return false;
    }

    db.transaction(
      tx => {
        tx.executeSql('insert into users (name, username, password) values (?, ?, ?)', [name, username, password]);
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
        'create table if not exists users (id integer primary key not null, name text, username text, password text);'
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
          <Input onChangeText = {this.handlePassword} containerStyle={styles.inputField} shake={true} placeholder='password' />
          <Input onChangeText = {this.handlePassword} containerStyle={styles.inputField} shake={true} placeholder='confirm password' />
          <TouchableOpacity 
            onPress = {() => this.signup(this.state.name, this.state.username, this.state.password)}
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