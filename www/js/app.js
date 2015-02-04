angular.module('starter', ['ionic', 'ngMockE2E', 'starter.controllers', 'starter.services'])
.run(function($rootScope, $ionicPlatform, $httpBackend, $http) {
  $httpBackend.whenPOST('https://login').respond(function(method, url, data) {
    var user = {
      username: angular.fromJson(data).user.username,
      password: angular.fromJson(data).user.password
    };

    // if data.status == true && data.type == 1
    // set uid
    // set first time or not
    if(user.username == 'admin') {
      window.localStorage.setItem("authorized", "true");
      window.localStorage.setItem("isAdmin", "true");
      window.localStorage.setItem("isUser", "false");
      window.localStorage.setItem("uid", "1");
      window.localStorage.setItem("firstTime", "true");

      return  [200, { authorized:true, isAdmin:true, isUser:false, firstTime: true }];
    // if data.status == true && data.type == 2
    // set uid
    // set first time or not
    } else if(user.username == 'user') {
      window.localStorage.setItem("authorized", "true");
      window.localStorage.setItem("isAdmin", "false");
      window.localStorage.setItem("isUser", "true");
      window.localStorage.setItem("uid", "1");
      window.localStorage.setItem("firstTime", "false");

      return  [200, { authorized:true, isAdmin:false, isUser:true, firstTime: false }];
    // if data.status == false
    } else {
      window.localStorage.removeItem("authorized");
      window.localStorage.removeItem("isAdmin");
      window.localStorage.removeItem("isUser");
      window.localStorage.removeItem("uid");
      window.localStorage.removeItem("firstTime");

      return  [400, { authorized:false, isAdmin:false, isUser:false, firstTime: false }];
    }
  });

  $httpBackend.whenGET(/.*/).passThrough();

  // BEFORE ROUTE FILTER
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    auth = {
      authorized: (window.localStorage.getItem("authorized") != null ? window.localStorage.getItem("authorized") : "false"),
      isAdmin:    (window.localStorage.getItem("isAdmin") != null ? window.localStorage.getItem("isAdmin") : "false"),
      isUser:     (window.localStorage.getItem("isUser") != null ? window.localStorage.getItem("isUser") : "false"),
      firstTime:  (window.localStorage.getItem("firstTime") != null ? window.localStorage.getItem("firstTime") : "false")
    };

    if(toState.data.accessLevel == 1) {
      if(auth.isAdmin == "false") {
        event.preventDefault();
      }
    } else if(toState.data.accessLevel == 2) {
      if(auth.isUser == "false") {
        event.preventDefault();
      }
    }
  });

  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  // AUTH ROUTES
  .state('auth', {
    url: "/auth",
    templateUrl: "templates/auth/login.html",
    controller: 'AuthController',
    data: {
      accessLevel: 0
    }
  })
  .state('auth-register', {
    url: "/auth-register",
    templateUrl: "templates/auth/register.html",
    controller: 'AuthController',
    data: {
      accessLevel: 0
    }  
  })
  .state('auth-forgot-password', {
    url: "/auth-password",
    templateUrl: "templates/auth/forgot-password.html",
    controller: 'AuthController',
    data: {
      accessLevel: 0
    }  
  })
  // USER ROUTES
  .state('user', {
    url: "/user",
    templateUrl: "templates/user/dashboard.html",
    controller: 'UserController',
    data: {
      accessLevel: 2
    }
  })
  .state('user-first-time', {
    url: "/user-first-time",
    templateUrl: "templates/user/first-time.html",
    controller: 'UserController',
    data: {
      accessLevel: 2
    }  
  })
  .state('user-settings', {
    url: "/user-settings",
    templateUrl: "templates/user/settings.html",
    controller: 'UserController',
    data: {
      accessLevel: 2
    }  
  })
  // ADMIN ROUTES
  .state('admin', {
    url: "/admin",
    templateUrl: "templates/admin/dashboard.html",
    controller: 'AdminController',
    data: {
      accessLevel: 1
    }
  })
  .state('admin-first-time', {
    url: "/admin-first-time",
    templateUrl: "templates/admin/first-time.html",
    controller: 'AdminController',
    data: {
      accessLevel: 1
    }   
  })
  .state('admin-settings', {
    url: "/admin-settings",
    templateUrl: "templates/admin/settings.html",
    controller: 'AdminController',
    data: {
      accessLevel: 1
    }   
  });

  // GET AUTH USER VALUES
  auth = {
    authorized: (window.localStorage.getItem("authorized") != null ? window.localStorage.getItem("authorized") : "false"),
    isAdmin:    (window.localStorage.getItem("isAdmin") != null ? window.localStorage.getItem("isAdmin") : "false"),
    isUser:     (window.localStorage.getItem("isUser") != null ? window.localStorage.getItem("isUser") : "false"),
    firstTime:  (window.localStorage.getItem("firstTime") != null ? window.localStorage.getItem("firstTime") : "false")
  };

  // PREPARE FIRST ROUTE
  if(auth.authorized == "false") {
    console.log('init: redirect to log in.');
    $urlRouterProvider.otherwise('/auth');
  } else if(auth.isAdmin == "true") {
    if(auth.firstTime == "true") {
      console.log('init: redirect to admin first time.');
      $urlRouterProvider.otherwise('/admin-first-time');
    } else {
      console.log('init: redirect to admin.');
      $urlRouterProvider.otherwise('/admin');
    }
  } else {
    if(auth.firstTime == "true") {
      console.log('init: redirect to user first time.');
      $urlRouterProvider.otherwise('/user-first-time');
    } else {
      console.log('init: redirect to user.');
      $urlRouterProvider.otherwise('/user');
    }
  }
});