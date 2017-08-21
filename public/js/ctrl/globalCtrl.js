app
  .controller('navCtrl', ['$scope', '$mdSidenav', function ($scope, $mdSidenav) {
    $scope.openLeftMenu = function () {
      $mdSidenav('left').toggle();
    };
  }])
  .controller('sideBarCtrl', ['$scope', '$state', 'LoginService', function ($scope, $state, LoginService) {
    function logout() {
      return LoginService.logout()
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
          icon: 'link',
          text: 'Dashboard',
        },
        {
          click: () => $state.go('adminwarung-warung'),
          icon: 'link',
          text: 'Data Warung',
        },
        {
          click: () => $state.go('adminwarung-makanan'),
          icon: 'link',
          text: 'Data Makanan',
        },
        {
          click: () => logout(),
          icon: 'exit_to_app',
          text: 'Logout',
        },
      ];
    }
  }]);