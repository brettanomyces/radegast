/**
 * Created by brettyukich on 22/04/14.
 */

var app = angular.module('Radegast', [
    'mm.foundation'
]);

app.factory('BeerFactory', function () {

    var service = {};

    var kettleHeight;
    var kettleDiameter;


    service.setKettleHeight = function (height) {
        kettleHeight = height;
    };

    service.setKettleDiameter = function (diameter) {
        kettleDiameter = diameter;
    };

    service.kettleVolume = function () {
        return cmCubedToLitres(cylinderVolume(kettleHeight, kettleDiameter));
    };

    return service;
});

app.controller('BeerController', function($scope, BeerFactory) {

    $scope.kettleHeight = null;
    $scope.kettleDiameter = null;

    $scope.$watch('kettleHeight', function(newValue){
        BeerFactory.setKettleHeight(newValue);
    });

    $scope.$watch('kettleDiameter', function(newValue){
        BeerFactory.setKettleDiameter(newValue);
    });

    $scope.kettleVolume = function(){
        return BeerFactory.kettleVolume();
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

// AV27 = kettleDiameter
// BH79 = totalGrainWeight
// BP33 = boilDuration
// CQ27 = totalWaterNeeded
// CQ30 = strikeWaterNeeded
// CQ36 = volumeIntoBoil
// EA64 = waterHeldBackFromMash
// EA67 = waterUsedInASparge
// EA73 = waterAddedBeforeBoil
// EA76 = waterAddedDuringBoil
// EA79 = waterAddedToFermenter
// EB104 = volumeLostFromLauterAdjustment l/kg
// DY92 = evaporationRateAdjustment l/hour

/**
 *
 * @param totalGrainWeight (grams)
 * @param volumeIntoBoil (litres)
 * @param waterAddedDuringBoil (litres)
 * @param waterAddedToFermenter (litres)
 * @param volumeLostFromLauterAdjustment (litres/kilogram)
 */
function totalWaterNeeded(totalGrainWeight, volumeIntoBoil, waterAddedDuringBoil, waterAddedToFermenter, volumeLostFromLauterAdjustment) {
    // =IF(AND(ISNUMBER(BH79),ISNUMBER(B:DF)),IF(EB104>0,(EB104*BH79/1000)+CQ36*0.9614+EA76+EA79,(0.628*BH79/1000)+CQ36*0.9614+EA76+EA79),"")


    if (totalGrainWeight !== null && volumeIntoBoil !== null){
        if (volumeLostFromLauterAdjustment !== null){
            return (volumeLostFromLauterAdjustment*totalGrainWeight/1000)+(volumeIntoBoil*0.9614)+waterAddedDuringBoil+waterAddedToFermenter;
        } else {
            return (0.628*totalGrainWeight/1000)+(volumeIntoBoil*0.9614)+waterAddedDuringBoil+waterAddedToFermenter;

        }
    } else {
        return null;
    }
}

function getStrikeWaterTempAdjustmentFactor() {
    if (strikeWaterTempAdjustmentFactor !== null ){
        return strikeWaterTempAdjustmentFactor;
    } else {
        return 0.41
    }
}

/**
 *
 * @param grainTemperature (celsius)
 * @param mashTemp (celsius)
 * @param totalGrainWeight (grams)
 * @param totalWaterNeeded (litres)
 * @param waterHeldBackFromMash (litres)
 * @returns {*}
 */
function strikeTemperature(grainTemperature, mashTemp, totalGrainWeight, totalWaterNeeded, waterHeldBackFromMash) {

    if (totalWaterNeeded !== null && totalGrainWeight !== null && mashTemp !== null && grainTemperature !== null) {
        if (waterHeldBackFromMash !== null) {
            return (getStrikeWaterTempAdjustmentFactor() / ((totalWaterNeeded - waterHeldBackFromMash) / (totalGrainWeight / 1000))) * (mashTemp - grainTemperature) + mashTemp;

        } else {
            return (getStrikeWaterTempAdjustmentFactor() / (totalWaterNeeded / (totalGrainWeight / 1000))) * (mashTemp - grainTemperature) + mashTemp;

        }
    } else {
        return null
    }
}

/**
 *
 * @param totalWaterNeeded (litres)
 * @param waterHeldBackFromMash (litres)
 * @returns {*}
 */
function strikeWaterNeeded(totalWaterNeeded, waterHeldBackFromMash) {
    // =IF(AND(ISNUMBER(CQ27),ISNUMBER(EA64)),(CQ27-EA64)*1.019794,IF(ISNUMBER(CQ27),CQ27*1.019794,""))

    if (totalWaterNeeded !== null)
        if (waterHeldBackFromMash != null) {
            return (totalWaterNeeded - waterHeldBackFromMash) * 1.019794;
        } else {
            return totalWaterNeeded * 1.019794;
        } else {
        return null;
    }
}

/**
 *
 * @param totalWaterNeeded
 * @param totalGrainWeight
 * @param strikeWaterNeeded
 * @param waterHeldBackFromMash
 * @param waterUsedInASparge
 * @param waterAddedBeforeBoil
 * @param waterAddedDuringBoil
 * @param waterAddedToFermenter
 * @returns {*}
 */
function mashVolume(totalWaterNeeded, totalGrainWeight, strikeWaterNeeded, waterHeldBackFromMash, waterUsedInASparge, waterAddedBeforeBoil, waterAddedDuringBoil, waterAddedToFermenter){

    if (totalGrainWeight !== null) {
        if (totalWaterNeeded !== null && waterHeldBackFromMash != null){
            return ((totalWaterNeeded-waterUsedInASparge-waterAddedBeforeBoil-waterAddedDuringBoil-waterAddedToFermenter)*1.019794)+(totalGrainWeight/1000*0.75);
        } else if (strikeWaterNeeded !== null){
            return strikeWaterNeeded+(totalGrainWeight/1000*0.75);
        }
    } else {
        return null;
    }
}

function volumeIntoBoil(){
    // =IF(AND(ISNUMBER(CQ39),ISNUMBER(CQ42)),CQ42+CQ39-EA76/0.9614,"")
}


function evaporation(boilDuration, evaporationRateAdjustment, kettleDiameter) {
    // =IF(ISNUMBER(DY92),DY92/60*BP33,IF(AND(ISNUMBER(AV27),ISNUMBER(BP33)),(PI()*(AV27/2)*(AV27/2)*0.00428/60*BP33),""))

    if ( boilDuration !== null ) {
        if (evaporationRateAdjustment !== null){
            return evaporationRateAdjustment/60*boilDuration;
        } else if (kettleDiameter !== null ){
            return (Math.Pi*(kettleDiameter/2)*(kettleDiameter/2)*0.00428/60*boilDuration);
        }

    } else {
        return null;
    }
}