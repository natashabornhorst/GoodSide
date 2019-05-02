
import * as firebase from 'firebase';

let FirebaseConfig = {
    apiKey: "AIzaSyBlxeg5PtvKKfKoAWkOoNuGLTIaWt_7t98",
    authDomain: "goodside-5ec70.firebaseapp.com",
    databaseURL: "https://goodside-5ec70.firebaseio.com",
    projectId: "goodside-5ec70",
    storageBucket: "goodside-5ec70.appspot.com",
    messagingSenderId: "745455682461"
}

firebase.initializeApp(FirebaseConfig);

export default firebase;
