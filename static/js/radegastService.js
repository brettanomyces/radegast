
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


    // create 
    recipeFactory.postRecipe = function() {
        return $http({
            method: 'POST',
            url: 'http://localhost:8080/api/recipes'
        });

    };

    // retrieve
    recipeFactory.getRecipes = function () {
        return $http({
            method: 'GET',
            url: 'http://localhost:8080/api/recipes'
        });
    };

    // retrieve
    recipeFactory.getRecipe = function(id) {
        return $http({
            method: 'GET',
            url: 'http://localhost:8080/api/recipes/' + id
        });

    };

    // update
    recipeFactory.putRecipe = function(id, data) {
        return $http({
            method: 'PUT',
            url: 'http://localhost:8080/api/recipes/' + id,
            data: data
        });

    };

    // delete
    recipeFactory.deleteRecipe = function(id) {
        return $http({
            method: 'DELETE',
            url: 'http://localhost:8080/api/recipes/' + id
        });

    };

    return recipeFactory;
}]);
