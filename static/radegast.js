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

app.factory('GrainBill', function() {
    return {
        requiredOg : undefined,
        grains : [{
            name: undefined,
            ebc: undefined,
            grams: undefined
        }]
    }

});

function GrainBillController($scope, GrainBill){

    $scope.requiredOg = undefined;
    $scope.grains = ["Caramalt", "T2", "Chocolate"];


    $scope.addGrain = function () {
        $scope.grains.push("test");
    }

    $scope.removeGrain = function(num) {
        $scope.grains.remove(num);
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
