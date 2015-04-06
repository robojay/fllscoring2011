//
// Are you learning something from this code?  Cool!
// Spot something that could be done better?  Let me know:  jayfrancis@aol.com
//
// Want to re-use this for another project?  Go ahead, re-use away!
//
// This code is FREE, as in, well, FREE...
//

function getInfo() {
    alert("This web app is FREE, as in, well, FREE...\n" + 
        "Spot something that could be done better?\n" +
        "Let me know:  jayfrancis@aol.com\n");
}

var foodFactor;
var timerOn;
var countDownSeconds;
var timer;
var countDown = true;

function setCss(cssfile){
    var cssLink = document.getElementById('styleLink');
    cssLink.href = cssfile;
}

function timerRun() {
    if ( ((countDown && (countDownSeconds > 0)) || !countDown) && timerOn) {
        var t = document.getElementById('timerText');
        var minutes = Math.floor(countDownSeconds / 60);
        var seconds = countDownSeconds % 60;    
        var tstring = String(minutes) + ":";
        if (seconds < 10)
            tstring += "0";
        tstring += String(seconds);
        t.innerHTML = tstring;
        if (countDown)
            countDownSeconds--;
        else
            countDownSeconds++;
    }
    else if (countDownSeconds == 0) {
        var t = document.getElementById('timerText');
        t.innerHTML = "0:00";
    }
    timer = setTimeout("timerRun();", 1000);
}

function timerToggle() {
    var b = document.getElementById('startStopButton');

    if (!timerOn) {
        b.innerHTML = "Pause";
        timerOn = true;
    }
    else {
        b.innerHTML = "Start";
        timerOn = false;                
    }
}

function countDirectionChange(direction) {
    timerOn = false;

    if (direction == "up") {
        countDown = false;
        countDownSeconds = 0;
    }
    else {
        countDown = true;
        countDownSeconds = 150;
    }

    var t = document.getElementById('countUpButton');
    t.checked = !countDown;
    t = document.getElementById('countDownButton');
    t.checked = countDown;

    t = document.getElementById('timerText');
    var minutes = Math.floor(countDownSeconds / 60);
    var seconds = countDownSeconds % 60;    
    var tstring = String(minutes) + ":";
    if (seconds < 10)
        tstring += "0";
    tstring += String(seconds);
    t.innerHTML = tstring;
    
    var b = document.getElementById('startStopButton');
    b.innerHTML = "Start";

}

function reset() {
    var item;
    var select;
    var option;    
    
    foodFactor = {
        "goodBacteriaInBase": "0",
        "yellowTruckInBase": "no",
        "ratsInBase": "0",
        "pizzaIceCreamInBase": "0",
        "fishInBase": "0",
        "babyFishOnMark": "yes",
        "dispensersEmpty": "0",
        "bacteriaOnMatOutsideBase": "no",
        "cornLocation": "neither",
        "ballsTouchingMat": "0",
        "whiteTrailerLocation": "neither",
        "fishInTrailer": "0",
        "bacteriaInSinkTens": "0",
        "bacteriaInSinkOnes": "0",
        "virusInSink": "0",
        "thermometerLowTemp": "no",
        "timerRedZone": "no",
        "groceryUnitsOnTable": "0",
        "touchingEastWall": "no"
    };
    
    for (item in foodFactor) {
        select = document.getElementById(item);
        for (option in select.children) {
            if (select[option].nodeName == "OPTION") {
                if (select[option].value == foodFactor[item]) {
                    select[option].selected = true;
                }
                else {
                    select[option].selected = false;
                }
            }
        }
    }

    if (countDown)
        countDirectionChange('down');
    else
        countDirectionChange('up');
    
    update();

    if (!timer)
        timerRun();
}

function checkFish(adjust) {
    //
    // Check to see if the fish locations make sense
    // There are only 3 fish that can be split between
    // in base and in the trailer
        
    var fishInBase = parseInt(document.getElementById("fishInBase").value);
    var fishInTrailer = parseInt(document.getElementById("fishInTrailer").value);
    
    if ((fishInBase + fishInTrailer) > 3) {
        var newFish;
        var fishSelector;
        switch(adjust) {
            case 'base':
                newFish = 3 - fishInBase;
                fishSelector = document.getElementById('fishInTrailer');
                break;
            case 'trailer':
                newFish = 3 - fishInTrailer;
                fishSelector = document.getElementById('fishInBase');
                break;
        }  
        for (var i = 0; i < fishSelector.options.length; i++) {
            fishSelector.options[i].selected = false;
            if (fishSelector.options[i].value == String(newFish))
                fishSelector.options[i].selected = true;
        }
        switch(adjust) {
            case 'base':
                alert("Too Many Fish!\nTrailer will be adjusted.");
                break;
            case 'trailer':
                alert("Too Many Fish!\nBase will be adjusted.");
                break;
        }
    }
}

function checkBacteria() {
    //
    // Check to see if the bacteria locations/numbers make sense
    //

    var goodBacteriaInBase = parseInt(document.getElementById("goodBacteriaInBase").value);
    var bacteriaInSink = 10 * parseInt(document.getElementById("bacteriaInSinkTens").value) + parseInt(document.getElementById("bacteriaInSinkOnes").value);
    
    if ( (bacteriaInSink + goodBacteriaInBase) > 60 ) {
        alert("Too Many Bacteria!\nResetting Boxes 1 and 10.");

        function clearOption(selector) {
            for (var i = 0; i < selector.options.length; i++) {
                selector.options[i].selected = false;
                if (selector.options[i].value == "0")
                    selector.options[i].selected = true;
            }
        }

        clearOption(document.getElementById("goodBacteriaInBase"));
        clearOption(document.getElementById("bacteriaInSinkTens"));
        clearOption(document.getElementById("bacteriaInSinkOnes"));
    }
}



function update() {
    var item;
    var value;
    var score = 0;
    
    // update the current values
    for (item in foodFactor) {
        value =  document.getElementById(item).value;
        foodFactor[item] = value;
    }

    // 4 points for each ball touching the mat
    score += 4 * parseInt(foodFactor.ballsTouchingMat);
    
    // 5 points for any piece of corn touching the mat
    // -or-
    // 9 points for any piece of corn in base
    switch (foodFactor.cornLocation) {
        case 'mat':
            score += 5;
            break;
        case 'base':
            score += 9;
            break;
    }
        
    // 3 points for each big fish in base if baby fish still touching mark
    if (foodFactor.babyFishOnMark == 'yes') {
        score += 3 * parseInt(foodFactor.fishInBase);
    }
    
    // 7 points each for pizza and/or ice cream in base
    score += 7 * parseInt(foodFactor.pizzaIceCreamInBase);
    
    // 9 points for yellow farm truck in base
    if (foodFactor.yellowTruckInBase == 'yes')
        score += 9;
    
    // 9 points for robot touching the east wall
    if (foodFactor.touchingEastWall == 'yes')
        score += 9;
        
    // 14 points for white pointer in the red zone
    if (foodFactor.timerRedZone == 'yes')
        score += 14;
        
    // 20 points for thermometer spindle clicked/dropped fully showing low red temperature
    if (foodFactor.thermometerLowTemp == 'yes')
        score += 20;
        
    // 15 points for each rat in base
    score += 15 * parseInt(foodFactor.ratsInBase);
    
    // 12 point for trailer in base
    // -or-
    // 20 points for trailer with meat inside, no germs, and any wheels touching
    // the port dock north of the the white line, plus 6 points for each big fish
    // inside -if- the baby fish is still touching its mark
    switch (foodFactor.whiteTrailerLocation) {
        case 'base':
            score += 12;
            if (foodFactor.babyFishOnMark == 'yes') {
                score += 3 * parseInt(foodFactor.fishInTrailer);
            }
            break;
        case 'clean':
            score += 20;
            if (foodFactor.babyFishOnMark == 'yes')
                score += 6 * parseInt(foodFactor.fishInTrailer);
            break;
    }
    
    // 2 points for each grocery unit on the table
    score += 2 * parseInt(foodFactor.groceryUnitsOnTable);
    
    // 12 points each for empty dispensers if no bacteria is outside base,
    // -or-
    // 7 points each if bacteria is touching mat outside base
    if (foodFactor.bacteriaOnMatOutsideBase == 'yes')
        score += 7 * parseInt(foodFactor.dispensersEmpty);
    else
        score += 12 * parseInt(foodFactor.dispensersEmpty);
        
    // 3 points for each bateria in the sink, assuming all conditions were met...
    score += 3 * ( 10 * parseInt(foodFactor.bacteriaInSinkTens) + parseInt(foodFactor.bacteriaInSinkOnes));
    
    // 6 points for 1 to 8 viral germs in the sink
    // -or-
    // 13 points for 9 or more
    switch (foodFactor.virusInSink) {
        case '1-8':
            score += 6;
            break;
        case '9-16':
            score += 13;
            break;
    }

    // 6 points for each good bacteria in base 
    score += 6 * parseInt(foodFactor.goodBacteriaInBase);
    
    // display the score
    var scoreText = document.getElementById('scoreText');
    scoreText.innerHTML = score;
}