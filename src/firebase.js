// src/firebase.js
import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyCmFg7u8Ardh1VWu-U5zZhlIIUFBTyJk1o",
    authDomain: "supertodo-94ebe.firebaseapp.com",
    databaseURL: "https://supertodo-94ebe.firebaseio.com",
    projectId: "supertodo-94ebe",
    storageBucket: "",
    messagingSenderId: "391223821191"
  };

firebase.initializeApp(config);
export const provider = new firebase.auth.GoogleAuthProvider();
export default firebase;
