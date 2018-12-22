/******************************************************************************

	bj.app-comp.js
	Andy Knoll
	December 2018
    
    The main root UI component for the Blackjack Game.
    
    Currently contains only two child components:

        scoreBoard
        screensComp

	Requires:

		bj.scoreboard-comps.js
		bj.screen-comps.js
		
******************************************************************************/

// bj.AppComp class - contains all other components
bj.AppComp = function(name, parent, elemId) {
    wood.Panel.call(this, name, parent, elemId);
    this._className = "bj.AppComp";
};
bj.AppComp.prototype = Object.create(wood.Panel.prototype);
bj.AppComp.prototype.constructor = bj.AppComp;

// convenience getters
bj.AppComp.prototype.tableComp = function() { return this.screensComp.tableScreenComp.tableComp; };
bj.AppComp.prototype.deckComp = function() { return this.tableComp().deckComp; };


bj.AppComp.prototype._template = function() {
    var t = "";
    //t += "<div id='splash-comp'></div>";      // Splash screen should be here
    t += "<div id='scoreboard-comp'></div>";
    t += "<div id='screens-comp'></div>";
    return t;
};

bj.AppComp.prototype._createChildComps = function() {
    this.scoreBoardComp = new bj.ScoreBoardComp("scoreBoardComp", this, "scoreboard-comp");
    this.screensComp = new bj.ScreensComp("screensComp", this, "screens-comp");
};


bj.AppComp.prototype.clearAllPlayers = function() {
    this.tableComp().clearAllPlayers();
};


// delegate these to the tableComp - pass through methods

// called by gameStartCtrl

bj.AppComp.prototype.initGame = function(game) {
    this.tableComp().initGame(game);
};

bj.AppComp.prototype.initRounds = function(game) {
    this.tableComp().initRounds(game);
};

bj.AppComp.prototype.playRounds = function(game) {
    this.tableComp().playRounds(game);
};

bj.AppComp.prototype.initRound = function(game) {
    this.tableComp().initRound(game);
};

bj.AppComp.prototype.playRound = function(game) {
    this.tableComp().playRound(game);
};

bj.AppComp.prototype.shuffleDeck = function(game) {
    this.tableComp().shuffleDeck(game);
};

bj.AppComp.prototype.placeAntes = function(game) {
    this.tableComp().placeAntes(game);
};

bj.AppComp.prototype.placeAnte = function(game) {
    this.tableComp().placeAnte(game);
};

// called by gamePlayCtrl

bj.AppComp.prototype.dealFirstCards = function(game) {
    this.tableComp().dealFirstCards(game);
};

bj.AppComp.prototype.dealCardTo = function(game) {
    this.tableComp().dealCardTo(game);
};

bj.AppComp.prototype.playPlayersHands = function(game) {
    this.tableComp().playPlayersHands(game);
};

bj.AppComp.prototype.playPlayerHand = function(game) {
    this.tableComp().playPlayerHand(game);
};

bj.AppComp.prototype.playerHit = function(game) {
    this.tableComp().playerHit(game);
};

bj.AppComp.prototype.playerStay = function(game) {
    this.tableComp().playerStay(game);
};

bj.AppComp.prototype.playerBust = function(game) {
    this.tableComp().playerBust(game);
};

