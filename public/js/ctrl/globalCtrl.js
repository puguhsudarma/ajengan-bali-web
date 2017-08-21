app
  .controller('navCtrl', ['$scope', '$mdSidenav', function ($scope, $mdSidenav) {
    $scope.openLeftMenu = function () {
      $mdSidenav('left').toggle();
    };
  }]);