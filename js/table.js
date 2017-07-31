var xxx = angular.module('appTable', ['ui.grid', 'ui.grid.moveColumns']);

xxx.controller('MainCtrl', function ($scope) {

  $scope.myData = [
        {
            "firstName": "Cox",
            "lastName": "Carney",
            "company": "Enormo",
            "employed": true
        },
        {
            "firstName": "Lorraine",
            "lastName": "Wise",
            "company": "Comveyer",
            "employed": false
        },
        {
            "firstName": "Octavio",
            "lastName": "Ignativ",
            "company": "OR",
            "employed": false
        },
        {
            "firstName": "Will",
            "lastName": "llllllllllsjfl",
            "company": "sdfsdfsd",
            "employed": false
        },
        {
            "firstName": "Hilly",
            "lastName": "White",
            "company": "Fly",
            "employed": false
        },
        {
            "firstName": "Xil",
            "lastName": "SSS",
            "company": "fsdf",
            "employed": false
        },
        {
            "firstName": "ERER",
            "lastName": "ffff",
            "company": "Comfffffffffffffffffveyer",
            "employed": false
        },
        {
            "firstName": "b",
            "lastName": "ffff",
            "company": "b",
            "employed": false
        },
        {
            "firstName": "a",
            "lastName": "a",
            "company": "a",
            "employed": false
        },
        {
            "firstName": "x",
            "lastName": "x",
            "company": "x",
            "employed": false
        },
        {
            "firstName": "ssssssssss",
            "lastName": "fffsdfff",
            "company": "Comffaasdffffveyer",
            "employed": false
        },
        {
            "firstName": "Nancy",
            "lastName": "Waters",
            "company": "Fuelton",
            "employed": false
        }];

    $scope.gridOptions = {
        enableGridMenu: true,         //隐藏列，显示列菜单,最右边
        columnDefs: [
        { field: 'employed', enableSorting: false },
        { field: 'firstName', enableSorting: true },
        { field: 'lastName', enableSorting: true },
        { field: 'company', enableSorting: true }
        ]
    };

    $scope.gridOptions.data = $scope.myData;

});