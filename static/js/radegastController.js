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
                                console.log("test");
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
                  }).success(function (data, status, headers, config) {
                    // do something
                    console.log("Recipe Saved");
                  }).error(function (data, status) {
                    // notify user
                  });
                };

		$scope.getRecipe();
	}
]);
