var app = angular.module('heartbeat', ['heartbeat.login', 'ui.router']);

app.config(function($stateProvider, $urlRouteProvider)){
  $stateProvider
    .state('/main', {
      url: '/main',
      templateUrl: 'main/main.html',
      controller: 'mainCtrl'
    })
    .state('/login', {
      url: '/login',
      templateUrl: 'login/loginView.html',
      controller: 'loginCtrl'
    })

    $urlRouterProvider.otherwise('/login');

}