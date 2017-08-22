function authRoot($firebaseAuth, $state) {
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
}

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
        resolve: { currentAuth: ['$firebaseAuth', '$state', authRoot] },
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
      .state('resetpassword', {
        url: '/resetpassword',
        templateUrl: 'templates/resetPassword.html',
        controller: 'ResetPasswordCtrl as reset',
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
        templateUrl: 'templates/superadmin/dashboard/dashboard.html',
        // controller: 'DashCtrl as dash',
        resolve: { currentAuth: ['$firebaseAuth', '$state', authSuperAdmin] },
        cache: true,
      })
      .state('superadmin-warung', {
        url: '/super-admin-warung',
        templateUrl: 'templates/superadmin/warung/warung.html',
        controller: 'SuperAdmin_WarungCtrl as warung',
        resolve: { currentAuth: ['$firebaseAuth', '$state', authSuperAdmin] },
        cache: true,
      })
      .state('superadmin-makanan', {
        url: '/super-admin-makanan',
        templateUrl: 'templates/superadmin/makanan/makanan.html',
        controller: 'SuperAdmin_MakananCtrl as makanan',
        resolve: { currentAuth: ['$firebaseAuth', '$state', authSuperAdmin] },
        cache: true,
      })
      .state('superadmin-profile', {
        url: '/super-admin-profile',
        templateUrl: 'templates/superadmin/profile/profile.html',
        controller: 'SuperAdmin_ProfileCtrl as profile',
        resolve: { currentAuth: ['$firebaseAuth', '$state', authSuperAdmin] },
        cache: true,
      })

      // admin warung
      .state('adminwarung-dashboard', {
        url: '/admin-warung-dashboard',
        templateUrl: 'templates/adminwarung/dashboard/dashboard.html',
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
      })
      .state('adminwarung-profile', {
        url: '/admin-warung-profile',
        templateUrl: 'templates/adminwarung/profile/profile.html',
        controller: 'AdminWarung_ProfileCtrl as profile',
        resolve: { currentAuth: ['$firebaseAuth', '$state', authAdminWarung] },
        cache: true,
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/iamlost');
  }]);
