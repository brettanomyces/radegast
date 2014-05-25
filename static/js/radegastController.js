'use strict';

radegastApp.controller('RecipeListCtrl', ['$scope', '$location', '$routeParams', 'recipeFactory',
	function ($scope, $location, $routeParams, recipeFactory) {

        $scope.recipes = [];

        getRecipes();

        function getRecipes() {
            recipeFactory.getRecipes()
                .success(function (data) {
                    $scope.recipes = data;
                })
                .error(function (data) {
                    // Do Something
                });
        }

         $scope.postRecipe = function() {
            recipeFactory.postRecipe()
                .success(function (data) {
                    $location.path('/recipes/' + data._id);
                })
                .error(function (data) {
                    // Do Something
                });
        }
}]);

radegastApp.controller('GrainListCtrl', ['$scope', '$routeParams', 'recipeFactory',
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

        $scope.putRecipe = function(){
            recipeFactory.putRecipe($routeParams.id, $scope.recipe);
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

        $scope.insertMisc = function() {
            if ($scope.recipe.misc == null) {
                $scope.recipe.misc = [];
            }
            $scope.recipe.misc.push({})
        };

        $scope.deleteMisc = function (misc) {
            var index = $scope.recipe.misc.indexOf(misc);
            $scope.recipe.misc.splice(index, 1);
        };


        var kgToPounds = 2.205;
        var litresToGallons = 0.264;
        // var defaultEfficiency = 0.70 // %
        // var defaultAttenuation = 0.75 // %
        // var defaultLossesToGrain = 1.1 // litre per kg
        // var defaultLossesToEvaporation = 2.1 // litres per hour
        // var defaultLossesToHopsAndBreak = 1 // litre

        /**
         * @param weight (Kilogram)
         * @param extractPotential (%)
         * @param efficiency (%)
         * @returns {number}
         */
        function gravityPoints(weight, extractPotential, efficiency){
            // Sugar gives 46 ppg and all else derives from this
            return weight * extractPotential * efficiency * pointsPerKgPerLitre(46)
        }

        /**
         * Convert points per gallon to points per kk per litre
         * @param pointsPerGallon
         * @returns {number}
         */
        function pointsPerKgPerLitre(pointsPerGallon){
            return pointsPerGallon * 8.345;
        }

        /**
         *
         * @param weight (Kilogram) of malt X
         * @param lovibond (degrees L)
         * @param volume (Litres) of batch
         */
        function maltColorUnits(weight, lovibond, volume){
            return (weight * lovibond * kgToPounds)/(volume * litresToGallons);
        }

        /**
         * Calculate the beer color in SRM
         * @param mcu Malt Color Units
         */
        function srm(mcu){
            return 1.49 * mcu ^ 0.69;
        }

        /**
         * Calculate the beer color in EBC
         * @param mcu Malt Color Units
         * @returns {number}
         */
        function ebc(mcu){
            return 1.97 * srm(mcu);
        }

        function alcoholByVolume(originalGravity, finalGravity) {
            return (originalGravity - finalGravity) * 131;
        }

        /**
         * Calculate the expected final gravity of the beer
         * @param originalGravity
         * @param attenuation
         * @returns {number}
         */
        function finalGravity(originalGravity, attenuation){
            return ((originalGravity - 1) * (1 - attenuation)) + 1;
        }

        function lossesToGrain(weight, rateOfAbsorption){
            return weight * rateOfAbsorption;
        }

        function lossesToEvaporation(time, rateOfEvaporation){
            return time * rateOfEvaporation;
        }

        function aau(alphaAcid, weight){
            return alphaAcid * weight;
        }

        /**
         *
         * @param weight (grams)
         * @param alphaAcid (%)
         * @param utilisation (decimal)
         * @param volume (litres) final volume
         */
        function ibu(weight, alphaAcid, utilisation, volume){
            return (weight * alphaAcid * utilisation * 10) / volume;
        }
}]);
