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
  	count: 1,
  	bio: ''
  }

  increment = (num) => {
  	console.log('num: ', num)
    //print review:
    db.transaction(
      tx => {
        tx.executeSql('select bio from reviews where id = ?', [num], (tx, results) => {
          var length = results.rows.length;
          console.log('length: ', length);
          if (length > 0) {
          	console.log('bio: ', JSON.stringify(results.rows.item(0)))
          	this.setState({ bio: JSON.stringify(results.rows.item(0)) })
          } else {
            alert('No more reviews :(');
          }
        })
      },
      null,
      this.update
    );
	this.setState(prevState => ({ count: prevState.count + 1 }));
  }

  componentDidMount() {
    this.setState({ count: 1 })
    this.increment(this.state.count)
    db.transaction(tx => {
      tx.executeSql(
        'create table if not exists reviews (id integer primary key not null, bio text, pic text);'
      );
    });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.top}>
            <Text style={styles.header}> review </Text>
        </View>

        <View style={styles.bottom}>
         	<Text>{this.state.bio}</Text>
         	<TouchableOpacity 
            	onPress = {() => this.increment(this.state.count)}
            	style={styles.button}>
            	<Text style={styles.text}> next </Text>
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
