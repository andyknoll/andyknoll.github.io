/******************************************************************************

	bj.game.js
	Andy Knoll
	December 2018
    
    Blackjack Game classes

    Contains the following classes:

        bj.Game             // main Game object containing other classes

    Requires the following files:

        bj.players.js
        bj.decks.js
        bj.chips.js
        bj.hand.js
        
******************************************************************************/

// bj.Game class
bj.Game = function(name, parent) {
    wood.Model.call(this, name, parent);
    this._className = "bj.Game";

    this.multiDeck = null;
    this.players = null;        // includes Dealer as last Player

    this.gameState = bj.Game.STOPPED;       // using this?

    this.createGameObjects();
    this.initGameObjects();
};
bj.Game.prototype = Object.create(wood.Model.prototype);
bj.Game.prototype.constructor = bj.Game;

// getters
bj.Game.prototype.currPlayerIdx = function() { return this.players.currIndex(); };
bj.Game.prototype.currPlayer = function() { return this.players.currObject(); };
bj.Game.prototype.player = function(idx) { return this.players.player(idx); };
bj.Game.prototype.dealer = function() { return this.player(this.players.lastIndex()); };

// used as a check in callback methods
bj.Game.prototype.currPlayerIsDealer = function() { 
    return this.players.isLastObject();
};



bj.Game.prototype.createGameObjects = function() {
    this.createMultiDeck();
    this.createPlayers();
};

bj.Game.prototype.initGameObjects = function() {
    this.initMultiDeck();
    this.initPlayers();
};

bj.Game.prototype.createMultiDeck = function() {
    this.multiDeck = new bj.MultiDeck("multiDeck", this);
};

bj.Game.prototype.createPlayers = function() {
    var player = null;
    // create the collection
    this.players = new bj.Players("players", this);
    // add 3 players and the dealer
    player = new bj.Player("Vito", this.players);
    this.players.addPlayer(player);

    player = new bj.Player("Andy", this.players);
    player.isAutoPlay = false;                  // set false for human player
    this.players.addPlayer(player);

    player = new bj.Player("Michael", this.players);
    this.players.addPlayer(player);

    player = new bj.Dealer("Mr. Dealer", this.players);
    this.players.addPlayer(player);

    this.players.createAndAddChips(10, 20);     // 10 chips * $20 = $200 
    this.players.first();
};

bj.Game.prototype.initMultiDeck = function() {
    this.multiDeck.setDeckCount(2);
};

bj.Game.prototype.initPlayers = function() {
    //this.players.player(0).nickname = "Vito";
    //this.players.player(1).nickname = "Sonny";
    //this.players.player(2).nickname = "Michael";
};

// static utility function - no prototype
bj.Game.pauseThenCall = function(msecs, caller, func) {
    setTimeout(() => { func.call(caller)}, msecs);  // keep in context
};


// ??? still using these?
bj.Game.STOPPED = "STOPPED";
bj.Game.STARTED = "STARTED";
bj.Game.DEALING = "DEALING";
/*
SHUFFLING
BETTING
DEALING
PLAYING
SCORING
RECONCILING
COMPLETING
*/




// PUBLIC API

bj.Game.prototype.info = function() {
	var s = "";
    s += wood.Model.prototype.info.call(this);      // call base
    s += "<br>";
    s += ".multiDeck: <br>" + this.multiDeck.info() + "<br>";
    s += ".dealer: <br>"    + this.dealer().info()    + "<br>";
    s += ".players: <br>"   + this.players.info()   + "<br>";
    s += ".gameState: "     + this.gameState        + "<br>";
	return s;
};

// convenience methods
bj.Game.prototype.setFirstPlayer = function() {
    return this.players.first();
};

bj.Game.prototype.getNextPlayer = function() {
    return this.players.next();
};

bj.Game.prototype.dealCardToCurrPlayer = function() {
    return this.dealer().dealCardTo(this.multiDeck, this.currPlayer());
};





// called once
bj.Game.prototype.initGame = function(ctrl, callback) {
    this.msg = "Game.initGame";
    if (!this.setFirstPlayer()) return false;
    bj.Game.pauseThenCall(1000, ctrl, callback);
    return true;
};

// called once
bj.Game.prototype.initRounds = function(ctrl, callback) {
    this.msg = "Game.initRounds";
    this.setFirstPlayer();
    bj.Game.pauseThenCall(1000, ctrl, callback);
};

// called once
bj.Game.prototype.playRounds = function(ctrl, callback) {
    this.msg = "Game.playRounds";
    this.setFirstPlayer();
    bj.Game.pauseThenCall(1000, ctrl, callback);
};

// called once per round
bj.Game.prototype.initRound = function(ctrl, callback) {
    this.msg = "Game.initRound";
    this.setFirstPlayer();
    bj.Game.pauseThenCall(1000, ctrl, callback);
};

// called once per round
bj.Game.prototype.shuffleDeck = function(ctrl, callback) {
    this.msg = "Game.shuffleDeck";
    this.multiDeck.shuffle();
    bj.Game.pauseThenCall(2000, ctrl, callback);
};

bj.Game.prototype.playRound = function(ctrl, callback) {
    this.msg = "Game.playRound";
    //this.getNextPlayer(); // not yet...
    bj.Game.pauseThenCall(2000, ctrl, callback);
};

// STOPPING HERE FOR NOW...

// TO DO:
// placeAntes()
// dealFirstCards()
// playPlayersHands()
// scorePlayersHands()
// reconcileBets()
// completeRound()



// this must "loop" in the controller
bj.Game.prototype.placeBets = function() {
    this.msg = "Game.placeBets";
    this.setFirstPlayer();
};

bj.Game.prototype.placeBet = function() {
    this.msg = "Game.placeBet";
};

bj.Game.prototype.placeRandomAnte = function(game) {
    this.msg = "Game.placeRandomAnte";
    this.currPlayer().placeRandomAnte();
};

bj.Game.prototype.addChipToAnte = function(game) {
    this.msg = "Game.addChipToAnte";
    this.currPlayer().addChipToAnte();
};

bj.Game.prototype.removeChipFromAnte = function(game) {
    this.msg = "Game.removeChipFromAnte";
    this.currPlayer().removeChipFromAnte();
};


// this must "loop" in the controller
bj.Game.prototype.dealFirstCards = function() {
    this.msg = "Game.dealFirstCards";
    this.setFirstPlayer();
};

bj.Game.prototype.dealPlayerFirstCards = function() {
    this.msg = "Game.dealPlayerFirstCards";
    this.dealCardToCurrPlayer();
};





// this must "loop" in the controller
bj.Game.prototype.playPlayersHands = function() {
    this.msg = "Game.playPlayersHands";
    this.setFirstPlayer();
};

bj.Game.prototype.playPlayerHand = function() {
    this.msg = "Game.playPlayerHand";
};

bj.Game.prototype.playerHit = function() {
    this.msg = "Game.playerHit";
    this.dealCardToCurrPlayer();
};

bj.Game.prototype.playerStay = function() {
    this.msg = "Game.playerStay";
    //this.getNextPlayer();
};




bj.Game.prototype.scorePlayersHands = function() {
    this.msg = "Game.scorePlayersHands";
    this.setFirstPlayer();
};

bj.Game.prototype.scorePlayerHand = function() {
    this.msg = "Game.scorePlayerHand";
};





/*
bj.Game.prototype.scoreDealerHand = function() {
    this.msg = "Game.scoreDealerHand";
};
*/

bj.Game.prototype.reconcileBets = function() {
    this.msg = "Game.reconcileBets";
    this.setFirstPlayer();
};

bj.Game.prototype.completeRound = function() {
    this.msg = "Game.completeRound";
    this.setFirstPlayer();
};

