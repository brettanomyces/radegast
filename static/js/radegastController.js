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
				$scope.recipe = data;
			}).error(function () {
				// do something
			});
		};

		$scope.putRecipe = function() {
			$http({
				method: 'PUT',
				url: 'http://localhost:8080/api/recipes/' + $routeParams.id,
				data: $scope.recipe
			}).success(function () {
				// do something
			}).error(function () {
				// notify user
			});
		};

		$scope.addGrain = function () {
			if ($scope.recipe.grains === undefined) {
				$scope.recipe.grains = [];
			}
			$scope.recipe.grains.push({});
		};

		$scope.removeGrain = function (grain) {
			var index = $scope.recipe.grains.indexOf(grain);
			$scope.recipe.grains.splice(index, 1);
		};

		$scope.getRecipe();
	}
]);
