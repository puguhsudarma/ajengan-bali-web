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
  'ajegliApp.rootControllers',
  'ajegliApp.superAdminControllers',
  'ajegliApp.services'
])
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    // guest (Root)
    $stateProvider
      .state('root', {
        url: '',
        resolve: {
          currentAuth: ['$firebaseAuth', '$state', function ($firebaseAuth, $state) {
            $firebaseAuth()
              .$waitForSignIn()
              .then(data => {
                if (data !== null) {
                  if (localStorage.getItem('level') === '0') {
                    return $state.go('superadmin-dashboard');
                  }
                  return $state.go('adminwarung-dashboard');
                }
                return $state.go('login');
              })
              .catch(err => $state.go('login'));
          }],
        },
        cache: true,
      })
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl as login',
        resolve: {
          currentAuth: ['$firebaseAuth', '$state', function ($firebaseAuth, $state) {
            $firebaseAuth()
              .$waitForSignIn()
              .then(auth => {
                if (auth !== null) {
                  if (localStorage.getItem('level') === '0') {
                    return $state.go('superadmin-dashboard');
                  }
                  return $state.go('adminwarung-dashboard');
                }
              })
              .catch(err => console.log(err));
          }],
        },
        cache: true,
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'templates/signup.html',
        controller: 'SignUpCtrl as signup',
        resolve: {
          currentAuth: ['$firebaseAuth', '$state', function ($firebaseAuth, $state) {
            $firebaseAuth()
              .$waitForSignIn()
              .then(auth => {
                if (auth !== null) {
                  if (localStorage.getItem('level') === '0') {
                    return $state.go('superadmin-dashboard');
                  }
                  return $state.go('adminwarung-dashboard');
                }
              })
              .catch(err => console.log(err));
          }],
        },
        cache: true,
      })
      .state('lost', {
        url: '/iamlost',
        templateUrl: 'templates/404.html',
        cache: true,
      })

      // super admin
      .state({
        name: 'superadmin-dashboard',
        url: '/super-admin-dashboard',
        templateUrl: 'templates/superadmin/dashboard.html',
        // controller: 'DashCtrl as dash',
        cache: false,
      })

      // admin warung
      .state('adminwarung-dashboard', {
        url: '/admin-warung-dashboard',
        templateUrl: 'templates/adminwarung/dashboard.html',
        // controller: 'DashCtrl as dash',
        cache: false,
      })
      .state('adminwarung-warung', {
        url: '/admin-warung-warung',
        templateUrl: 'templates/adminwarung/warung.html',
        // controller: 'DashCtrl as dash',
        cache: false,
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/iamlost');
  }]);
