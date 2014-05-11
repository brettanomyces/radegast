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

}]);
