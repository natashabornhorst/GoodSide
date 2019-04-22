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
  TouchableHighlight,
  AsyncStorage } from 'react-native';
import { Google } from 'expo';
import { Constants, SQLite } from 'expo';

const db = SQLite.openDatabase('db.db');

export default class ReviewScreen extends React.Component {
  
  state = {
    count: 1,
    bio: '',
    bioReview: '',
    username: ''
  }

  handleBioReview = (text) => {
    this.setState({ bioReview: text })
  }

  increment = (num) => {
    console.log('num: ', num)

    //save bio review
    db.transaction(
      tx => {
        tx.executeSql('insert into feedback (username, bioreview) values (?, ?)', [this.state.username, this.state.bioReview]);
        tx.executeSql('select * from feedback', [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );
      },
      null,
      this.update
    );

    //print review:
    db.transaction(
      tx => {
        tx.executeSql('select * from reviews where id = ?', [num], (tx, results) => {
          var length = results.rows.length;
          console.log('length: ', length);
          if (length > 0) {
            console.log('bio: ', results.rows.item(0).bio)
            console.log('username from review: ', results.rows.item(0).username)
            this.setState({ bio: results.rows.item(0).bio })
            this.setState({ username: results.rows.item(0).username})
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
        'create table if not exists reviews (id integer primary key not null, username text, bio text, pic text);'
      );
      tx.executeSql(
        'create table if not exists feedback (id integer primary key not null, username text, bioreview text);'
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
          <Text style={styles.title}>bio:</Text>
          <Text style={styles.bio}>{this.state.bio}</Text>
          <Text style={styles.title}>please give feedback on this bio:</Text>
            <Input onChangeText = {this.handleBioReview} containerStyle={styles.inputField} shake={true} placeholder='start typing...' />
          <TouchableOpacity 
              onPress = {() => this.increment(this.state.count)}
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
    marginTop: 20
  },
  button: {
    backgroundColor: '#f8cc1f',
    width: 300,
    height: 50,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20
  },
  buttonWhite: {
    backgroundColor: '#fff',
    width: 100,
    height: 40,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#f8cc1f',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20
  },
  text: {
    color: '#fff',
  },
  header: {
    color: '#fff',
    fontSize: 30
  },
  title: {
    fontSize: 20,
    marginTop: 20,
  },
  bio: {
    borderRadius: 20,
    borderWidth: 0.2,
    borderColor: '#c4c7ce',
    marginTop: 20,
    padding: 15,
  },
  textYellow: {
    color: '#f8cc1f',
  },
});
