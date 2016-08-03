angular.module('heartBeat.newFamilyMember', ['rzModule', 'newFamilyMemberServices'])

//sets up controller with the name 'memberCtrl', injects $scope and NewFamMem Factory into the controller as dependencies.
.controller('memberCtrl', ['$scope', 'NewFamilyMemberFactory',
function($scope, NewFamilyMemberFactory){
  // Slider for the contact frequency.
  $scope.member = {};

    // Save family member to userId
    $scope.saveMember = function(){
      // Set values for next contact date and contact frequency
      $scope.member.nextContactDate = $scope.nextDate;

      // Save the new memberto the db
      NewFamilyMemberFactory.saveMember($scope.member)
      .then(function(data){
        // update the family View with the newly added member
        // format the next contact date
        data.nextContactDate = moment(data.nextContactDate).format('MMM DD YYYY');
        // Set points to zero
        data.points = 0;
        $scope.familyData.push(data);
        // Send the addFam update to the Parent controller
        $scope.$emit('addedFam');
      });
      // Empty out the form
      $scope.member = {};
      // Close the modal
      $scope.$parent.toggleModal();
    };

    // Waiting for braodcast from parent to add a new member
    $scope.$on('add', function(){
      $scope.savebtn = true;
      $scope.updatebtn = false;
      $scope.deletebtn = false;
      $scope.member = {};
    });


    // update member
    $scope.update = function(){
      $scope.member.nextContactDate = $scope.nextDate;
      $scope.member.contactFrequency = $scope.slider_toggle.value;

      NewFamilyMemberFactory.updateMember($scope.member)
      .then(function(data){
        $scope.$parent.toggleModal();
      });
    };

    // Waiting on braodcast for parent to update member
    $scope.$on('edit', function(){
      console.log(')_________)', $scope.activeFamilyMember );
      $scope.savebtn = false;
      $scope.updatebtn = true;
      $scope.deletebtn = true;
      $scope.member = $scope.activeFamilyMember;
    });

    // remove a member
    $scope.delete = function(){
      NewFamilyMemberFactory.deleteMember($scope.member)
      .then(function(data){
        console.log('emit fam delete');
        $scope.$emit('removeFam', $scope.member._id);
        $scope.$parent.toggleModal();
      }.bind($scope));
    };



}])
