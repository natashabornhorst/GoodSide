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
  ActivityIndicator,
  Dimensions,
  Animated, 
  PanResponder } from 'react-native';
import uuid from 'uuid';
import { Constants, Google, ImagePicker, Permissions, SQLite } from 'expo';
import firebase from '../global/Firebase.js';

const db = SQLite.openDatabase('db.db');


const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
const Users = [
  { id: "1", text: "hot" },
  { id: "2", text: "boring" },
  { id: "3", text: "adventurous" },
  { id: "4", text: "artsy" },
  { id: "5", text: "fun" },
]

export default class ReviewScreen extends React.Component {
  
  state = {
    count: 1,
    bio: '',
    bioReview: '',
    username: '',
    image: null,
    uploading: false,
  }


  constructor() {
    super()

    this.position = new Animated.ValueXY()
    this.state = {
      currentIndex: 0
    }

    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp'
    })

    this.rotateAndTranslate = {
      transform: [{
        rotate: this.rotate
      },
      ...this.position.getTranslateTransform()
      ]
    }

    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    })
    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp'
    })

    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp'
    })
    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: 'clamp'
    })

  }
  componentWillMount() {
    this.PanResponder = PanResponder.create({

      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {

        this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
      },
      onPanResponderRelease: (evt, gestureState) => {

        if (gestureState.dx > 120) {
          Animated.spring(this.position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        }
        else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        }
        else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 4
          }).start()
        }
      }
    })
  }

  renderUsers = () => {
    console.log("currentIndex: ", this.state.currentIndex);
    if (this.state.currentIndex > 4) {
        return (
          <TouchableOpacity 
              onPress = {() => this.increment(this.state.count)}
              style={styles.button}>
              <Text style={styles.text}> next </Text>
          </TouchableOpacity>   
        );   
      }

    return Users.map((item, i) => {
      if (i < this.state.currentIndex) {
        return null
      } else if (i == this.state.currentIndex) {

        return (
          <Animated.View
            {...this.PanResponder.panHandlers}
            key={item.id} style={[this.rotateAndTranslate, { height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]}>
            <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 5, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 15, fontWeight: '800', padding: 10 }}>YES</Text>

            </Animated.View>

            <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 210, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 15, fontWeight: '800', padding: 10 }}>NO</Text>

            </Animated.View>

            <View style={styles.card}>
              <Text style={styles.textBig}>{item.text}</Text>
            </View>

          </Animated.View>
        )
      }
      else {
        return (
          <Animated.View

            key={item.id} style={[{
              opacity: this.nextCardOpacity,
              transform: [{ scale: this.nextCardScale }],
              height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute'
            }]}>
            <Animated.View style={{ opacity: 0, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 15, fontWeight: '800', padding: 10 }}>YES</Text>
            </Animated.View>

            <Animated.View style={{ opacity: 0, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 15, fontWeight: '800', padding: 10 }}>NO</Text>

            </Animated.View>

            <View style={styles.card}>
              <Text style={styles.textBig}>{item.text}</Text>
            </View>

          </Animated.View>
        )
      }
    }).reverse()
  }

  handleBioReview = (text) => {
    this.setState({ bioReview: text })
  }

  increment = (num) => {
    console.log('num: ', num)

    //save bio review

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
  this.setState({ currentIndex: 0 });

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
      <ScrollView>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          flexWrap: 'wrap',
          alignItems: 'stretch',}}>
          <View style={{ height: 40, width: 400 }}/>
          <View style={{ height: 150, width: 150 }}>
            {this._maybeRenderImage()}
          </View>
          <View style={{ height: 40, width: 400 }}/>
          <Text style={styles.bio}>{this.state.bio}</Text>
          <View style={{ height: 20, width: 400 }}/>
          <Text style={styles.title}>do you think this person is...</Text>
          <View style={{ height: 150, width: 150 }} >
            {this.renderUsers()}
          </View>

        </View>
      </ScrollView>
    );
  }

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
          <Image source={{ uri: image }} style={{ width: 150, height: 150 }} />
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
    flexDirection: 'row',
    justifyContent: 'center',
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
  textBig: {
    color: '#fff',
    fontSize: 30
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#f8cc1f',
    width: 150,
    height: 150,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  }
});
