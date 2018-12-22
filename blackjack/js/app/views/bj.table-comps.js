/******************************************************************************

	bj.table-comps.js
	Andy Knoll
	December 2018

    Holds the main UI Table component for the Blackjack Game.

    TableComp
    DeckComp
    
******************************************************************************/

// bj.TableComp class
bj.TableComp = function(name, parent, elemId) {
    wood.Panel.call(this, name, parent, elemId);
    this._className = "bj.TableComp";
    // NEED THESE PROPS! prallel structure to game
    // this.players
    // this.deck
    // this.dealer
    // ALSO NEED A PLAYERS COLLECTION! currPlayer() setCurrPlayer(i)
};
bj.TableComp.prototype = Object.create(wood.Panel.prototype);
bj.TableComp.prototype.constructor = bj.TableComp;

// getters - TableComp lives on TableScreenComp (for now...)
bj.TableComp.prototype.screensComp = function() { return this.parent().parent(); };

bj.TableComp.prototype.scoreBoardComp = function() {
    return this.screensComp().parent().scoreBoardComp;
};

// these display in the scoreBoardComp
bj.TableComp.prototype.showMessage = function(s) {
    this.scoreBoardComp().showMessage(s)
};

bj.TableComp.prototype._template = function() {
    var t = "";
	//t += "TableComp";
    t += "<div id='deck-comp' class=''></div>";
    t += "<div id='pile-comp' class='card-comp'></div>";
    // TO DO: need to put players in a Collection
    t += "<div id='players'>";
    t += "  <div id='player-0'  class='player-comp'></div>";
    t += "  <div id='player-1'  class='player-comp'></div>";
    t += "  <div id='player-2'  class='player-comp'></div>";
    t += "  <div id='dealer'    class='player-comp'></div>";
    t += "</div>";
    t += "<div id='bj-logo'></div>";
    t += "<button id='button-instr' class='button-a'></button>";
    t += "<button id='button-settings' class='button-a'></button>";
    t += "<button id='button-play' class='button-a'></button>";
    return t;
};

bj.TableComp.prototype._createChildComps = function() {
    // TO DO: need to put players in a Collection
    this.player0 = new bj.PlayerComp("player0", this, "player-0");
    this.player1 = new bj.PlayerComp("player1", this, "player-1");
    this.player2 = new bj.PlayerComp("player2", this, "player-2");
    this.dealer  = new bj.DealerComp("dealer",  this, "dealer");

    // buttons
    this.buttonInstr    = new wood.Button("buttonInstr",    this, "button-instr");
    this.buttonSettings = new wood.Button("buttonSettings", this, "button-settings");
    this.buttonPlay     = new wood.Button("buttonPlay",     this, "button-play");

    // TO DO: create all other supporting comps
    var relPath = "js/libs/wood/loaders/";
    this.cardLoader = new wood.CardLoader("cardLoader", this, relPath); // quick fix
    this.cardLoader.cssClass = "deck-card";     // when creating cards
    this.cardLoader.loadImages();       // MUST CALL THIS NOW! until in preLoader

    // create AFTER cardLoader
    this.deckComp = new bj.DeckComp("deckComp", this, "deck-comp");
};

bj.TableComp.prototype._initChildComps = function() {
    this.buttonInstr.setLabel("INSTRUCTIONS");
    this.buttonSettings.setLabel("GAME SETTINGS");
    this.buttonPlay.setLabel("PLAY BLACKJACK!");

    // test only - set these from the Game object!!!!!!!!!!!!!!!!!

    var cash = 200;
    // nickname ???
    this.player0.setProp("name", "Vito");
    this.player0.setProp("cash", "Cash $ " + cash);
    //this.player0.addCssClass("player-current");     // REMOVE - TEST ONLY

    this.player1.setProp("name", "Andy");
    this.player1.setProp("cash", "Cash $ " + cash);

    this.player2.setProp("name", "Michael");
    this.player2.setProp("cash", "Cash $ " + cash);

    this.dealer.setProp("name", "Mr. Dealer");  
};

// TableComp visual effects

// this TableComp should track its own currPlayer!
bj.TableComp.prototype.currPlayerComp = function(idx) {
    switch(idx) {
        case 0 : return this.player0;       // should be players.player(0)
        case 1 : return this.player1;
        case 2 : return this.player2;
        case 3 : return this.dealer;
    }
};

bj.TableComp.prototype.clearAllPlayers = function() {
    this.player0.removeCssClass("player-current");
    this.player1.removeCssClass("player-current");
    this.player2.removeCssClass("player-current");
    this.dealer.removeCssClass("player-current");

    this.player0.removeCssClass("player-busted");
    this.player1.removeCssClass("player-busted");
    this.player2.removeCssClass("player-busted");
    this.dealer.removeCssClass("player-busted");
};

// replace these with a single call passing "status" or something
// REFACTOR THIS TO THE PLAYER COMP!
bj.TableComp.prototype.showCurrPlayer = function(game) {
    var currPlayer = game.currPlayer(); // object - not a comp
    var currIdx = game.currPlayerIdx();
    var currPlayerComp = this.currPlayerComp(currIdx);
    var counter = -1;

    this.showMessage("Current Player: " + currPlayer.name());
    // update ScoreBoard Player field too

    this.clearAllPlayers();
    var timer = setInterval(() => {
        counter++;
        if (counter > 6) {
            clearInterval(timer);
            return;
        }
        if (counter % 2 == 0)
            currPlayerComp.addCssClass("player-current");
        else
            currPlayerComp.removeCssClass("player-current");
    }, 100);
};

// REFACTOR THIS TO THE PLAYER COMP!
bj.TableComp.prototype.showCurrPlayerBusted = function(game) {
    var currPlayer = game.currPlayer(); // object - not a comp
    var currIdx = game.currPlayerIdx();
    var currPlayerComp = this.currPlayerComp(currIdx);
    var counter = -1;

    this.showMessage("Current Player: " + currPlayer.name() + " BUSTED!");
    // update ScoreBoard Player field too

    this.clearAllPlayers();
    var timer = setInterval(() => {
        counter++;
        if (counter > 6) {
            clearInterval(timer);
            return;
        }
        if (counter % 2 == 0)
            currPlayerComp.addCssClass("player-busted");
        else
            currPlayerComp.removeCssClass("player-busted");
    }, 100);
};

////////////////////////////////////////////////////////////////////////////


bj.TableComp.prototype.initGame = function(game) {
    this.showMessage("TableComp Initialize game");
    this.clearAllPlayers();
    //this.scoreBoardComp().clearCurrPlayer();
};

bj.TableComp.prototype.initRounds = function(game) {
	this.showMessage("TableComp Initialize rounds");
};

bj.TableComp.prototype.playRounds = function(game) {
	this.showMessage("TableComp Playing rounds");
};

bj.TableComp.prototype.initRound = function(game) {
	this.showMessage("TableComp Initialize round");
    this.clearAllPlayers();
};

bj.TableComp.prototype.playRound = function(game) {
    this.showMessage("TableComp Playing round");
    var currIdx = game.currPlayerIdx();

    if (currIdx == 1) {
        this.showCurrPlayerBusted(game);
        //this.scoreBoardComp().showCurrPlayerBusted(game);
    } else {
        this.showCurrPlayer(game);
        //this.scoreBoardComp().showCurrPlayer(game);
    }
};

bj.TableComp.prototype.shuffleDeck = function(game) {
    this.showMessage("Shuffling the deck");
    this.deckComp.showShuffle();
};

bj.TableComp.prototype.placeAntes = function(game) {
    this.showMessage("Players placing antes");
    this.clearAllPlayers();
};

bj.TableComp.prototype.placeAnte = function(game) {
    var currIdx = game.currPlayerIdx();
    this.showMessage("Getting ante for " + game.currPlayer().name());
    this.showCurrPlayer(game);
};


////////////////////////////////////////////////////////////////////////////


bj.TableComp.prototype.dealFirstCards = function(game) {
    this.showMessage("Dealing cards...");
    this.clearAllPlayers();
};

bj.TableComp.prototype.dealCardTo = function(game) {
    this.showMessage("Dealing card to " + game.currPlayer().name());
};

bj.TableComp.prototype.playPlayersHands = function(game) {
    this.showMessage("Playing hands...");
    this.clearAllPlayers();
};

bj.TableComp.prototype.playPlayerHand = function(game) {
    this.showMessage("Playing hand for " + game.currPlayer().name());
};

bj.TableComp.prototype.playerHit = function(game) {
    this.showMessage("playerHit");
    // anim card
};

bj.TableComp.prototype.playerStay = function(game) {
    this.showMessage("playerStay");
    // move on to next player
};

bj.TableComp.prototype.playerBust = function(game) {
    this.showMessage("playerBust");
    // anim player
};
