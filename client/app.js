var app = angular.module('heartbeat', ['heartbeat.login','heartbeat.family','heartbeat.action','heartbeat.summary', 'heartbeat.newFamilyMember', 'ui.router', 'ui.bootstrap', 'checklist-model']);

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

});
