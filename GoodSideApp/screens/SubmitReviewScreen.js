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
  AsyncStorage,
  ActivityIndicator,
 } from 'react-native';
import uuid from 'uuid';
import { Constants, Google, ImagePicker, Permissions, SQLite } from 'expo';
import firebase from '../global/Firebase.js';

const db = SQLite.openDatabase('db.db');

export default class SubmitReviewScreen extends React.Component {
  state = {
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    image: null,
    uploading: false,
  }

  handleBio = (text) => {
    this.setState({ bio: text })
  }

  submit = () => {
        // is text empty?
    if (this.state.bio === null || this.state.bio === '') {
      alert('Please enter a bio')
      return false;
    } else if (this.state.image === null || this.state.image === '') {
      alert('Please choose a pic')
      return false;
    }

    console.log("username: ", this.state.username);
    db.transaction(
      tx => {
        tx.executeSql('insert into reviews (username) values (?)', [this.state.username]);
        tx.executeSql('select * from reviews', [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );
      },
      null,
      this.update
    ); 

    firebase.database().ref('profiles/' + this.state.username).set({
      bio: this.state.bio,
      image: this.state.image
    });
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

  async componentDidMount() {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
    this._retrieveData();

    db.transaction(tx => {
      tx.executeSql(
        'create table if not exists reviews (id integer primary key not null, username text);'
      );
    });
  }

  render() {
  let { image } = this.state;

    return (
      <View style={{flex: 1}}>
        <ScrollView>
          <View style={styles.top}>
              <Text style={styles.header}> submit review </Text>
          </View>

          <View style={styles.bottom}>
            <Input onChangeText = {this.handleBio} containerStyle={styles.inputField} shake={true} placeholder='bio' />
            <Text> upload a picture </Text>
            <Icon type='font-awesome' name='upload' onPress={this._pickImage} color='#f8cc1f'/>
            {this._maybeRenderImage()}
            {this._maybeRenderUploadingOverlay()}          
            <TouchableOpacity 
              onPress = {() => this.submit()}
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

        <Text style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
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
  maybeRenderUploading: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
  },
  maybeRenderImageContainer: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    overflow: 'hidden',
  },
  maybeRenderImage: {
    height: 50,
    width: 50,
  },
});
