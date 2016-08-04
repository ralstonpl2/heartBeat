app = angular.module('heartbeat.family', []);

app.controller('familyCtrl', function($scope, $window, familyFactory){
  $scope.names = {};

  $scope.getNames = function(){
    console.log($window.localStorage.getItem('heartBeat'))
    var familyObj = familyFactory.getFamilyNames($window.localStorage.getItem('heartBeat'))
    console.log(familyObj)
  }

  //call the get function and push the names into '$scope.names'

  //ng click call a function that changes $scope.selectedPerson
    // if the selected person in the same as the current change selected person to everyone
})

app.factory('familyFactory', function($http){
// create a get function that gets all the names on the database 
  var getFamilyNames = function(id){

    return $http({
      type: "GET",
      url: '/api/family/' + id
    }).then(function(res){
      console.log(res)
      return res
    })
  }

  return {
    getFamilyNames: getFamilyNames
  }

})
