angular.module('starter.controllers', [])
// AUTH CONTROLLER
.controller('AuthController', function($scope, $http, $state, AuthenticationService) {
  // FALLBACK VARIABLES

  $scope.message = "";

  $scope.user = {
    username: null,
    password: null
  };

  // LOGIN FUNCTION
  $scope.login = function() {
    AuthenticationService.login($scope.user);
  };

  // REGISTER FUNCTION
  $scope.register = function() {

  };

  // FORGOT PASSWORD FUNCTION
  $scope.forgotPassword = function() {

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
        $state.go('admin-first-time', {}, {reload: true, inherit: false});
      } else {
        console.log('login-confirmed: redirect to admin.');
        $state.go('admin', {}, {reload: true, inherit: false});
      }
    } else {
      if(data.firstTime == true) {
        console.log('login-confirmed: redirect to user first time.');
        $state.go('user-first-time', {}, {reload: true, inherit: false});
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
  $scope.slideHasChanged = function(index) {

  };
})
// USER CONTROLLER
.controller('UserController', function($scope, $http, $state, AuthenticationService) {

});