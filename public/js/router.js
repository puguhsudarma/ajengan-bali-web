function authGuest($firebaseAuth, $state) {
  return $firebaseAuth()
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
}

function authAdminWarung($firebaseAuth, $state) {
  return $firebaseAuth()
    .$waitForSignIn()
    .then(data => {
      if (data !== null) {
        if (localStorage.getItem('level') !== '1') {
          return $state.go('superadmin-dashboard');
        }
        return;
      }
      return $state.go('login');
    })
    .catch(err => $state.go('login'));
}

function authSuperAdmin($firebaseAuth, $state) {
  return $firebaseAuth()
    .$waitForSignIn()
    .then(data => {
      if (data !== null) {
        if (localStorage.getItem('level') !== '0') {
          return $state.go('adminwarung-dashboard');
        }
        return;
      }
      return $state.go('login');
    })
    .catch(err => $state.go('login'));
}

app
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
        resolve: { currentAuth: ['$firebaseAuth', '$state', authGuest] },
        cache: true,
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'templates/signup.html',
        controller: 'SignUpCtrl as signup',
        resolve: { currentAuth: ['$firebaseAuth', '$state', authGuest] },
        cache: true,
      })
      .state('lost', {
        url: '/iamlost',
        templateUrl: 'templates/404.html',
        cache: true,
      })

      // super admin
      .state('superadmin-dashboard', {
        url: '/super-admin-dashboard',
        templateUrl: 'templates/superadmin/dashboard.html',
        // controller: 'DashCtrl as dash',
        resolve: { currentAuth: ['$firebaseAuth', '$state', authSuperAdmin] },
        cache: true,
      })

      // admin warung
      .state('adminwarung-dashboard', {
        url: '/admin-warung-dashboard',
        templateUrl: 'templates/adminwarung/dashboard.html',
        // controller: 'DashCtrl as dash',
        resolve: { currentAuth: ['$firebaseAuth', '$state', authAdminWarung] },
        cache: true,
      })
      .state('adminwarung-warung', {
        url: '/admin-warung-warung',
        templateUrl: 'templates/adminwarung/warung/warung.html',
        controller: 'AdminWarung_WarungCtrl as warung',
        resolve: { currentAuth: ['$firebaseAuth', '$state', authAdminWarung] },
        cache: true,
      })
      .state('adminwarung-makanan', {
        url: '/admin-warung-makanan',
        templateUrl: 'templates/adminwarung/makanan/makanan.html',
        controller: 'AdminWarung_MakananCtrl as makanan',
        resolve: { currentAuth: ['$firebaseAuth', '$state', authAdminWarung] },
        cache: true,
      });;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/iamlost');
  }]);
