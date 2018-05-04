angular.module('mysample').component('loginContainer', {
  templateUrl: '/login/loginContainer.html',
  controllerAs: 'vm',
  controller: ['loginService', function(loginService) {
    this.signIn = function (user, password) {
      if (loginService.isValidLogin(user, password)) {
            console.log('LOGIN SUCCEEDED !!');
      } else {
          console.log('LOGIN Failed :-(');
      }        
    }
  }]
});