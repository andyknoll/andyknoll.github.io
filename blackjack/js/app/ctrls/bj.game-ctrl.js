/******************************************************************************

	bj.game-ctrl.js
	Andy Knoll
	December 2018

	This is the main controller which manages the game flow.

	Makes use of three sub-controllers to keep file sizes manageable.

		GameStartCtrl
		GamePlayCtrl
		GameFinishCtrl

	The basic pattern is that this (or the other) controllers make calls
	to the Game and View APIs simultaneously thus keeping them in sync.

	The are setTimeout delays on the Game methods to simulate real time.

	The Game is passed this controller and a callback after the delay.
	The View is passed the updated game object to update the screen.

	View animations now run independently and the Model is "throttled back"
	so no events are required from the View to notify completion.

	startRound = function() {
		game.startRound(this, callback);
		view.startRound(game);
	}
    
******************************************************************************/

// bj.GameCtrl class
bj.GameCtrl = function(name, parent) {
    wood.Controller.call(this, name, parent);
    this._className = "bj.GameCtrl";
};
bj.GameCtrl.prototype = Object.create(wood.Controller.prototype);
bj.GameCtrl.prototype.constructor = bj.GameCtrl;

// convenience getters
bj.GameCtrl.prototype.appGame = function() { return this.models().appGame; };	// "models"
bj.GameCtrl.prototype.appComp = function() { return this.views().appComp; };	// "views"

// use these to access others models and views
bj.GameCtrl.prototype.scoreBoardCtrl = function() { return this.parent().scoreBoardCtrl; };
bj.GameCtrl.prototype.scoreBoardComp = function() { return this.appComp().scoreBoardComp; };

bj.GameCtrl.prototype.screenCompsCtrl = function() { return this.parent().screenCompsCtrl; };
bj.GameCtrl.prototype.screensComp = function() { return this.appComp().screensComp; };

// remember that for now the "screens" are holding single components - will change that soon
// we are accessing these via the Controllers - should just use direct access!
bj.GameCtrl.prototype.tableScreenComp = function() { return this.screensComp().tableScreenComp; };
bj.GameCtrl.prototype.anteScreenComp  = function() { return this.screensComp().anteScreenComp;  };
bj.GameCtrl.prototype.playScreenComp  = function() { return this.screensComp().playScreenComp;  };
bj.GameCtrl.prototype.debugScreenComp = function() { return this.screensComp().debugScreenComp; };

bj.GameCtrl.prototype.tableComp = function() { return this.tableScreenComp().tableComp; };
bj.GameCtrl.prototype.anteComp  = function() { return this.anteScreenComp().anteComp;   };
bj.GameCtrl.prototype.playComp  = function() { return this.playScreenComp().playComp;   };
bj.GameCtrl.prototype.debugComp = function() { return this.debugScreenComp().debugComp; };


// PUBLIC API

bj.GameCtrl.prototype.showMessage = function(s) { 
	this.scoreBoardComp().showMessage(s);		// better
};

bj.GameCtrl.prototype.run = function() { 
	//alert("GameCtrl.run");

	this.screensComp().hideTableScreen();
	this.screensComp().hideAnteScreen();
	this.screensComp().hidePlayScreen();
	this.screensComp().hideDebugScreen();
	this.screensComp().hideSplashScreen();
	
	//this.screensComp().showSplashScreen();
	this.screensComp().showTableScreen();
};

bj.GameCtrl.prototype.currPlayer = function() { 
	return this.appGame().currPlayer(); 
};
bj.GameCtrl.prototype.currPlayerIsDealer = function() { 
	return this.appGame().currPlayerIsDealer(); 
};
bj.GameCtrl.prototype.getNextPlayer = function() { 
	return this.appGame().getNextPlayer(); 
};


// called by clicking tableComp.buttonPlay
bj.GameCtrl.prototype.startGame = function() { 
	this.showMessage("Starting Blackjack game");
	this.initGame();
};

// use multiple controllers to keep file sizes down?
// this.gameStartCtrl.run();
// this.gamePlayCtrl.run();
// this.gameFinishCtrl.run();


// GAME MODEL METHODS CALLED BY THE GAME CONTROLLER
// this is what controls the game "flow" and timing




// SWITCH TO GAME-START CONTROLLER HERE ?

// 1
bj.GameCtrl.prototype.initGame = function() { 
	//this.showMessage("GameCtrl Initialize game");
	if (this.appGame().initGame(this, this.initGameCompleted)) {
		//this.tableComp().initGame(this.appGame());
		this.appComp().initGame(this.appGame());	// should use appComp!
	} else {
		// error
	}
};

// callback when Game.initGame() is completed
bj.GameCtrl.prototype.initGameCompleted = function() { 
	this.showMessage("GameCtrl Initialize game completed");
	this.initRounds();		// call next step
};

// 2
bj.GameCtrl.prototype.initRounds = function() { 
	this.appGame().initRounds(this, this.initRoundsCompleted);
	this.tableComp().initRounds(this.appGame());
};

bj.GameCtrl.prototype.initRoundsCompleted = function() { 
	this.showMessage("GameCtrl Initialize rounds completed");
	this.playRounds();		// call next step
};

// 3
bj.GameCtrl.prototype.playRounds = function() { 
	this.appGame().playRounds(this, this.playRoundsCompleted);
	this.tableComp().playRounds(this.appGame());
};

bj.GameCtrl.prototype.playRoundsCompleted = function() { 
	this.showMessage("GameCtrl Play rounds completed");
	this.initRound();		// call next step
};

// 4
bj.GameCtrl.prototype.initRound = function() { 
	this.appGame().initRound(this, this.initRoundCompleted);
	this.tableComp().initRound(this.appGame());
};

bj.GameCtrl.prototype.initRoundCompleted = function() { 
	this.showMessage("GameCtrl Init round completed");
	this.shuffleDeck();		// call next step
};


// SWITCH TO GAME-PLAY CONTROLLER HERE ?

// 5
bj.GameCtrl.prototype.shuffleDeck = function() { 
	this.appGame().shuffleDeck(this, this.shuffleDeckCompleted);
	this.tableComp().shuffleDeck(this.appGame());
};

bj.GameCtrl.prototype.shuffleDeckCompleted = function() { 
	this.showMessage("GameCtrl shuffle Deck completed");
		this.playRound();		// call next step
};


// 6
bj.GameCtrl.prototype.playRound = function() { 
	this.appGame().playRound(this, this.playRoundCompleted);
	this.tableComp().playRound(this.appGame());
};

bj.GameCtrl.prototype.playRoundCompleted = function() { 
	this.showMessage("GameCtrl Play round completed");
	if (this.currPlayerIsDealer()) {
		this.stop();			// call next step after Dealer
	} else {
		this.getNextPlayer();
		this.playRound();		// stay in "loop" 4 times
	}
};


bj.GameCtrl.prototype.stop = function() { 
	this.showMessage("Round Completed.");
	this.tableComp().clearCurrPlayer();
};





// SWITCH TO GAME-FINISH CONTROLLER HERE ?
