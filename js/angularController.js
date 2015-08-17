'use strict';

angular
  .module('IssueTrackingApp', [
    'ngRoute',
    'firebase'
  ])
  .value('fbURL', 'https://torrid-heat-6290.firebaseio.com/')
  .factory('IssueTickets', function (fbURL, $firebase) {
    return $firebase(new Firebase(fbURL)).$asArray();
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/main', {
        templateUrl: 'main.html',
        controller: 'listController'
      })
      .when('/edit/:id', {
        templateUrl: 'edit.html',
        controller: 'EditController'
      })
      .when('/create', {
        templateUrl: 'create.html',
        controller: 'CreateController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });



/* Controllers */
function CreateController($scope, $location,$rootScope, IssueTickets,$routeParams, $firebase, fbURL) {

  console.log("Controller begins");
  

  $scope.registerTicket = function() {
      var formData = IssueTickets.$add({
        'title': $scope.title,
        'reporter': $scope.reporter,
        'severity': $scope.severity,
        'assignee': $scope.assignee,
        'description': $scope.description,
        'state': "Open"
      });

    console.log($scope.title);

    $scope.title = '';
    $scope.reporter='';
    $scope.severity = '';
    $scope.assignee = '';
    $scope.description='';
    $scope.state='';

  /*
  var method = 'POST';
  var inserturl = 'http://localhost:8080/insertuser';
  $scope.codeStatus = "";
  $scope.registerTicket = function() {
    console.log("register ticket called");
    var formData = {
      'title' : this.title,
      'severity' : this.severity,
	    'assignee' : this.assignee,
      'description' : this.description,
      'state' : "Open"
    };
	this.title = '';
	this.severity = '';
	this.assignee = '';
  this.description='';
	this.state='';
	*/

  if(formData) {
        alert('saved successfully');
  } else  {
        alert('Error while registering');
  }

	var jdata = 'mydata='+JSON.stringify(formData);

  console.log(jdata);

  $scope.IssueTickets = IssueTickets;



  $location.path('/main');

  };
	
  /*
  $http({
      method: method,
      url: inserturl,
      data:  jdata ,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      cache: $templateCache
    }).
    success(function(response) {
		console.log("success");
        $scope.codeStatus = response.data;
		console.log($scope.codeStatus);
    
    }).
    error(function(response) {
		console.log("error");
        $scope.codeStatus = response || "Request failed";
		console.log($scope.codeStatus);
    });

    return false;
  };	

  */ 

  
  /*
  $scope.list = function() {
	  var url = 'http://localhost:8080/getusers';	
	  $http.get(url).success(function(data) {
		var jsonVar = data;
		console.log(jsonVar.length);
		
		$scope.users = data;
		console.log($scope.users);
		//console.log($scope.users.length);
		//var users = $scope.users;
		//console.log(users.length);
		//console.log($scope.users[0].name);
	  });
  };
  
  $scope.list();

  */
  

  
}

function listController ($scope, $location,$rootScope, IssueTickets) {

  console.log("list controller begins");

  $scope.IssueTickets = IssueTickets;
  /*
  var url = 'http://localhost:8080/getusers'; 
  $http.get(url).success(function(data) {
  var jsonVar = data;
  console.log("Length: " + jsonVar.length);
    
  $scope.issuelist = data;

    });

  */  

}

function EditController($scope, $rootScope, IssueTickets,$location,$routeParams, $firebase, fbURL) {

  console.log("edit begins");

  var dbURL = new Firebase(fbURL + $routeParams.id);
  $scope.IssueTickets = $firebase(dbURL).$asObject();
  $scope.edit = function() {
    $scope.IssueTickets.$save();
    if($scope.state=="Closed") {
        console.log("closed");
        $scope.remove = function(id) {
        IssueTickets.$remove(id);
      };
    }
    $location.path('/main');
  };


  
}