app
  .controller('LoginCtrl', ['$scope', '$state', 'AuthService', '$mdToast', function ($scope, $state, AuthService, $mdToast) {
    $scope.state = {
      loading: false,
    };

    $scope.tryLogin = function (data) {
      $scope.state.loading = true;
      AuthService
        .login(data.email, data.password)
        .then(() => AuthService.dataLogin())
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

  .controller('SignUpCtrl', ['$scope', '$state', '$mdToast', 'AuthService', function ($scope, $state, $mdToast, AuthService) {
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
        // image: 'https://firebasestorage.googleapis.com/v0/b/ajengan-bali.appspot.com/o/assets%2Fpic.png?alt=media&token=e505fe28-919a-463e-b174-a75c12d9c892',
        // nameImage: 'pic.png',
        softDelete: false,
        level: 1,
      };
      AuthService
        .signUp(data.email, data.password, push)
        .then(() => AuthService.login(data.email, data.password))
        .then(() => {
          localStorage.setItem('nama', data.nama);
          localStorage.setItem('level', '1');
          $scope.state.loading = false;
          $state.go('adminwarung-dashboard');
        })
        .catch(err => {
          $scope.state.loading = false;
          $mdToast.show(
            $mdToast.simple()
              .textContent(err)
              .position('top right')
              .hideDelay(4000)
          );
        });
    };
  }])

  .controller('ResetPasswordCtrl', ['$scope', '$state', 'AuthService', '$mdToast', function ($scope, $state, AuthService, $mdToast) {
    $scope.state = {
      loading: false,
    };

    $scope.resetPassword = function (data) {
      $scope.state.loading = true;
      AuthService
        .resetPassword(data.email)
        .then(() => {
          $scope.state.loading = false;
          $mdToast.show(
            $mdToast.simple()
              .textContent('Link reset password sudah dikirim ke email anda.')
              .position('top right')
              .hideDelay(4000)
          );
          $state.go('login');
        })
        .catch(() => {
          $scope.state.loading = false;
          $mdToast.show(
            $mdToast.simple()
              .textContent('Pastikan email sudah terdaftar.')
              .position('top right')
              .hideDelay(4000)
          );
        });
    };
  }]);