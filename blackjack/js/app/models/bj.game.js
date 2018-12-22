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



// called by gameStartCtrl

// 1
bj.Game.prototype.initGame = function() {
    this.msg = "Game.initGame";
    if (!this.setFirstPlayer()) return false;
    return true;
};

// called once
bj.Game.prototype.initRounds = function() {
    this.msg = "Game.initRounds";
    this.setFirstPlayer();
};

// called once
bj.Game.prototype.playRounds = function() {
    this.msg = "Game.playRounds";
    this.setFirstPlayer();
};

// called once per round
bj.Game.prototype.initRound = function() {
    this.msg = "Game.initRound";
    this.setFirstPlayer();
};

// 5
bj.Game.prototype.playRound = function() {
    this.msg = "Game.playRound";
    //this.getNextPlayer(); // not yet...
};

bj.Game.prototype.shuffleDeck = function() {
    this.msg = "Game.shuffleDeck";
    this.multiDeck.shuffle();
};

// this must "loop" in the controller
bj.Game.prototype.placeAntes = function() {
    this.msg = "Game.placeAntes";
    this.setFirstPlayer();
};

// 8
bj.Game.prototype.placeAnte = function() {
    this.msg = "Game.placeAnte";
};

bj.Game.prototype.placeRandomAnte = function() {
    this.msg = "Game.placeRandomAnte";
    this.currPlayer().placeRandomAnte();
};

bj.Game.prototype.addChipToAnte = function() {
    this.msg = "Game.addChipToAnte";
    this.currPlayer().addChipToAnte();
};

bj.Game.prototype.removeChipFromAnte = function() {
    this.msg = "Game.removeChipFromAnte";
    this.currPlayer().removeChipFromAnte();
};



// called by gamePlayCtrl

// this must "loop" in the controller
bj.Game.prototype.dealFirstCards = function() {
    this.msg = "Game.dealFirstCards";
    this.setFirstPlayer();
};

bj.Game.prototype.dealCardTo = function() {
    this.msg = "Game.dealCardTo";
};

bj.Game.prototype.playPlayersHands = function() {
    this.msg = "Game.playPlayersHands";
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




// called by gameFinishCtrl

bj.Game.prototype.scorePlayersHands = function() {
    this.msg = "Game.scorePlayersHands";
    this.setFirstPlayer();
};

bj.Game.prototype.scorePlayerHand = function() {
    this.msg = "Game.scorePlayerHand";
};

bj.Game.prototype.reconcilePlayersAntes = function() {
    this.msg = "Game.reconcilePlayersAntes";
    this.setFirstPlayer();
};

bj.Game.prototype.reconcilePlayerAnte = function() {
    this.msg = "Game.reconcilePlayerAnte";
};

bj.Game.prototype.returnPlayersCards = function() {
    this.msg = "Game.returnPlayersCards";
    this.setFirstPlayer();
};

bj.Game.prototype.returnPlayerCards = function() {
    this.msg = "Game.returnPlayerCards";
};

bj.Game.prototype.completeRound = function() {
    this.msg = "Game.completeRound";
    this.setFirstPlayer();
};

