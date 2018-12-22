/******************************************************************************

	bj.player-comps.js
	Andy Knoll
	December 2018

	PlayerComp
	DealerComp
	HandComp
    ChipsComp
    
    DeckComp            // just to put somewhere
    
******************************************************************************/



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

