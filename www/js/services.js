angular.module('starter.services', ['http-auth-interceptor'])
// AUTH SERVICE
.factory('AuthenticationService', function($rootScope, $http, authService, $httpBackend) {
  var service = {
    login: function(user) {
      $http.post('https://login', { user: user }, { ignoreAuthModule: false })
      .success(function (data, status) {
        authService.loginConfirmed(data);
      })
      .error(function (data, status) {
        $rootScope.$broadcast('event:auth-login-failed', status);
      });
    }, 
    loginCancelled: function() {
      authService.loginCancelled();
    }
  };
  return service;
})