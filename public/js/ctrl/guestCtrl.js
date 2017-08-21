app
  .controller('LoginCtrl', ['$scope', '$state', 'LoginService', '$mdToast', function ($scope, $state, LoginService, $mdToast) {
    $scope.state = {
      loading: false,
    };

    $scope.tryLogin = function (data) {
      $scope.state.loading = true;
      LoginService
        .login(data.email, data.password)
        .then(() => LoginService.dataLogin())
        .then(data => {
          localStorage.setItem('uid', data.$id);
          localStorage.setItem('email', data.email);
          localStorage.setItem('nama', data.nama);
          localStorage.setItem('level', data.level);
          $scope.state.loading = false;
          if (data.level === 0) {
            return $state.go('superadmin-dashboard');
          }
          return $state.go('adminwarung-dashboard');
        })
        .catch(() => {
          $scope.state.loading = false;
          $mdToast.show(
            $mdToast.simple()
              .textContent('Pastikan email dan password sudah benar.')
              .position('top right')
              .hideDelay(4000)
          );
        });
    };
  }])

  .controller('SignUpCtrl', ['$scope', '$state', '$mdToast', 'SignUpService', 'LoginService', function ($scope, $state, $mdToast, SignUpService, LoginService) {
    // verify some fields
    $scope.state = {
      loading: false,
    };

    //sign it up
    $scope.signUp = function (data) {
      $scope.state.loading = true;
      const push = {
        nama: data.nama,
        alamat: data.alamat,
        telp: data.telp,
        username: data.username,
        email: data.email,
        password: data.password
      };
      SignUpService
        .signUp(push)
        .then(() => LoginService.login(data.email, data.password))
        .then(() => {
          localStorage.setItem('nama', data.nama);
          localStorage.setItem('level', '1');
          $scope.state.loading = false;
          $state.go('adminwarung-dashboard');
        })
        .catch(() => {
          $scope.state.loading = false;
          $mdToast.show(
            $mdToast.simple()
              .textContent('Terjadi kesalahan dalam pendaftaran akun.')
              .position('top right')
              .hideDelay(4000)
          );
        });
    };
  }]);