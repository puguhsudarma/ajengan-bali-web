// root module control
angular.module('ajegliApp.rootControllers', [])
  .controller('LoginCtrl', ['$scope', '$state', 'LoginService', function ($scope, $state, LoginService) {
    const e = angular.element(document.querySelector('#username'));
    const p = angular.element(document.querySelector('#password'));
    const el = angular.element(document.querySelector('#email-label'));
    const pl = angular.element(document.querySelector('#password-label'));

    $scope.tryLogin = function () {
      LoginService.login($scope.email, $scope.password)
        .then(() => LoginService.dataLogin())
        .then(data => {
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
angular.module('ajegliApp.superAdminControllers', [])
  .controller('DashCtrl', function ($scope, $state, $http, $filter, DashService, Backand) {

    if (localStorage.getItem('auth') == 'authorized') {

      const baseUrl = '/1/objects/';
      const baseActionUrl = baseUrl + 'action/';
      const objectName = 'tb_user';
      const filesActionName = 'imageUpload';

      const now = $filter('date')(new Date(), 'yyyy-MM-dd');
      const yest = $filter('date')(getYesterdayDate(new Date(), 1), 'yyyy-MM-dd');
      $scope.labels = [];
      $scope.data = [];
      $scope.lchart = true;
      const dateArray = [];

      for (i = 6; i > -1; i--) {
        dateArray.push($filter('date')(getYesterdayDate(new Date(), i), 'yyyy-MM-dd'));
        $scope.labels.push($filter('date')(getYesterdayDate(new Date(), i), 'EEE, d MMM yyyy'));
      }
      getChartData(6);

      const data = [];

      function getChartData(day) {
        if (day == -1) {
          $scope.data = data;
          $scope.lchart = false;
          return;
        }
        DashService.getSalesDate(localStorage.getItem('idUser'), $filter('date')(getYesterdayDate(new Date(), day), 'yyyy-MM-dd')).then(function (result) {
          data.push(result.data[0].sold);
          console.log(result.data[0].sold);
          getChartData(day - 1);
        });
      }

      console.log(dateArray);
      function getPDetail(id) {
        DashService.getPDetail(id).then(function (result) {
          $scope.PDetail = result.data[0];
          console.log(result.data);
        });
      }
      function imageChanged(fileInput) {

        const file = fileInput.files[0];
        const reader = new FileReader();
        const now = $filter('date')(new Date(), 'yyyy-MM-ddHH:mm:ss');
        const username = localStorage.getItem('idUser') + now;

        reader.onload = function (e) {
          upload(username, e.currentTarget.result).then(function (res) {
            localStorage.setItem('uploadUrl', username);
            DashService.updateUserImage(localStorage.getItem('idUser'), res.data.url).then(function (result) {
              getPDetail(localStorage.getItem('idUser'));
              $scope.uploading = false;
              ;

            });
          }, function (err) {
            alert(err.data);
          });
        };

        reader.readAsDataURL(file);
      }


      function initUpload() {
        const fileInput = document.getElementById('file');

        fileInput.addEventListener('change', function (e) {
          console.log(localStorage.getItem('uploadUrl'))
          //deleteFile(localStorage.getItem('uploadUrl'));
          $scope.uploading = true;
          imageChanged(fileInput);
        });
      }

      $scope.initCtrl = function () {
        initUpload();
        console.log('upload initiated');
      }


      function upload(filename, filedata) {
        return $http({
          method: 'POST',
          url: Backand.getApiUrl() + baseActionUrl + objectName,
          params: {
            'name': filesActionName
          },
          headers: {
            'Content-Type': 'application/json'
          },
          // you need to provide the file name and the file data
          data: {
            'filename': filename,
            'filedata': filedata.substr(filedata.indexOf(',') + 1, filedata.length) //need to remove the file prefix type
          }
        });
      }

      function getSalesDate() {

        DashService.getSalesDate(localStorage.getItem('idUser'), now).then(function (result) {
          $scope.today = result.data[0];
          const tsale = result.data[0].sold;
          console.log($scope.today);
          DashService.getSalesDate(localStorage.getItem('idUser'), yest).then(function (result) {
            $scope.yest = result.data;
            const ysale = result.data[0].sold;
            console.log(result.data);

            $scope.progress = (tsale - ysale);

            console.log(ysale);
            console.log(tsale);

          });
        });

        DashService.getSaleByType(localStorage.getItem('idUser'), now, 'admin').then(function (result) {
          $scope.admin = result.data[0].sold;
          const atsale = result.data[0].sold;
          DashService.getSaleByType(localStorage.getItem('idUser'), yest, 'admin').then(function (result) {

            const aysale = result.data[0].sold;
            $scope.aprogress = (atsale - aysale);
            console.log($scope.apogress);

          });
        });

        DashService.getSaleByType(localStorage.getItem('idUser'), now, 'tikettari').then(function (result) {
          $scope.tt = result.data[0].sold;
          const ttsale = result.data[0].sold;
          DashService.getSaleByType(localStorage.getItem('idUser'), yest, 'tikettari').then(function (result) {

            const tysale = result.data[0].sold;
            $scope.tprogress = (ttsale - tysale);
            console.log($scope.tpogress);

          });
        });


        console.log(now);
        console.log(yest);
      }

      getSalesDate();

      function getYesterdayDate(date, dayMin) {
        const resultDate = new Date(date.getTime());

        resultDate.setDate(date.getDate() - dayMin);

        return resultDate;
      }

      $scope.series = ['This Week Sales'];

      $scope.onClick = function (points, evt) {
        console.log(points, evt);
      };
      $scope.colors = ['#FFFFFF'];
      $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
      $scope.options = {
        scales: {
          yAxes: [
            {
              id: 'y-axis-1',
              type: 'linear',
              display: true,
              position: 'left'
            }
          ]
        }
      };

      $scope.logout = function () {
        $state.go('login');
        localStorage.setItem('idUser', null);
        localStorage.setItem('auth', 'unauthorized');
      };
      $scope.openDropdown = function () {
        $(function () {
          $('#dropdown').dropdown('open');
        });
      };

      $scope.openModal = function () {
        $(function () {
          $('#profile').openModal();
        });
      };
      getPDetail(localStorage.getItem('idUser'));
    }
    else {
      $state.go('login', { reload: true });
    }
  });

// Admin warung module control
angular.module('ajegliApp.superAdminControllers', [])
  .controller('DashCtrl', function ($scope, $state, $http, $filter, DashService, Backand) {

    if (localStorage.getItem('auth') == 'authorized') {

      const baseUrl = '/1/objects/';
      const baseActionUrl = baseUrl + 'action/';
      const objectName = 'tb_user';
      const filesActionName = 'imageUpload';

      const now = $filter('date')(new Date(), 'yyyy-MM-dd');
      const yest = $filter('date')(getYesterdayDate(new Date(), 1), 'yyyy-MM-dd');
      $scope.labels = [];
      $scope.data = [];
      $scope.lchart = true;
      const dateArray = [];

      for (i = 6; i > -1; i--) {
        dateArray.push($filter('date')(getYesterdayDate(new Date(), i), 'yyyy-MM-dd'));
        $scope.labels.push($filter('date')(getYesterdayDate(new Date(), i), 'EEE, d MMM yyyy'));
      }
      getChartData(6);

      const data = [];

      function getChartData(day) {
        if (day == -1) {
          $scope.data = data;
          $scope.lchart = false;
          return;
        }
        DashService.getSalesDate(localStorage.getItem('idUser'), $filter('date')(getYesterdayDate(new Date(), day), 'yyyy-MM-dd')).then(function (result) {
          data.push(result.data[0].sold);
          console.log(result.data[0].sold);
          getChartData(day - 1);
        });
      }

      console.log(dateArray);
      function getPDetail(id) {
        DashService.getPDetail(id).then(function (result) {
          $scope.PDetail = result.data[0];
          console.log(result.data);
        });
      }
      function imageChanged(fileInput) {

        const file = fileInput.files[0];
        const reader = new FileReader();
        const now = $filter('date')(new Date(), 'yyyy-MM-ddHH:mm:ss');
        const username = localStorage.getItem('idUser') + now;

        reader.onload = function (e) {
          upload(username, e.currentTarget.result).then(function (res) {
            localStorage.setItem('uploadUrl', username);
            DashService.updateUserImage(localStorage.getItem('idUser'), res.data.url).then(function (result) {
              getPDetail(localStorage.getItem('idUser'));
              $scope.uploading = false;
              ;

            });
          }, function (err) {
            alert(err.data);
          });
        };

        reader.readAsDataURL(file);
      }


      function initUpload() {
        const fileInput = document.getElementById('file');

        fileInput.addEventListener('change', function (e) {
          console.log(localStorage.getItem('uploadUrl'))
          //deleteFile(localStorage.getItem('uploadUrl'));
          $scope.uploading = true;
          imageChanged(fileInput);
        });
      }

      $scope.initCtrl = function () {
        initUpload();
        console.log('upload initiated');
      }


      function upload(filename, filedata) {
        return $http({
          method: 'POST',
          url: Backand.getApiUrl() + baseActionUrl + objectName,
          params: {
            'name': filesActionName
          },
          headers: {
            'Content-Type': 'application/json'
          },
          // you need to provide the file name and the file data
          data: {
            'filename': filename,
            'filedata': filedata.substr(filedata.indexOf(',') + 1, filedata.length) //need to remove the file prefix type
          }
        });
      }

      function getSalesDate() {

        DashService.getSalesDate(localStorage.getItem('idUser'), now).then(function (result) {
          $scope.today = result.data[0];
          const tsale = result.data[0].sold;
          console.log($scope.today);
          DashService.getSalesDate(localStorage.getItem('idUser'), yest).then(function (result) {
            $scope.yest = result.data;
            const ysale = result.data[0].sold;
            console.log(result.data);

            $scope.progress = (tsale - ysale);

            console.log(ysale);
            console.log(tsale);

          });
        });

        DashService.getSaleByType(localStorage.getItem('idUser'), now, 'admin').then(function (result) {
          $scope.admin = result.data[0].sold;
          const atsale = result.data[0].sold;
          DashService.getSaleByType(localStorage.getItem('idUser'), yest, 'admin').then(function (result) {

            const aysale = result.data[0].sold;
            $scope.aprogress = (atsale - aysale);
            console.log($scope.apogress);

          });
        });

        DashService.getSaleByType(localStorage.getItem('idUser'), now, 'tikettari').then(function (result) {
          $scope.tt = result.data[0].sold;
          const ttsale = result.data[0].sold;
          DashService.getSaleByType(localStorage.getItem('idUser'), yest, 'tikettari').then(function (result) {

            const tysale = result.data[0].sold;
            $scope.tprogress = (ttsale - tysale);
            console.log($scope.tpogress);

          });
        });


        console.log(now);
        console.log(yest);
      }

      getSalesDate();

      function getYesterdayDate(date, dayMin) {
        const resultDate = new Date(date.getTime());

        resultDate.setDate(date.getDate() - dayMin);

        return resultDate;
      }

      $scope.series = ['This Week Sales'];

      $scope.onClick = function (points, evt) {
        console.log(points, evt);
      };
      $scope.colors = ['#FFFFFF'];
      $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
      $scope.options = {
        scales: {
          yAxes: [
            {
              id: 'y-axis-1',
              type: 'linear',
              display: true,
              position: 'left'
            }
          ]
        }
      };

      $scope.logout = function () {
        $state.go('login');
        localStorage.setItem('idUser', null);
        localStorage.setItem('auth', 'unauthorized');
      };
      $scope.openDropdown = function () {
        $(function () {
          $('#dropdown').dropdown('open');
        });
      };

      $scope.openModal = function () {
        $(function () {
          $('#profile').openModal();
        });
      };
      getPDetail(localStorage.getItem('idUser'));
    }
    else {
      $state.go('login', { reload: true });
    }
  });