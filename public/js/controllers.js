// root module control
app
  .controller('LoginCtrl', ['$scope', '$state', 'LoginService', function ($scope, $state, LoginService) {
    const e = angular.element(document.querySelector('#username'));
    const p = angular.element(document.querySelector('#password'));
    const el = angular.element(document.querySelector('#email-label'));
    const pl = angular.element(document.querySelector('#password-label'));

    $scope.tryLogin = function () {
      LoginService
        .login($scope.email, $scope.password)
        .then(() => LoginService.dataLogin())
        .then(data => {
          localStorage.setItem('uid', data.$id);
          localStorage.setItem('email', data.email);
          localStorage.setItem('nama', data.nama);
          localStorage.setItem('level', data.level);
          if (data.level === 0) {
            return $state.go('superadmin-dashboard');
          }
          return $state.go('adminwarung-dashboard');
        })
        .catch(() => {
          p.addClass('invalid');
          e.addClass('invalid');
          pl.attr('data-error', 'username or password wrong');
          el.attr('data-error', 'username or password wrong');
        });
    };
  }])

  .controller('SignUpCtrl', ['$scope', '$state', 'SignUpService', 'LoginService', function ($scope, $state, SignUpService, LoginService) {
    // populate information
    const state = {
      fields: {
        username: [
          angular.element(document.querySelector('#username')),
          angular.element(document.querySelector('#labelUsername')),
        ],
        email: [
          angular.element(document.querySelector('#email')),
          angular.element(document.querySelector('#labelEmail')),
        ],
        password: [
          angular.element(document.querySelector('#password')),
          angular.element(document.querySelector('#labelPassword')),
        ],
        cPassword: [
          angular.element(document.querySelector('#cPassword')),
          angular.element(document.querySelector('#labelCPassword')),
        ],
      },
      valid: {
        username: false,
        email: false,
        password: false,
        cPassword: false,
      },
    };

    // verify some fields
    $scope.field = {
      verifyUsername: function () {
        if ($scope.username === undefined) return 0;
        SignUpService.checkUniqueUsername($scope.username)
          .then(unique => {
            if (unique.val() !== null) {
              state.fields.username[0].removeClass("valid");
              state.fields.username[0].addClass("invalid");
              state.fields.username[1].attr('data-error', 'username already used.');
              state.valid.username = false;
              return 0;
            }

            if (state.valid.username === false) {
              state.valid.username = true;
              state.fields.username[0].removeClass("invalid");
              state.fields.username[0].addClass("valid");
              return 0;
            }
          })
          .catch(err => console.log(err));
      },
      verifyEmail: function () {
        if ($scope.email === undefined) return 0;
        SignUpService.checkUniqueEmail($scope.email)
          .then(unique => {
            if (unique.val() !== null) {
              state.fields.email[0].removeClass("valid");
              state.fields.email[0].addClass("invalid");
              state.valid.email = false;
              return 0;
            }

            if (state.valid.email === false) {
              state.valid.email = true;
              state.fields.email[0].removeClass("invalid");
              state.fields.email[0].addClass("valid");
              return 0;
            }
          })
          .catch(err => console.log(err));
      },
      verifyPassword: function () {
        if ($scope.password.length < 8) {
          state.fields.password[0].removeClass("valid");
          state.fields.password[0].addClass("invalid");
          state.valid.password = false;
          return 0;
        }

        if (state.valid.password === false) {
          state.valid.password = true;
          state.fields.password[0].removeClass("invalid");
          state.fields.password[0].addClass("valid");
          return 0;
        }
      },
      verifyCPassword: function () {
        if ($scope.password !== $scope.cPassword) {
          state.fields.cPassword[0].removeClass("valid");
          state.fields.cPassword[0].addClass("invalid");
          state.valid.cPassword = false;
          return 0;
        }

        if (state.valid.cPassword === false) {
          state.valid.cPassword = true;
          state.fields.cPassword[0].removeClass("invalid");
          state.fields.cPassword[0].addClass("valid");
          return 0;
        }
      },
    };

    //sign it up
    $scope.signUp = function () {
      const { cPassword, email, password, username } = state.valid;
      console.log(state.valid);
      if (username && email && password && cPassword) {
        const data = {
          nama: $scope.nama,
          alamat: $scope.alamat,
          telp: $scope.telp,
          username: $scope.username,
          email: $scope.email,
          password: $scope.password,
        };
        return SignUpService
          .signUp(data)
          .then(() => LoginService.login($scope.email, $scope.password))
          .then(() => {
            localStorage.setItem('nama', $scope.nama);
            localStorage.setItem('level', '1');
            return $state.go('adminwarung-dashboard');
          })
          .catch(err => console.log(err));
      }
      return 0;
    };
  }]);

// Super admin module control
app
  .controller('DashCtrl', function () {
  });

// Admin warung module control
app
  .controller('WarungDashCtrl', function () {
  })
  .controller('WarungWarungCtrl', ['$scope', 'WarungService', '$mdDialog', function ($scope, WarungService, $mdDialog) {
    $scope.state = {
      title: 'Data Warung',
      subtitle: 'Tabel data warung',
      act: 'read',
      data: null,
    };

    $scope.action = {
      add: function () {
        $scope.state.act = 'add';
        $scope.state.subtitle = 'Tambah data warung';
      },
      update: function () {
        $scope.state.act = 'update';
        $scope.state.subtitle = 'Update data warung';
      },
      back: function () {
        $scope.state.act = 'read';
        $scope.state.subtitle = 'Tabel data warung';
      },
    };

    WarungService
      .getWarungWhereOwner()
      .then(data => {
        console.log(data);
        $scope.state.data = data
      })
      .catch(err => $mdDialog.show(
        $mdDialog.alert({
          title: 'Attention',
          textContent: err,
          ok: 'Close',
        })
      ));
  }]);