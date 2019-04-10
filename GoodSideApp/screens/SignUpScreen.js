import React, { Component } from 'react';
import { Input, Icon } from 'react-native-elements'
import {
  ActivityIndicator,
  Button,
  Clipboard,
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,  
  AppRegistry, 
} from 'react-native';
import { Constants, ImagePicker, Permissions, SQLite } from 'expo';

const db = SQLite.openDatabase('db.db');

export default class SignUpScreen extends React.Component {
  state = {
    image: null,
    uploading: false,
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
  };

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
        tx.executeSql('insert into users (fullname, username, password) values (?, ?, ?)', [name, username, password]);
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
        'create table if not exists users (id integer primary key not null, fullname text, username text, password text);'
      );
    });
  }

  render() {
    let {
      image
    } = this.state;

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
          <Text> upload a picture </Text>
          <Icon type='font-awesome' name='upload' onPress={this._pickImage} color='#f8cc1f'/>
          {this._maybeRenderImage()}
          {this._maybeRenderUploadingOverlay()}
          <TouchableOpacity 
            onPress = {() => this.signup(this.state.name, this.state.username, this.state.password, this.state.confirmPassword)}
            style={styles.button}>
            <Text style={styles.text}> sign up </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[StyleSheet.absoluteFill, styles.maybeRenderUploading]}>
          <ActivityIndicator color="#fff" size="large" />
        </View>
      );
    }
  };

  _maybeRenderImage = () => {
    let {
      image
    } = this.state;

    if (!image) {
      return;
    }

    return (
      <View
        style={styles.maybeRenderContainer}>
        <View
          style={styles.maybeRenderImageContainer}>
          <Image source={{ uri: image }} style={styles.maybeRenderImage} />
        </View>
      </View>
    );
  };


  _pickImage = async () => {
    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // only if user allows permission to camera roll
    if (cameraRollPerm === 'granted') {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      this._handleImagePicked(pickerResult);
    }
  };

  _handleImagePicked = async pickerResult => {
    let uploadResponse, uploadResult;

    try {
      this.setState({
        uploading: true
      });

      if (!pickerResult.cancelled) {
        uploadResponse = await uploadImageAsync(pickerResult.uri);
        uploadResult = await uploadResponse.json();

        this.setState({
          image: uploadResult.location
        });
      }
    } catch (e) {
      console.log({ uploadResponse });
      console.log({ uploadResult });
      console.log({ e });
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({
        uploading: false
      });
    }
  };
}

async function uploadImageAsync(uri) {
  let apiUrl = 'http://goodsidebucket.s3.amazonaws.com';

  let uriParts = uri.split('.');
  let fileType = uriParts[uriParts.length - 1];

  let formData = new FormData();
  formData.append('photo', {
    uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`,
  });

  let options = {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  };

  return fetch(apiUrl, options);
}

AppRegistry.registerComponent('GoodSide', () => FlexDimensionsBasics);
AppRegistry.registerComponent('GoodSide', () => DisplayAnImage);
AppRegistry.registerComponent('GoodSide', () => JustifyContentBasics);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  exampleText: {
    fontSize: 20,
    marginBottom: 20,
    marginHorizontal: 15,
    textAlign: 'center',
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
