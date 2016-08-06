angular.module('heartbeat.newFamilyMember', [])

//sets up controller with the name 'memberCtrl', injects $scope and NewFamMem Factory into the controller as dependencies.
.controller('memberCtrl', function($scope, memberFactory, $window, $uibModalInstance){
  // Slider for the contact frequency.
  $scope.member = {};
  

  $scope.saveMember = function(){
    if($scope.member.firstName === undefined || $scope.member.lastName === undefined || $scope.member.relationship === undefined){
      console.log('please fill all the required fields')
    }else{
      var userId = $window.localStorage.getItem('heartBeat');
      memberFactory.post(userId, $scope.member).then(function(res){
        console.log(res);
      })
      $uibModalInstance.close();
    }
  }

  $scope.cancel = function(){
      $uibModalInstance.dismiss();

  }

})

.factory('memberFactory',function($http){
  var post = function(userId, data){
    return $http({
    method: 'POST',
    url: '/api/family/' + userId ,
    data: data
  }).then(function(res){
    return res.data;
  })
}

  return{
    post : post
  }
});
