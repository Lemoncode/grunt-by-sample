angular.module('mysample').component('loginForm', {
  templateUrl: '/login/components/loginForm.html',
  controllerAs: 'vm',
  bindings : { 
              doLogin : "&", // events
             },
 controller: function loginFormCtrl() {
    this.loginInfo = {
      user: '',
      password: ''
    };
 }              
});
