'use strict';

angular.module('shopApp', ['ngResource'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/notes', {
        templateUrl: 'views/notes.html',
        controller: 'NotesCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

angular.module('shopApp', ['ngResource'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'BoardCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
