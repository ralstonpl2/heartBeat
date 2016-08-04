app = angular.module('heartbeat.summary', []);

app.controller('summaryCtrl', function($scope, summaryFactory){


//if everybody call makeLineChart else call makeDonutChart

summaryFactory.makeLineChart([
           ['Garlos', 30, 200, 100, 400, 150, 250],
           ['Ral-Ral', 50, 20, 10, 40, 15, 100],
           ['Lu-Lu', 100, 300, 0 ]
       ])
})

app.factory('summaryFactory', function(){
  var makeLineChart = function(data){
    var chart =  c3.generate({
      bindto:'#chart',
      data: {
        columns: data
      }
    });
  }

//if selected person is everybody get all the points else just one person points 


  return {
    makeLineChart: makeLineChart
  }
})
