const config = {
  apiKey: "AIzaSyBWwqCf_9mPCGv4CNxnrZRkIRk-adpsyKs",
  authDomain: "ajengan-bali.firebaseapp.com",
  databaseURL: "https://ajengan-bali.firebaseio.com",
  projectId: "ajengan-bali",
  storageBucket: "ajengan-bali.appspot.com",
  messagingSenderId: "301126244495"
};
firebase.initializeApp(config);

// Declare app level module which depends on views, and components
angular.module('ajegliApp', [
  'ui.materialize',
  'datatables',
  'firebase',
  'ui.router',
  'ajegliApp.controllers',
  'ajegliApp.services'
])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state({
        url: '/',
        controller: 'RootCtrl as root'
      })

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl as login'
      })

      .state('dashboard', {
        url: '/dashboard',
        cache: true,
        templateUrl: 'templates/dashboard.html',
        controller: 'DashCtrl as dash'
      })

      .state('tickets', {
        url: '/tickets',
        cache: true,
        templateUrl: 'templates/tickets.html',
        controller: 'TicketsCtrl as tiket'
      })

      .state('chats', {
        url: '/chats',
        cache: true,
        templateUrl: 'templates/chats.html',
        controller: 'ChatsCtrl as chats'
      })

      .state('admin-dashboard', {
        url: '/admin-dashboard',
        cache: true,
        templateUrl: 'templates/admin-dashboard.html',
        controller: 'AdminDashCtrl as dash'
      })

      .state('admin-login', {
        url: '/admin-login',
        cache: true,
        templateUrl: 'templates/admin-login.html',
        controller: 'AdminLoginCtrl as login'
      })

      .state('signup', {
        url: '/signup',
        templateUrl: 'templates/signup.html',
        controller: 'SignupCtrl as su'
      })

      .state('media', {
        url: '/media',
        cache: true,
        templateUrl: 'templates/media.html',
        controller: 'MediaCtrl as media'
      })

      .state('calendar-events', {
        url: '/calendar-events',
        cache: true,
        templateUrl: 'templates/calendar-events.html',
        controller: 'CalCtrl as cal'
      })

      .state('finance', {
        url: '/finance',
        cache: true,
        templateUrl: 'templates/finance.html',
        controller: 'FinanceCtrl as finance'
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/dashboard');
  });
