
radegastApp.factory('grainFactory', ['$http', function($http) {
    var grainFactory = {};

    grainFactory.getGrains = function () {
        return $http({
            method: 'GET',
            url: 'http://localhost:8080/api/grains'
        });
    };

    grainFactory.getGrain = function(id) {
        return $http({
            method: 'GET',
            url: 'http://localhost:8080/api/grains/' + id
        });

    };

    grainFactory.insertGrain = function(id) {
        return $http({
            method: 'POST',
            url: 'http://localhost:8080/api/grains/' + id
        });

    };

    grainFactory.updateGrain = function(id, data) {
        return $http({
            method: 'PUT',
            url: 'http://localhost:8080/api/grains/' + id,
            data: data
        });

    };

    grainFactory.deleteGrain = function(id) {
        return $http({
            method: 'DELETE',
            url: 'http://localhost:8080/api/grains/' + id
        });

    };

    return grainFactory;

}]);


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

    recipeFactory.updateRecipe = function(id, data) {
        return $http({
            method: 'PUT',
            url: 'http://localhost:8080/api/recipes/' + id,
            data: data
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
