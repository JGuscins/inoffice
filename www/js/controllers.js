angular.module('starter.controllers', [])
// AUTH CONTROLLER
.controller('AuthController', function($scope, $http, $state, AuthenticationService) {
  $scope.message = "";

  $scope.user = {
    username: null,
    password: null
  };
 
  // GET DATA FROM SCOPE
  $scope.login = function() {
    AuthenticationService.login($scope.user);
  };
 
  // LOG-IN REQUIRED
  $scope.$on('event:auth-loginRequired', function(e, rejection) {
    console.log('login-reqired.');
  });
 
  // LOG-IN SUCCESS
  $scope.$on('event:auth-loginConfirmed', function(header, data) {
    if(data.isAdmin == true) {
      if(data.firstTime == true) {
        console.log('login-confirmed: redirect to admin first time.');
        $state.go('admin-hello', {}, {reload: true, inherit: false});
      } else {
        console.log('login-confirmed: redirect to admin.');
        $state.go('admin', {}, {reload: true, inherit: false});
      }
    } else {
      if(data.firstTime == true) {
        console.log('login-confirmed: redirect to user first time.');
        $state.go('user-hello', {}, {reload: true, inherit: false});
      } else {
        console.log('login-confirmed: redirect to user.');
        $state.go('user', {}, {reload: true, inherit: false});
      }
    }
  });
  
  // LOG-IN FAIL
  $scope.$on('event:auth-login-failed', function(e, status) {
    $scope.message = 'Invalid Username or Password.';
  });
})
// ADMIN CONTROLLER
.controller('AdminController', function($scope, $http, $state, AuthenticationService) {

});