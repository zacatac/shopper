'use strict';

angular.module('shopApp', ['ngResource', 'ngCookies', 'ngRoute'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'BoardCtrl'
      })
      .when('/login/token=:token', {
        templateUrl: 'views/main.html',
        controller: 'BoardCtrl'
      })        
      .otherwise({
        redirectTo: '/'
      });
  }]);
