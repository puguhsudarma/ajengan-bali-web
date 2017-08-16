app
  .controller('navController', ['$scope', '$mdSidenav', function ($scope, $mdSidenav) {
    $scope.openLeftMenu = function () {
      $mdSidenav('left').toggle();
    };
  }]);