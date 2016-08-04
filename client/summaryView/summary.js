app = angular.module('heartbeat.summary', []);

app.controller('summaryCtrl', function($scope, $window, summaryFactory){

  $scope.obj =[]
  $scope.getFamilyobj = function(id){
    var item = $window.localStorage.getItem('heartBeat');
    summaryFactory.getFamily(item).then(function(res){

      for (var i = 0; i < res.length; i++) {
        var arr = [];
        arr.push(res[i].firstName)
        var temp = res[i].history;
        for (var j = 0; j < temp.length; j++) {
          arr.push(temp[j].points)
        }
        $scope.obj.push(arr)
      }
    })
  }
  $scope.getFamilyobj()
  //if everybody call makeLineChart else call makeDonutChart
  setTimeout(function () {
    summaryFactory.makeLineChart($scope.obj)
  }, 200)

});


app.factory('summaryFactory', function($http){
  
  var makeLineChart = function(data){
    var chart =  c3.generate({
      bindto:'#chart',
      data: {
        columns: data,
        type: 'spline'
      }
    });
  }

  var getFamily = function(id){
    return $http({
      type: "GET",
      url: '/api/family/' + id
    }).then(function(res){
      return res.data
    })
  }

//if selected person is everybody get all the points else just one person points 


  return {
    makeLineChart: makeLineChart,
    getFamily: getFamily
  }
})
