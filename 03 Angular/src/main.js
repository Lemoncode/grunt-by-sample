angular.module('mysample', ['ngMessages']).controller('SampleCtrl', function ($scope) {
  $scope.testBinding = "Bindings up and running !!";

  $scope.login = {
    user: '',
    password: '',
  };

  $scope.onLogin = function() {
    if ($scope.login.user === 'admin' && $scope.login.password === 'test') {
      console.log('LOGIN SUCCEEDED');
    } else {
      console.log('LOGIN FAILED :-(');
    };    
  }
});
