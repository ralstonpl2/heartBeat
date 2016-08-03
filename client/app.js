var app = angular.module('heartbeat', ['heartbeat.login','heartbeat.family','heartbeat.summary', 'ui.router']);

app.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('/main', {
      url: '/main',
      templateUrl: 'main/main.html'
      // controller: 'mainCtrl'
    })
    .state('/login', {
      url: '/login',
      templateUrl: 'login/loginView.html',
      controller: 'loginCtrl'
    })

    $urlRouterProvider.otherwise('/login');

})


