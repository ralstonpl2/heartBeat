app = angular.module('heartbeat.login', []);

app.controller('loginCtrl', function($scope, loginService){
  $scope.data = {}
})

app.factory('loginService', function(){
  var testFunc = function(text1, text2){
    console.log(text1, text2)
    return $scope.data[text1] = {text1: [text1, text2]}
  }
  return {
    testFunc: testFunc
  }
})
