angular.module('mysample').component('panel', {
  templateUrl: '/login/components/panel.html',
  transclude: true,
  controllerAs: 'vm',
  bindings : { 
              heading : "@", // objects
             }
  }  
);