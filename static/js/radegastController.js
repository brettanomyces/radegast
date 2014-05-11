'use strict';

radegastApp.controller('RecipeListCtrl', ['$scope', '$routeParams', 'recipeFactory',
	function ($scope, $routeParams, recipeFactory) {

        $scope.recipes = [];

        getRecipes();

        function getRecipes() {
            recipeFactory.getRecipes()
                .success(function (data) {
                    $scope.recipes = data.recipes;
                })
                .error(function (data) {
                    // Do Something
                });
        }
}]);

radegastApp.controller('RecipeItemCtrl', ['$scope', '$routeParams', 'recipeFactory',
    function ($scope, $routeParams, recipeFactory) {

        $scope.recipe = {};

        getRecipe();

        function getRecipe() {
            recipeFactory.getRecipe($routeParams.id)
                .success(function(data){
                    $scope.recipe = data;
                })
                .error(function(data){
                    // Do Something
                });
        }

        $scope.updateRecipe = function(){
            recipeFactory.updateRecipe($routeParams.id, $scope.recipe);
        };

        $scope.insertGrain = function() {
            if ($scope.recipe.grains == null) {
                $scope.recipe.grains = [];
            }
            $scope.recipe.grains.push({})
        };

        $scope.deleteGrain = function (grain) {
            var index = $scope.recipe.grains.indexOf(grain);
            $scope.recipe.grains.splice(index, 1);
        };

        $scope.insertHop = function() {
            if ($scope.recipe.hops == null) {
                $scope.recipe.hops = [];
            }
            $scope.recipe.hops.push({})
        };

        $scope.deleteHop = function (hop) {
            var index = $scope.recipe.hops.indexOf(hop);
            $scope.recipe.hops.splice(index, 1);
        };

}]);
