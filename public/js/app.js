const config = {
  apiKey: "AIzaSyBWwqCf_9mPCGv4CNxnrZRkIRk-adpsyKs",
  authDomain: "ajengan-bali.firebaseapp.com",
  databaseURL: "https://ajengan-bali.firebaseio.com",
  projectId: "ajengan-bali",
  storageBucket: "ajengan-bali.appspot.com",
  messagingSenderId: "301126244495"
};

const fb = firebase.initializeApp(config);

// Declare app level module which depends on views, and components
const app = angular.module('ajegliApp', [
  'ngMaterial',
  'firebase',
  'md.data.table',
  'ui.router',
  'lfNgMdFileInput',
  // 'ngMap',
]);
