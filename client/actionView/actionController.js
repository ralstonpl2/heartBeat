app = angular.module('heartbeat.action', []);

app.controller('actionCtrl', function($scope, $window, actionFactory, familyIdFactory){

  $scope.actions = [

    { action: 'Called' , points: 6 },
    { action: 'Texted', points: 3 },
    { action: 'Had Coffee', points: 8 },
    { action: 'Had a Meal', points: 10 }

  ];

  $scope.user = {
    actions: []
  }

  $scope.sendActionPoints = function(){

    var familyId = familyIdFactory.get();

    console.log('test')
    var userId = $window.localStorage.getItem('heartBeat');
    actionFactory.sendAction(userId, familyId, $scope.user.actions[0]).then(function(res){
      console.log(res);
    })
    $scope.toggleActionModal();
    // $uibModalInstance.close();
  }

    
})

app.factory('actionFactory', function($http){

  var sendAction = function(userId, familyId, data){

    return $http({
      method: 'POST',
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

