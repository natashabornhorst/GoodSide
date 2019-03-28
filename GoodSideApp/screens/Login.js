import React from 'react';
import { ScrollView, StyleSheet, Text, Button, View, AppRegistry, Image, TouchableOpacity } from 'react-native';
import { Google } from 'expo';

export default class Login extends React.Component {

  async signInWithGoogleAsync() {
    const clientId = '79508075920-ljds2o8adcjbh3qrsu477jiie951dd1g.apps.googleusercontent.com';
    const { type, accessToken, user } = await Google.logInAsync({ clientId });

    if (type === 'success') {
      /* `accessToken` is now valid and can be used to get data from the Google API with HTTP requests */
      this.props.navigation.navigate('Main');
      console.log(user);
    }
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
          <TouchableOpacity 
            onPress={this.signInWithGoogleAsync.bind(this)}
            style={styles.button}>
            <Text style={styles.text}> Sign In </Text>
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
  },
  text: {
    color: '#fff',
  }
});
