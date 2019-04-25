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
  AsyncStorage, 
  ActivityIndicator } from 'react-native';
import uuid from 'uuid';
import { Constants, Google, ImagePicker, Permissions, SQLite } from 'expo';
import firebase from '../global/Firebase.js';

const db = SQLite.openDatabase('db.db');

export default class ReviewScreen extends React.Component {
  
  state = {
    count: 1,
    bio: '',
    bioReview: '',
    username: '',
    image: null,
    uploading: false,
  }

  handleBioReview = (text) => {
    this.setState({ bioReview: text })
  }

  increment = (num) => {
    console.log('num: ', num)

    //save bio review
    if (num != 1) {
      firebase.database().ref('profiles/' + this.state.username).set({
        feedback: this.state.bioReview
      });
    }

    //print review:
    db.transaction(
      tx => {
        tx.executeSql('select * from reviews where id = ?', [num], (tx, results) => {
          var length = results.rows.length;
          console.log('length: ', length);
          if (length > 0) {

            const reviewUsername = results.rows.item(0).username;

            firebase.database().ref('profiles/' + reviewUsername).on('value', (snapshot) => {
              const bio = snapshot.val().bio;
              const image = snapshot.val().image;
              this.setState({ bio: bio });
              this.setState({ image: image});
              this.setState({ username: reviewUsername});
            });
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
        'create table if not exists reviews (id integer primary key not null, username text);'
      );
    });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView>
          <View style={styles.top}>
              <Text style={styles.header}> review </Text>
          </View>

          <View style={styles.bottom}>
            <Text style={styles.title}>profile picture:</Text>
            {this._maybeRenderImage()}
            {this._maybeRenderUploadingOverlay()}            
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
        </ScrollView>
      </View>
    );
  }


  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'rgba(0,0,0,0.4)',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}>
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  _maybeRenderImage = () => {
    let { image } = this.state;
    if (!image) {
      console.log("why here?");
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
          <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
        </View>

        <Text
          style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
        </Text>
      </View>
    );
  };

  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };

  _handleImagePicked = async pickerResult => {
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        uploadUrl = await uploadImageAsync(pickerResult.uri);
        this.setState({ image: uploadUrl });
      }
    } catch (e) {
      console.log(e);
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({ uploading: false });
    }
  };
}

async function uploadImageAsync(uri) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function(e) {
      console.log(e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const ref = firebase
    .storage()
    .ref()
    .child(uuid.v4());
  const snapshot = await ref.put(blob);

  // We're done with the blob, close and release it
  blob.close();

  return await snapshot.ref.getDownloadURL();
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
