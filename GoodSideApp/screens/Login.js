import React from 'react';
import { ScrollView, StyleSheet, Text, Button } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { Google } from 'expo';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Links',
  };

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
      <ScrollView style={styles.container}>
        <Button onPress={this.signInWithGoogleAsync.bind(this)}
                title='Google Sign In'/>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
