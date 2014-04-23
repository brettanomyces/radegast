/**
 * Created by brettyukich on 22/04/14.
 */

var app = angular.module('Radegast', [
    'mm.foundation'
]);

app.factory('Equipment', function() {
   return {
       kettleHeight : undefined,
       kettleDiameter : undefined
   }
});

function GrainBillController($scope){

    $scope.requiredOg = undefined;
    $scope.grains = [{name: "", ebc: undefined, grams : undefined}];


    $scope.addGrain = function () {
        $scope.grains.push({name: "", ebc: undefined, grams : undefined});
    }

    $scope.removeGrain = function(grain) {
        var index=$scope.grains.indexOf(grain);
        $scope.grains.splice(index,1);
    }
}

function EquipmentController($scope, Equipment) {

    $scope.equipment = Equipment;

    $scope.volume = function(){

        if($scope.equipment.kettleHeight > 0 && $scope.equipment.kettleDiameter > 0 ){
            return cmCubedToLitres(cylinderVolume($scope.equipment.kettleDiameter, $scope.equipment.kettleHeight));
        } else {
            return "";
        }
    }
}

function cylinderVolume(diameter, height){
    // console.log("Diameter: " + diameter + ", Height: " + height);
    var radius = diameter / 2;
    return Math.PI * radius * radius * height;
}

function cmCubedToLitres(cmCubed){
    return cmCubed / 1000;
}
