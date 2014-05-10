'use strict';

radegastApp.controller('RecipeListCtrl', ['$scope', '$http', '$routeParams',
	function ($scope, $http, $routeParams) {

		$scope.routeParams = $routeParams;
		$scope.recipes = [];

		$scope.getRecipes = function () {
			$http({
				method: 'GET',
				url: 'http://localhost:8080/api/recipes'
			}).success(function (data, status, headers, config) {
				$scope.recipes = data.recipes; 
			}).error(function (data, status) {
					//do something
			});
		};

		$scope.getRecipes();
	}
]);

radegastApp.controller('RecipeItemCtrl', ['$scope', '$http', '$routeParams',
	function ($scope, $http, $routeParams) {

		$scope.routeParams = $routeParams;
		$scope.recipe = {};

		$scope.getRecipe = function () {
			$http({
				method: 'GET', 
				url: 'http://localhost:8080/api/recipes/' + $routeParams.id
			}).success(function (data, status, headers, config) {
				$scope.recipe = data.recipe; 
			}).error(function () {
				// do something
			});
		};

		$scope.getRecipe();
	}
]);
