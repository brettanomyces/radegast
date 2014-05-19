'use strict';

var radegastApp = angular.module('radegastApp', [
    'ngRoute',
    'mm.foundation'
]);

radegastApp.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/templates/recipeList.html',
            controller: 'RecipeListCtrl'
        })
        .when('/recipes/:id', {
            templateUrl: '/templates/recipeItem.html',
            controller: 'RecipeItemCtrl'
        })
        .when('/grains', {
            templateUrl: '/templates/grainList.html',
            controller: 'GrainListCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

    // configure html5 to get links working on jsfiddle
    $locationProvider.html5Mode(true);
});

