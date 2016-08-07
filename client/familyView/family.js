app = angular.module('heartbeat.family', []);

app.controller('familyCtrl', function($rootScope, $scope, $window, $uibModal, $location, familyFactory, familyIdFactory){
  $scope.family = {};

//get the names will get the info of all the objects from echa family memeber so we can display the data in the family list
  $scope.getNames = function(){
    var item = $window.localStorage.getItem('heartBeat');
    familyFactory.getFamilyNames(item).then(function(res){
      $scope.family = res
      console.log(res)
    })
  }
  $scope.getNames()

  $scope.open = function(familyId){

    familyIdFactory.set(familyId);
    
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '../actionView/action.html' ,
      controller: 'actionCtrl'
    });
  }

  $scope.openAddLovedOne = function(){

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: '../newFamilyMemberView/newFamilyMember.html' ,
      controller: 'memberCtrl'
    });
  };

  //ng click call a function that changes $scope.selectedPerson
    // if the selected person in the same as the current change selected person to everyone
});

app.factory('familyIdFactory', function(){

  var savedData = {};

  function set(data){
    savedData = data;
  }

  function get(){
    return savedData;
  }

  return {
    set: set,
    get: get
  }

})


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
