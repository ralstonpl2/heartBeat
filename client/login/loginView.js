app = angular.module('heartbeat.login', []);

app.controller('loginCtrl', function($scope, $http, $window, $location){
  $scope.data = {};

  $scope.testFunc = function(text1, text2){
    $scope.showLoginError = false;
    if(!$scope.login.username || !$scope.login.password){
      $scope.showLoginError = true;
      $scope.errorMessage = "Please provide a username and password."
      $window.alert($scope.errorMessage);;
    } else {
      return $http({
        method : 'GET',
        url : '/api/user/' + $scope.login.username + '/' + $scope.login.password,
      }).then(function(res){
        console.log(res);
        //save user id in local storage
        $window.localStorage.setItem('heartBeat',res.data);

        if(res.data.length){
          //a user profile was returned, so forward them to their dashboard

          //emit login event so familyController can fetch data
          $scope.$emit('login');        
          console.log('changing location')

          //emit an event to the parent familyController to display the usernaem on login
          $scope.$emit('userLoggedIn', $scope.login.userName);
          $location.path('/main');
        }
        //else no user object was returned, so keep here

      });

    }

    console.log(text1, text2);
  };

  $scope.testSignUp = function(text1, text2){
    $scope.showLoginError = false;
    if(!$scope.login.username || !$scope.login.password){
      $scope.showLoginError = true;
      $scope.errorMessage = "Please provide a username and password."
      $window.alert($scope.errorMessage);;
    } else {
      return $http({
        method : 'POST',
        url : '/api/user',
        data : {userName: text1, password:text2, family: null}  // {userName:"Lu-lu",password:"meowMeow"}
      });

    }

    console.log(text1, text2);
  }
})

