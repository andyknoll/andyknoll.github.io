/******************************************************************************

	bj.table-comps.js
	Andy Knoll
	December 2018

    Holds the UI components for the Blackjack Game.
    The main components currently live on their own "screen" components.

    SplashComp
    TableComp
    AnteComp
    PlayComp
    DebugComp

	DeckComp
	PileComp
	DealerComp
	PlayerComp
	HandComp
	ChipsComp
    
******************************************************************************/

// bj.SplashComp class
bj.SplashComp = function(name, parent, elemId) {
    wood.Panel.call(this, name, parent, elemId);
    this._className = "bj.SplashComp";
    this.title = "";        // use setProp()
    this.descr = "";
};
bj.SplashComp.prototype = Object.create(wood.Panel.prototype);
bj.SplashComp.prototype.constructor = bj.SplashComp;

bj.SplashComp.prototype._template = function() {
    var t = "";
    t += "<div id='title' class='splash-title'>Blackjack 2018</div>";
    t += "<div id='descr' class='splash-descr'></div>";
    t += "<button id='splash-button' class='splash-button'></button>";
    return t;
};

bj.SplashComp.prototype._createChildComps = function() {
    this.splashButton = new wood.Button("buttonPlay", this, "splash-button");
};

bj.SplashComp.prototype._initChildComps = function() {
    //this.setProp("title", "this is the title");
    this.splashButton.setLabel("Let's Play!");
};







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
    t += "<button id='button-instr' class='button-a'>INSTRUCTIONS</button>";
    t += "<button id='button-settings' class='button-a'>GAME SETTINGS</button>";
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

    // test only - set these from the Game object!
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

bj.TableComp.prototype.clearCurrPlayer = function(game) {
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
bj.TableComp.prototype.showCurrPlayer = function(game) {
    var currPlayer = game.currPlayer(); // object - not a comp
    var currIdx = game.currPlayerIdx();
    var currPlayerComp = this.currPlayerComp(currIdx);
    var counter = -1;

    this.showMessage("Current Player: " + currPlayer.name());
    // update ScoreBoard Player field too

    this.clearCurrPlayer();
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

bj.TableComp.prototype.showCurrPlayerBusted = function(game) {
    var currPlayer = game.currPlayer(); // object - not a comp
    var currIdx = game.currPlayerIdx();
    var currPlayerComp = this.currPlayerComp(currIdx);
    var counter = -1;

    this.showMessage("Current Player: " + currPlayer.name() + " BUSTED!");
    // update ScoreBoard Player field too

    this.clearCurrPlayer();
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
    this.clearCurrPlayer();
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
};

bj.TableComp.prototype.shuffleDeck = function(game) {
    this.showMessage("TableComp shuffling deck component");
    this.deckComp.showShuffle();
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














////////////////////////////////////////////////////////////////////////////

// bj.AnteComp class
bj.AnteComp = function(name, parent, elemId) {
    wood.Panel.call(this, name, parent, elemId);
    this._className = "bj.AnteComp";
};
bj.AnteComp.prototype = Object.create(wood.Panel.prototype);
bj.AnteComp.prototype.constructor = bj.AnteComp;

bj.AnteComp.prototype._template = function() {
    var t = "";
	//t += "AnteComp";
    t += "<button id='button-incr' class='button-a'></button>";
    t += "<button id='button-decr' class='button-a'></button>";
    t += "<button id='button-ok'   class='button-a'></button>";
    return t;
};

bj.AnteComp.prototype._createChildComps = function() {
    this.buttonIncr = new wood.Button("buttonIncr", this, "button-incr");
    this.buttonDecr = new wood.Button("buttonDecr", this, "button-decr");
    this.buttonOK   = new wood.Button("buttonOK",   this, "button-ok");
    // create all other supporting comps
};

bj.AnteComp.prototype._initChildComps = function() {
    this.buttonIncr.setLabel("INCREASE ANTE");
    this.buttonDecr.setLabel("DECREASE ANTE");
    this.buttonOK.setLabel("OK");
};





// bj.PlayComp class
bj.PlayComp = function(name, parent, elemId) {
    wood.Panel.call(this, name, parent, elemId);
    this._className = "bj.PlayComp";
};
bj.PlayComp.prototype = Object.create(wood.Panel.prototype);
bj.PlayComp.prototype.constructor = bj.PlayComp;

bj.PlayComp.prototype._template = function() {
    var t = "";
	t += "PlayComp";
    t += "<div id='player-play' class='player-comp-big'></div>";
    t += "<button id='button-hit'  class='button-a'></button>";
    t += "<button id='button-stay' class='button-a'></button>";
    return t;
};

bj.PlayComp.prototype._createChildComps = function() {
    this.buttonHit  = new wood.Button("buttonHit",  this, "button-hit");
    this.buttonStay = new wood.Button("buttonStay", this, "button-stay");
    // create all other supporting comps
};

bj.PlayComp.prototype._initChildComps = function() {
    this.buttonHit.setLabel("HIT");
    this.buttonStay.setLabel("STAY");
};




// bj.DebugComp class
bj.DebugComp = function(name, parent, elemId) {
    wood.Panel.call(this, name, parent, elemId);
    this._className = "bj.DebugComp";
};
bj.DebugComp.prototype = Object.create(wood.Panel.prototype);
bj.DebugComp.prototype.constructor = bj.DebugComp;

bj.DebugComp.prototype._template = function() {
    var t = "";
    t += "<div id='display' class='display'></div>";
    t += "<div id='debug-buttons'>";
    t += "  <button id='button-0' class='button-b'></button>";
    t += "  <button id='button-1' class='button-b'></button>";
    t += "  <button id='button-2' class='button-b'></button>";
    t += "  <button id='button-3' class='button-b'></button>";
    t += "  <button id='button-4' class='button-b'></button>";
    t += "  <button id='button-5' class='button-b'></button>";
    t += "  <button id='button-6' class='button-b'></button>";
    t += "  <button id='button-7' class='button-b'></button>";
    t += "  <button id='button-8' class='button-b'></button>";
    t += "</div>";
    return t;
};

bj.DebugComp.prototype._createChildComps = function() {
    this.display = new wood.Display("display", this, "display");

    this.button0 = new wood.Button("button0", this, "button-0");
    this.button1 = new wood.Button("button1", this, "button-1");
    this.button2 = new wood.Button("button2", this, "button-2");
    this.button3 = new wood.Button("button3", this, "button-3");
    this.button4 = new wood.Button("button4", this, "button-4");
    this.button5 = new wood.Button("button5", this, "button-5");
    this.button6 = new wood.Button("button6", this, "button-6");
    this.button7 = new wood.Button("button7", this, "button-7");
    this.button8 = new wood.Button("button8", this, "button-8");
};

bj.DebugComp.prototype._initChildComps = function() {
    this.display.write("Welcome to the Debug Screen");

    this.button0.setLabel("clear");
    this.button1.setLabel("app info");
    this.button2.setLabel("appGame info");
    this.button3.setLabel("appCtrl info");
    this.button4.setLabel("");
    this.button5.setLabel("");
    this.button6.setLabel("");
    this.button7.setLabel("");
    this.button8.setLabel("close screen");
};

// just for testing
bj.DebugComp.prototype.info = function() {
	var s = "";
    s += wood.Panel.prototype.info.call(this);  // call base
    s += ".button0: " + this.button0.label;
	return s;
};

bj.DebugComp.prototype.clearDisplay = function() {
    this.display.clear();
};

bj.DebugComp.prototype.debug = function(s) {
    this.display.write(s);
};









// bj.PlayerComp class
bj.PlayerComp = function(name, parent, elemId) {
    wood.Panel.call(this, name, parent, elemId);
    this._className = "bj.PlayerComp";
    this.name = ""; // might need to use nickname
    this.cash = 200;
};
bj.PlayerComp.prototype = Object.create(wood.Panel.prototype);
bj.PlayerComp.prototype.constructor = bj.PlayerComp;

bj.PlayerComp.prototype._template = function() {
    var t = "";
    t += "<div id='name' class='player-comp-name'></div>";
    t += "<div id='cash' class='player-comp-cash'></div>";
    t += "<div class='player-comp-chips'>";
    t += "  <div class='player-comp-chip'></div>";
    t += "  <div class='player-comp-chips-ante'>$20</div>";
    t += "</div>";
    t += "<div class='player-comp-cards'>";
    t += "  <div class='player-card1 card-comp'></div>";
    t += "  <div class='player-card2 card-comp'></div>";
    t += "  <div class='player-card3 card-comp'></div>";
    t += "</div>";
    return t;
};

bj.PlayerComp.prototype._createChildComps = function() {
    // need Chips comp
    // need Cards comp
};

bj.PlayerComp.prototype._initChildComps = function() {
};



// bj.DealerComp class
bj.DealerComp = function(name, parent, elemId) {
    wood.Panel.call(this, name, parent, elemId);
    this._className = "bj.DealerComp";
    this.name = "";
};
bj.DealerComp.prototype = Object.create(wood.Panel.prototype);
bj.DealerComp.prototype.constructor = bj.DealerComp;

bj.DealerComp.prototype._template = function() {
    var t = "";
    t += "<div id='name' class='dealer-comp-name'></div>";
    t += "<div class='dealer-comp-cards'>";
    //t += "  <div class='dealer-card1 card-comp'></div>";
    //t += "  <div class='dealer-card2 card-comp'></div>";
    t += "</div>";
    return t;
};

bj.DealerComp.prototype._createChildComps = function() {
};

bj.DealerComp.prototype._initChildComps = function() {
};




// bj.DeckComp class - create AFTER CardLoader
bj.DeckComp = function(name, parent, elemId) {
    wood.Panel.call(this, name, parent, elemId);
    this._className = "bj.DeckComp";
};
bj.DeckComp.prototype = Object.create(wood.Panel.prototype);
bj.DeckComp.prototype.constructor = bj.DeckComp;

// getters
bj.DeckComp.prototype.tableComp = function() { return this.parent(); }
bj.DeckComp.prototype.cardLoader = function() { return this.tableComp().cardLoader; }

bj.DeckComp.prototype._template = function() {
    var t = "";
    //t += "<div id='top-card' class='card-comp'></div>";
    return t;
};

// append topCard to this deckComp
bj.DeckComp.prototype._createChildComps = function() {
    this.topCard = this.cardLoader().createCardComp("top-card", this);
};

bj.DeckComp.prototype._initChildComps = function() {
    this.topCard.setCardImageToBack();
};

// PUSH THIS TO THE DECK COMP!
bj.DeckComp.prototype.showShuffle = function() {
    var counter = -1;
    var cardLoader = this.cardLoader;

    var timer = setInterval(() => {
        counter++;
        if (counter > 40) {
            clearInterval(timer);
            this.topCard.setCardImageToBack();
            return;
        }
        this.topCard.setRandomValueAndSuit();
    }, 40);
};

