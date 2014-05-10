'use strict';

var radegastApp = angular.module('radegastApp', [
    'ngRoute',
    'mm.foundation'
]);

radegastApp.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/templates/recipeList.html',
            controller: 'RecipeListCtrl'
        })
	.when('/recipes/:id', {
            templateUrl: '/templates/recipeItem.html',
            controller: 'RecipeItemCtrl'
        })
	.otherwise({redirectTo: '/'});

    // configure html5 to get links working on jsfiddle
    $locationProvider.html5Mode(true);
});

radegastApp.controller('MainCtrl', ['$scope', '$route', '$routeParams', '$location',
	function ($scope, $route, $routeParams, $location) {
		$scope.$route = $route;
		$scope.$location = $location;
		$scope.$routeParams = $routeParams;
	}
]);

radegastApp.controller('RecipeListCtrl', ['$scope', '$http', '$routeParams',
	function ($scope, $http, $routeParams) {

		$scope.routeParams = $routeParams;
		$scope.recipes = [];

		$scope.getRecipes = function () {
			$http({method: 'GET', url: 'http://localhost:8080/api/recipes'}).
				success(function (data, status, headers, config) {
				$scope.recipes = data.recipes;
				}).error(function (data, status) {
			});
		};

		$scope.getRecipes();
	}
]);

radegastApp.controller('RecipeItemCtrl', ['$scope', '$http', '$routeParams',
	function ($scope, $http, $routeParams) {

		$scope.routeParams = $routeParams;
		$scope.recipe = null;

		$scope.getRecipe = function () {
			$http({method: 'GET', url: 'http://localhost:8080/api/recipes/' + $routeParams.id}).
				success(function (data, status, headers, config) {
				$scope.recipeName = data.recipe;
				}).error(function () {
			});
		};

		$scope.getRecipe();
	}
]);
