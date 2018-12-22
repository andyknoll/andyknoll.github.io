/******************************************************************************

	bj.game-start-ctrl.js
	Andy Knoll
	December 2018

	Handles the "START" phase of the Blackjack Game
	Calls Game and then View methods.
    
******************************************************************************/

// bj.GameStartCtrl class
bj.GameStartCtrl = function(name, parent) {
    wood.Controller.call(this, name, parent);
    this._className = "bj.GameStartCtrl";
};
bj.GameStartCtrl.prototype = Object.create(wood.Controller.prototype);
bj.GameStartCtrl.prototype.constructor = bj.GameStartCtrl;

// convenience getters
bj.GameStartCtrl.prototype.appGame  = function() { return this.models().appGame;  };
bj.GameStartCtrl.prototype.appComp  = function() { return this.views().appComp;   };
bj.GameStartCtrl.prototype.gameCtrl = function() { return this.parent().gameCtrl; };


bj.GameStartCtrl.prototype.currPlayer = function() { 
	return this.appGame().currPlayer(); 
};
bj.GameStartCtrl.prototype.currPlayerIsDealer = function() { 
	return this.appGame().currPlayerIsDealer(); 
};
bj.GameStartCtrl.prototype.getNextPlayer = function() { 
	return this.appGame().getNextPlayer(); 
};

// utility method
bj.GameStartCtrl.prototype.pauseThenCall = function(msecs, method) {
	var self = this;
    setTimeout(() => { method.call(self); }, msecs);  // keep in context
};





// Game flow methods - launched by gameCtrl

// 1
bj.GameStartCtrl.prototype.initGame = function() { 
	var game = this.appGame();
	game.initGame();				// no callback!
	this.appComp().initGame(game);	// use appComp!
	this.pauseThenCall(1000, this.initGameCompleted);
};

// callback when Game.initGame() is completed
bj.GameStartCtrl.prototype.initGameCompleted = function() { 
	this.initRounds();		// call next step
};


// 2
bj.GameStartCtrl.prototype.initRounds = function() { 
	this.appGame().initRounds();
	this.appComp().initRounds(this.appGame());
	this.pauseThenCall(1000, this.initRoundsCompleted);
};

bj.GameStartCtrl.prototype.initRoundsCompleted = function() { 
	this.playRounds();		// call next step
};

// 3
bj.GameStartCtrl.prototype.playRounds = function() { 
	this.appGame().playRounds();
	this.appComp().playRounds(this.appGame());
	this.pauseThenCall(1000, this.playRoundsCompleted);
};

bj.GameStartCtrl.prototype.playRoundsCompleted = function() { 
	this.initRound();		// call next step
};

// 4
bj.GameStartCtrl.prototype.initRound = function() { 
	this.appGame().initRound();
	this.appComp().initRound(this.appGame());
	this.pauseThenCall(1000, this.initRoundCompleted);
};

bj.GameStartCtrl.prototype.initRoundCompleted = function() { 
	this.playRound();		// call next step
};

// 5
bj.GameStartCtrl.prototype.playRound = function() { 
	this.appGame().playRound();
	this.appComp().playRound(this.appGame());
	this.pauseThenCall(1000, this.playRoundCompleted);
};

bj.GameStartCtrl.prototype.playRoundCompleted = function() { 
	if (this.currPlayerIsDealer()) {
		this.shuffleDeck();			// call next step after Dealer
	} else {
		this.getNextPlayer();
		this.playRound();		// stay in "loop" 4 times
	}
};

// 6
bj.GameStartCtrl.prototype.shuffleDeck = function() { 
	this.appGame().shuffleDeck();
	this.appComp().shuffleDeck(this.appGame());
	this.pauseThenCall(2000, this.shuffleDeckCompleted);
};

bj.GameStartCtrl.prototype.shuffleDeckCompleted = function() { 
	this.placeAntes();		// call next step
};


// 7
bj.GameStartCtrl.prototype.placeAntes = function() { 
	this.appGame().placeAntes();
	this.appComp().placeAntes(this.appGame());
	this.pauseThenCall(1000, this.placeAntesCompleted);
};

bj.GameStartCtrl.prototype.placeAntesCompleted = function() { 
	this.placeAnte();		// call next step
};

// 8
bj.GameStartCtrl.prototype.placeAnte = function() { 
	this.appGame().placeAnte();
	this.appComp().placeAnte(this.appGame());
	this.pauseThenCall(1000, this.placeAnteCompleted);
};

bj.GameStartCtrl.prototype.placeAnteCompleted = function() { 
	if (this.currPlayerIsDealer()) {
		this.gameCtrl().startGameCompleted();	// switch back
	} else {
		this.getNextPlayer();
		this.placeAnte();		// stay in "loop" 4 times
	}
};

