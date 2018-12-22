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

	The are setTimeout delays on these methods to simulate real time.

	The Game methods are called and then the View (component) is passed 
	the updated game object to update the screen.

	View animations now run independently and calls are "throttled back"
	so no events are required to be sent from the View to notify completion.

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
bj.GameCtrl.prototype.screensComp = function() { return this.appComp().screensComp; };
bj.GameCtrl.prototype.scoreBoardComp = function() { return this.appComp().scoreBoardComp; };

bj.GameCtrl.prototype.gameStartCtrl  = function() { return this.parent().gameStartCtrl; };
bj.GameCtrl.prototype.gamePlayCtrl   = function() { return this.parent().gamePlayCtrl; };
bj.GameCtrl.prototype.gameFinishCtrl = function() { return this.parent().gameFinishCtrl; };

/***
// use these to access others models and views
bj.GameCtrl.prototype.scoreBoardCtrl = function() { return this.parent().scoreBoardCtrl; };

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
***/

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

// utility method
bj.GameCtrl.prototype.pauseThenCall = function(msecs, method) {
	var self = this;
    setTimeout(() => { method.call(self); }, msecs);  // keep in context
};


// SWITCH TO GAME-START CONTROLLER HERE

// called by clicking tableComp.buttonPlay
bj.GameCtrl.prototype.startGame = function() { 
	this.showMessage("Starting Blackjack game");
	//this.initGame();
	this.gameStartCtrl().initGame();
};

bj.GameCtrl.prototype.startGameCompleted = function() { 
	this.playGame();
};



// SWITCH TO GAME-PLAY CONTROLLER HERE

// called by GameStartCtrl.placeAnteCompleted
bj.GameCtrl.prototype.playGame = function() { 
	this.showMessage("Playing Blackjack game.");
	this.gamePlayCtrl().dealFirstCards();
};

bj.GameCtrl.prototype.playGameCompleted = function() { 
	this.finishGame();
};



// SWITCH TO GAME-FINISH CONTROLLER HERE

// called by GameStartCtrl.placeAnteCompleted
bj.GameCtrl.prototype.finishGame = function() { 
	this.showMessage("Finishing Blackjack game.");
	this.gameFinishCtrl().initGame();
};

bj.GameCtrl.prototype.playGameCompleted = function() { 
	this.playNextRound();
};


bj.GameCtrl.prototype.playNextRound = function() { 
	this.showMessage("Game over - play another round?");
	// stop
};

