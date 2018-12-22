/******************************************************************************

	bj.game-play-ctrl.js
	Andy Knoll
	December 2018
    
******************************************************************************/

// bj.GamePlayCtrl class
bj.GamePlayCtrl = function(name, parent) {
    wood.Controller.call(this, name, parent);
    this._className = "bj.GamePlayCtrl";
};
bj.GamePlayCtrl.prototype = Object.create(wood.Controller.prototype);
bj.GamePlayCtrl.prototype.constructor = bj.GamePlayCtrl;

// convenience getters
bj.GamePlayCtrl.prototype.appGame  = function() { return this.models().appGame;  };
bj.GamePlayCtrl.prototype.appComp  = function() { return this.views().appComp;   };
bj.GamePlayCtrl.prototype.gameCtrl = function() { return this.parent().gameCtrl; };


bj.GamePlayCtrl.prototype.currPlayer = function() { 
	return this.appGame().currPlayer(); 
};
bj.GamePlayCtrl.prototype.currPlayerIsDealer = function() { 
	return this.appGame().currPlayerIsDealer(); 
};
bj.GamePlayCtrl.prototype.getNextPlayer = function() { 
	return this.appGame().getNextPlayer(); 
};

// utility method
bj.GamePlayCtrl.prototype.pauseThenCall = function(msecs, method) {
	var self = this;
    setTimeout(() => { method.call(self); }, msecs);  // keep in context
};





// Game flow methods - launched by gameCtrl

bj.GamePlayCtrl.prototype.dealFirstCards = function() { 
	this.appGame().dealFirstCards();
	this.appComp().dealFirstCards(this.appGame());
	this.pauseThenCall(1000, this.dealFirstCardsCompleted);
};

bj.GamePlayCtrl.prototype.dealFirstCardsCompleted = function() { 
	this.dealCardTo();
};



bj.GamePlayCtrl.prototype.dealCardTo = function() { 
	this.appGame().dealCardTo();
	this.appComp().dealCardTo(this.appGame());
	this.pauseThenCall(1000, this.dealCardToCompleted);
};

bj.GamePlayCtrl.prototype.dealCardToCompleted = function() { 
	// check for 8 card loop here!
	this.playPlayersHands();
};



bj.GamePlayCtrl.prototype.playPlayersHands = function() { 
	this.appGame().playPlayersHands();
	this.appComp().playPlayersHands(this.appGame());
	this.pauseThenCall(1000, this.playPlayersHandsCompleted);
};

bj.GamePlayCtrl.prototype.playPlayersHandsCompleted = function() { 
	this.playPlayerHand();
};



bj.GamePlayCtrl.prototype.playPlayerHand = function() { 
	this.appGame().playPlayerHand();
	this.appComp().playPlayerHand(this.appGame());
	this.pauseThenCall(1000, this.playPlayerHandCompleted);
};

bj.GamePlayCtrl.prototype.playPlayerHandCompleted = function() { 
	if (this.currPlayerIsDealer()) {
		this.appComp().clearAllPlayers();
		this.gameCtrl().playGameCompleted();	// switch back over to main Ctrl
	} else {
		this.getNextPlayer();
		this.playPlayerHand();		// stay in "loop" 4 times
	}
};


// Hit, Stay, Bust

bj.GamePlayCtrl.prototype.playerHit = function() { 
	this.appGame().playerHit();
	this.appComp().playerHit(this.appGame());
	this.pauseThenCall(1000, this.playerHitCompleted);
};

bj.GamePlayCtrl.prototype.playerHitCompleted = function() { 
	//playPlayerHand();
};

bj.GamePlayCtrl.prototype.playerStay = function() { 
	this.appGame().playerStay();
	this.appComp().playerStay(this.appGame());
	this.pauseThenCall(1000, this.playerStayCompleted);
};

bj.GamePlayCtrl.prototype.playerStayCompleted = function() { 
	//playPlayerHand();
};

bj.GamePlayCtrl.prototype.playerBust = function() { 
	this.appGame().playerBust();
	this.appComp().playerBust(this.appGame());
	this.pauseThenCall(1000, this.playerBustCompleted);
};

bj.GamePlayCtrl.prototype.playerBustCompleted = function() { 
	//playPlayerHand();
};

