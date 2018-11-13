/* 

    qp.controllers.js 

    Andy Knoll
    November 2018

    This file binds the event handlers to the View's UI controls.
    It also calls the API methods of the Game Models and Game Views.

*/

qp.Controllers = function(name, parent) {
    qp.debug("==> app creating Controllers");
    this.name = name;
    this.parent = parent;

    // only the App Controllers object can access Models and Views
    // Models and Views exist isolated from eachother
    this.models = this.parent.models;
    this.views  = this.parent.views;
    
    // the app's controllers
    this.gameCtrl = null;

    this.createControllers = function() {
        qp.debug("Controllers.createControllers");
        // create the Game controller
        this.gameCtrl = new qp.GameCtrl("gameCtrl", this);
    };

    this.createControllers();

};





qp.GameCtrl = function(name, parent) {
    qp.debug("GameCtrl constructor");
    this.name = name;
    this.parent = parent;

    // convenience shorthand properties
    this.game = this.parent.models.gameModel;
    this.view = this.parent.views.gameView;

    // used for timed sequences
    this.pauser = new PauserObject("pauser", this);
    this.pauser.caller = this;

    this.bindModelsAndViews = function() {
        qp.debug("GameCtrl.bindModelsAndViews");
        var view = this.view;

        this.game.setTimerCallback(this, this.onTimer);        // bind to own method
        //this.game.startTimer();

        view.$btnPlay.on("click", this, this.$btnPlay_click);

        view.$btnLevel1.on("click", this, this.$btn_level_click);
        view.$btnLevel2.on("click", this, this.$btn_level_click);
        view.$btnLevel3.on("click", this, this.$btn_level_click);
        view.$btnLevel4.on("click", this, this.$btn_level_click);

        // for running tests - now in Tester object  :-)
        // view.$header.on("click", this, this.run_tests);
    };

    // called each time a new level is loaded
    this.bindGamePieces = function() {
        qp.debug("GameCtrl.bindGamePieces");
        var view = this.view;
        var pieces = view.pieces;
        var piece = null;
        var data = {};      // allows this Ctrl context to be passed to handler

        for (var i = 0; i < pieces.length; i++) {
            piece = view.piece(i);
            data = {};              // need a unique new object to pass each time
            data.piece = piece;
            data.ctrl = this;
            piece.$elem.on("click", data, this.$pieces_click);
        }
    };

    /*********************   click handlers   ********************/
    
    // start the game
    this.$btnPlay_click = function(e) {
        var ctrl = e.data;
        ctrl.startOrStopGame();
    };


    // load the game levels
    this.$btn_level_click = function(e) {
        var ctrl = e.data;
        var $btn = $(e.target);
        var id = $btn.attr("id");
        var lvl = 0;

        switch (id) {
            case "button-level-1" : lvl = 0; break;
            case "button-level-2" : lvl = 1; break;
            case "button-level-3" : lvl = 2; break;
            case "button-level-4" : lvl = 3; break;
        }
        ctrl.loadLevel(lvl);        // pass level index
    };

    // e.data is set in bindGamePieces()
    // check for correct match
    this.$pieces_click = function(e) {
        var piece = e.data.piece;
        var ctrl = e.data.ctrl;
        ctrl.view.currPiece = piece;
        ctrl.checkCurrPiece();
    };

    /*************************************************************/

    // this method can control both the Game and the Progress Bar
    this.onTimer = function(timer) {
        //alert("GameCtrl.onTimer cycle = " + timer.cycle);
        // game.decrTimeRemaining()
        // view.decrProgressBar()

        var game = this.game;
        game.decrTimeRemaining();
        //alert(game.timeRemaining);
        if (game.timeRemaining == 0) {
            game.stopGame();
            this.view.showLoser();
            this.view.soundLoser();
            this.view.initProgressBar(0);
        };

        this.view.animProgressBarValue(game.timeRemaining, 1000);
    };


    // this is a mediator method - updates both Model and View
    // it calls both game.loadLevel() and view.loadLevel()
    this.loadLevel = function(level) {
        qp.debug("GameCtrl.loadLevel");
        var game = this.game;
        var view = this.view;
        var levelObj = null;

        // skip if game is running
        if (game.isRunning) return;

        game.stopGame();
        view.initGame();

        game.loadLevel(level);              // set the Game's new current level
        levelObj = game.currLevel();        // only after Game loads current!
        view.loadLevel(levelObj);           // creates max GamePiece objects
        this.bindGamePieces();              // must rebind here after each DOM load
        
        game.shufflePicksArray();
        game.shufflePiecesArray();
        view.shufflePieceValues(game.pieces);

        view.showAllPieces();    
    };

            
    this.startOrStopGame = function() {
        if (this.game.isRunning) {
            this.stopGame();        // stops  both the Game and UI
        } else {
            this.startGame();       // starts both the Game and UI
        }
    };

    this.startGame = function() {
        qp.debug("GameCtrl.startGame");
        var game = this.game;
        var view = this.view;

        game.startGame();
        view.startGame(game.timeRemaining);
        view.showCurrPick(game.currPick());
    };

    this.stopGame = function() {
        qp.debug("GameCtrl.stopGame");
        this.game.stopGame();
        this.view.stopGame();
    };





    this.checkCurrPiece = function() {
        qp.debug("GameCtrl.checkCurrPiece");
        var game = this.game;
        var view = this.view;
        var currPiece = this.view.currPiece;

        // skip if game not running
        if (!game.isRunning) return;

        // set the game's currPiece from the UI value
        game.currPieceIdx = currPiece.index;

        if (!game.currGuessIsCorrect()) {
            currPiece.showIncorrect();
            currPiece.soundIncorrect()
            return;
        }

        // the correct piece was selected
        currPiece.showCorrect();
        currPiece.soundCorrect();
        game.incrNumCorrect();

        // a winner will stop the game and timer
        if (!this.checkForWinner()) {
            game.getNextPick();
            view.showCurrPick(game.currPick());
        } else {
            // game is over with a winner!
        }
    };

    this.checkForWinner = function() {
        if (this.game.isWinner()) {
            this.stopGame();
            this.view.showWinner();
            this.view.soundWinner();
            return true;
        } else {
            return false;
        }
    };

    this.bindModelsAndViews();
};

