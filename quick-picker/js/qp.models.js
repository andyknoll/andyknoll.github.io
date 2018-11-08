/* 
    qp.models.js 

    Andy Knoll
    November 2018

*/

// there is only one model in this app - the Game
qp.Models = function(name, parent) {
    qp.debug("==> app creating Models");
    this.name = name;
    this.parent = parent;

    // the app's models
    this.gameModel = null;


    this.createModels = function() {
        qp.debug("Models.createModels");
        // create the Game object
        this.gameModel = new qp.GameModel("gameModel", this);
    };

    this.createModels();

};



// qp.Game object
qp.GameModel = function (name, parent) {
    qp.debug("GameModel constructor");
    this.name = name;
    this.parent = parent;

    // arrays
    this.levels = [];
    this.picks  = [];
    this.pieces = [];

    this.timer = null;      // custom Timer object
    this.timeRemaining = 0;
    this.isRunning = false;
    this.numCorrect = 0;

    this.currLevelIdx  = -1;
    this.currPickIdx   = -1;
    this.currPieceIdx  = -1; // is this needed ???
    this.currGuessVal  =  0;
    
    // getter methods
    this.currLevel = function() { return this.levels[this.currLevelIdx]; };
    this.currPick  = function() { return this.picks[this.currPickIdx];   };
    this.currPiece = function() { return this.pieces[this.currPieceIdx]; }; // is this needed ???



    this.createChildObjects = function() {
        qp.debug("GameModel.createChildObjects");

        // create timer here but set callback in Controller
        this.timer = new TimerObject(this.name + "_timer", this);

        this.createLevels();
    };

    this.setTimerCallback = function(caller, callback) {
        this.timer.setCaller(caller);
        this.timer.setCallback(callback);
    };

    this.startTimer = function() {
        qp.debug("GameModel.startTimer");
        //this.timer.startNow();
        this.timer.start();
    };

    this.stopTimer = function() {
        qp.debug("GameModel.stopTimer");
        this.timer.stop();
    };



    // levels are created as new objects, not JSON objects
    this.createLevels = function() {
        //qp.debug("GameModel.createLevels");
        var lvl = null;

        lvl = new qp.Level_1("Level 1");
        this.levels.push(lvl);
        lvl = new qp.Level_2("Level 2");
        this.levels.push(lvl);
        lvl = new qp.Level_3("Level 3");
        this.levels.push(lvl);
        lvl = new qp.Level_4("Level 4");
        this.levels.push(lvl);        

        qp.debug("GameModel.createLevels - created " + this.levels.length);
    };
        
    // each level reinitializes the arrays for that many numbers
    this.loadLevel = function(idx) {
        qp.debug("GameModel.loadLevel: " + idx);
        this.stopGame()                 // just in case
        this.currLevelIdx = idx;
        this.createPicksArray();        // create each level change
        this.createPiecesArray();       // create each level change
    };

    // called by each loadLevel()
    this.createPicksArray = function() {
        qp.debug("GameModel.createPicksArray");
        var maxPicks = this.currLevel().maxPieces;
        this.picks = [];
        for (var i = 0; i < maxPicks; i++) {
            this.picks.push(i + 1);     // 1 thru max
        }
        qp.debug("created " + this.picks.length + " Picks");
    };

    // called each new round of play
    this.shufflePicksArray = function() {
        qp.debug("GameModel.shufflePicksArray");
        qp.debug(this.picks);
        this.shuffleArray(this.picks);
        qp.debug(this.picks);
    };

    // called by each loadLevel()
    this.createPiecesArray = function() {
        qp.debug("GameModel.createPiecesArray");
        var maxPieces = this.currLevel().maxPieces;
        this.pieces = [];
        for (var i = 0; i < maxPieces; i++) {
            this.pieces.push(i + 1);     // 1 thru n
        }
        qp.debug("created " + this.pieces.length + " Pieces");
    };

    // called each new round of play
    this.shufflePiecesArray = function() {
        qp.debug("GameModel.shufflePiecesArray");
        qp.debug(this.pieces);
        this.shuffleArray(this.pieces);
        qp.debug(this.pieces);
   };

    // Durstenfeld algorithm - shuffle any array in place
    this.shuffleArray = function(array) {
        var i = 0;
        var j = 0;
        var temp = null;
      
        for (i = array.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1))
            temp = array[i]
            array[i] = array[j]
            array[j] = temp
        }
    };

    this.decrTimeRemaining = function() {
        this.timeRemaining--;
        if (this.timeRemaining < 0) this.timeRemaining = 0;
    };

    this.incrNumCorrect = function() {
        this.numCorrect++;
    };

    this.isWinner = function() {
        if (!this.isRunning) return false;
        return (this.numCorrect == this.currLevel().maxPieces);
    };

    this.startGame = function() {
        qp.debug("GameModel.startGame");

        this.isRunning = true;
        
        this.timeRemaining = this.currLevel().maxTime;
        this.currPickIdx = -1;
        this.numCorrect = 0;
        
        this.getNextPick();
        this.startTimer();
    };


    this.stopGame = function() {
        this.isRunning = false;
        this.stopTimer();

        //this.timeRemaining = this.currLevel().maxTime;
        //this.currPickIdx = -1;
        //this.numCorrect = 0;
    };

    this.getNextPick = function() {
        var maxIdx = this.currLevel().maxPieces - 1;
        this.currPickIdx++;
        if (this.currPickIdx > maxIdx) this.currPickIdx = maxIdx;
    };

    // compares two int values
    this.currGuessIsCorrect = function() {
        return this.currPiece() == this.currPick();
    };

    this.createChildObjects();
};







/* previoously in qp.levels.js */

qp.Level_1 = function(name) {
    this.name = name;
    this.maxPieces = 9;
    this.maxTime = 15;  // seconds
    this.index = 0;
};

qp.Level_2 = function(name) {
    this.name = name;
    this.maxPieces = 16;
    this.maxTime = 30;  // seconds
    this.index = 1;
};

qp.Level_3 = function(name) {
    this.name = name;
    this.maxPieces = 25;
    this.maxTime = 60;  // seconds
    this.index = 2;
};

qp.Level_4 = function(name) {
    this.name = name;
    this.maxPieces = 36;
    this.maxTime = 120;  // seconds
    this.index = 3;
};

/********************************************************************************

// JSON - not using this approach

var levels = [
    { 
        name: "Level 1",
        maxPieces: 9,
        maxTime: 15,
        index: 0
    },
    { 
        name: "Level 2",
        maxPieces: 16,
        maxTime: 25,
        index: 1
    },
    { 
        name: "Level 3",
        maxPieces: 25,
        maxTime: 30,
        index: 2
    },
    { 
        name: "Level 1",
        maxPieces: 36,
        maxTime: 45,
        index: 3
    }
];

********************************************************************************/
