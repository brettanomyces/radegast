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
        $scope.grains.push({
            name: undefined,
            ebc: undefined,
            grams : undefined
        });
    };

    $scope.removeGrain = function(grain) {
        var index=$scope.grains.indexOf(grain);
        $scope.grains.splice(index,1);
    }
}

function HopBillController($scope){

    $scope.hops = [{
        name: undefined,
        form: undefined,
        method: undefined,
        alphaAcid: undefined,
        minutes: undefined,
        grams : undefined
    }];


    $scope.addHop = function () {
        $scope.hops.push({
            name: undefined,
            form: undefined,
            method: undefined,
            alphaAcid: undefined,
            minutes: undefined,
            grams : undefined
        });
    };

    $scope.removeHop = function(hop) {
        var index=$scope.hops.indexOf(hop);
        $scope.hops.splice(index,1);
    }
}

function MiscellaneousController($scope){

    $scope.items = [{
        name: undefined,
        amount: undefined,
        stage: undefined,
        minutes: undefined,
        reason : undefined
    }];


    $scope.addItem = function () {
        $scope.items.push({
            name: undefined,
            amount: undefined,
            stage: undefined,
            minutes: undefined,
            reason : undefined
        });
    };

    $scope.removeItem = function(item) {
        var index=$scope.hops.indexOf(item);
        $scope.items.splice(index,1);
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

function ibu(utilization, alphaAcid, grams, litres, correction){
    return (utilization * alphaAcid * grams) / (litres * correction) * 1000
}

function ibuCorrection(gravityOfBoil){
    if (gravityOfBoil <= 1.050){
        return 1;
    } else {
        return 1 + (gravityOfBoil - 1.050) / 0.2;
    }
}

function alcoholByVolume(originalGravity, terminalGravity){
    return (originalGravity - terminalGravity) / 0.75;
}