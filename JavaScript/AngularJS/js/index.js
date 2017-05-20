var app = angular.module('myApp1', []);
app.controller('myController1', function($scope) {
	$scope.firstName = "Egeye";
	$scope.lastName = "Ignativ";
	$scope.fullName = () => { return $scope.firstName + ' ' + $scope.lastName };
});

angular.module('myAppLi', []).controller('controllerLi', ($scope) => { $scope.liNames = ['Egeye', 'Octavio', 'Will'] } );

angular.bootstrap(document.getElementById("app1"), ['myApp1']);
angular.bootstrap(document.getElementById("app2", ['myApp2']));
angular.bootstrap(document.getElementById("appFId", ['appF']));
angular.bootstrap(document.getElementById("appLi"), ['myAppLi']);
