app = angular.module('heartbeat.family', []);

app.controller('familyCtrl', function($scope, $window, familyFactory){
  $scope.family = {};

  $scope.getNames = function(){
    var item = $window.localStorage.getItem('heartBeat');
    familyFactory.getFamilyNames(item).then(function(res){
      $scope.family = res
    })
  }
$scope.getNames()
  //call the get function and push the names into '$scope.names'

  //ng click call a function that changes $scope.selectedPerson
    // if the selected person in the same as the current change selected person to everyone
});

app.factory('familyFactory', function($http){
// create a get function that gets all the names on the database 
  var getFamilyNames = function(id){

    return $http({
      type: "GET",
      url: '/api/family/' + id
    }).then(function(res){
      return res.data
    })
  }

  return {
    getFamilyNames: getFamilyNames
  }

})
