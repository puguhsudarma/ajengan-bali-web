app
  .controller('navCtrl', ['$scope', '$mdSidenav', function ($scope, $mdSidenav) {
    $scope.openLeftMenu = function () {
      $mdSidenav('left').toggle();
    };
  }])
  .controller('sideBarCtrl', ['$scope', '$state', 'AuthService', function ($scope, $state, AuthService) {
    function logout() {
      return AuthService.logout()
        .then(() => $state.go('login'))
        .catch(() => { });
    };

    if (localStorage.getItem('level') === '0') {
      $scope.menuList = [
        {
          click: () => $state.go('superadmin-dashboard'),
          icon: 'link',
          text: 'Dashboard',
        },
        {
          click: () => logout(),
          icon: 'exit to app',
          text: 'Logout',
        },
      ];
    } else {
      $scope.menuList = [
        {
          click: () => $state.go('adminwarung-dashboard'),
          icon: 'home',
          text: 'Dashboard',
        },
        {
          click: () => $state.go('adminwarung-warung'),
          icon: 'restaurant',
          text: 'Data Warung',
        },
        {
          click: () => $state.go('adminwarung-makanan'),
          icon: 'restaurant_menu',
          text: 'Data Makanan',
        },
        {
          click: () => $state.go('adminwarung-profile'),
          icon: 'account_circle',
          text: 'Profil Akun',
        },
        {
          click: () => logout(),
          icon: 'exit_to_app',
          text: 'Logout',
        },
      ];
    }
  }]);