/**
 * Created by brettyukich on 22/04/14.
 */

var app = angular.module('Radegast', [
    'mm.foundation'
]);

// Create a service called 'Volume'
app.factory('Equipment', function() {
   return {
       kettleHeight : undefined,
       kettleDiameter : undefined
   }
});

app.factory('GrainBill', function() {
    return {
        requiredOg : undefined,
        experimentalOg : undefined,
        grains : [{
            name: undefined,
            ebc: undefined,
            grams: undefined
        }]
    }

});

function GrainBillController($scope, GrainBill){

    $scope.grainBill = GrainBill;

    $scope.addGrain = function () {
        $scope.grainBill.grains.push();
    }

    $scope.removeGrain = function(num) {
        $scope.grainBill.grains.remove(num);
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
