(function () {
  'use strict';

  angular.module('mysample')
    .factory('loginService', loginService);

  function loginService() {
  
    function isValidLogin(user, password) {
    
      return (user === 'admin' && password === 'test');
    }

    return {
      isValidLogin: isValidLogin,
    }
  }
})();  
