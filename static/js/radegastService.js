
radegastApp.factory('recipeFactory', ['$http', function($http) {

    var recipeFactory = {};

    recipeFactory.getRecipes = function () {
        return $http({
            method: 'GET',
            url: 'http://localhost:8080/api/recipes'
        });
    };

    recipeFactory.getRecipe = function(id) {
        return $http({
            method: 'GET',
            url: 'http://localhost:8080/api/recipes/' + id
        });

    };

    recipeFactory.insertRecipe = function(id) {
        return $http({
            method: 'POST',
            url: 'http://localhost:8080/api/recipes/' + id
        });

    };

    recipeFactory.updateRecipe = function(id) {
        return $http({
            method: 'PUT',
            url: 'http://localhost:8080/api/recipes/' + id
        });

    };

    recipeFactory.deleteRecipe = function(id) {
        return $http({
            method: 'DELETE',
            url: 'http://localhost:8080/api/recipes/' + id
        });

    };

    return recipeFactory;
}]);
