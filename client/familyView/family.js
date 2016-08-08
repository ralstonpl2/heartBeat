app = angular.module('heartbeat.family', []);

app.controller('familyCtrl', function($rootScope, $scope, $window, $location, familyFactory, familyIdFactory){
  $scope.family = {};

//get the names will get the info of all the objects from each family member so we can display the data in the family list
  $scope.getNames = function(){
    var item = $window.localStorage.getItem('heartBeat');
    familyFactory.getFamilyNames(item).then(function(res){
      $scope.family = res
      console.log(res)
    })
  }
  $scope.getNames();

  //toggle controls for newFamilyMemberView modal

  $scope.modalShown = false;
  $scope.toggleModal = function() {
    console.log('toggled')
    $scope.modalShown = !$scope.modalShown;
    console.log($scope.modalShown)
  };

  $scope.openAddLovedOne = function(){

    console.log('worked')

    $scope.toggleModal();

  };

  //toggle controls for actionView modal

  $scope.actionModalShown = false;
  $scope.toggleActionModal = function() {
    console.log('toggled actionModal')
    $scope.actionModalShown = !$scope.actionModalShown;
    console.log($scope.actionModalShown)
  };

  $scope.open = function(familyId){

    familyIdFactory.set(familyId);

    $scope.toggleActionModal();

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

//custom directive to create the modal popup for newFamilyMemberView

app.directive('modalDialog', function() {
  return {
   restrict: 'E',
   scope: {
     show: '='
   },
   replace: true, // Replace with the template below
   transclude: true, // we want to insert custom content inside the directive
   link: function(scope, element, attrs) {
     scope.dialogStyle = {};
     if (attrs.width)
       scope.dialogStyle.width = attrs.width;
     if (attrs.height)
       scope.dialogStyle.height = attrs.height;
     scope.hideModal = function() {
       scope.show = false;
     };
   },
   template: "<div class='ng-modal' ng-show='show'> <div class='ng-modal-overlay' ng-click='hideModal()'></div> <div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='hideModal()'>X</div><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
 };
})


app.directive('actionModal', function() {
  return {
   restrict: 'E',
   scope: {
     show: '='
   },
   replace: true, // Replace with the template below
   transclude: true, // we want to insert custom content inside the directive
   link: function(scope, element, attrs) {
     scope.dialogStyle = {};
     if (attrs.width)
       scope.dialogStyle.width = attrs.width;
     if (attrs.height)
       scope.dialogStyle.height = attrs.height;
     scope.hideModal = function() {
       scope.show = false;
     };
   },
   template: "<div class='ng-modal' ng-show='show'> <div class='ng-modal-overlay' ng-click='hideModal()'></div> <div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='hideModal()'>X</div><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
 };
})
