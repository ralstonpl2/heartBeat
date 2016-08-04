app = angular.module('heartbeat.action', []);

app.controller('actionCtrl', function($scope, $window, actionFactory){

  $scope.actions = [
    'Called',
    'Texted',
    'Had Coffee',
    'Had Lunch or Dinner'
  ];

  $scope.user = {
    actions: []
  }

  $scope.sendAction = function(familyId){

    // var actionObj = { action: , points: }
    console.log('test')
    var userId = $window.localStorage.getItem('heartBeat');
    actionFactory.sendAction(userId, familyId).then(function(res){
      console.log(res);
      })
    }


})

app.factory('actionFactory', function($http){

  var sendAction = function(userId, familyId, data){

    return $http({
      method: POST,
      url: '/api/history/' + userId + '/' + familyId,
      data: data
    }).then(function(res){
      return res.data;
    })
  }

  return {

    sendAction: sendAction

  }

})

