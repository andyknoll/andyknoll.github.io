/******************************************************************************

	bj.decks.js
	Andy Knoll
	December 2018
    
    Blackjack Deck classes

    Contains the following classes:

        bj.Card             // value and suit
        bj.MultiDeck        // can contain several decks of 52 cards

    Requires bj.game

******************************************************************************/

// bj.Card
bj.Card = function(name, parent) {
    wood.Model.call(this, name, parent);
    this._className = "bj.Card";
    this.value = "";
    this.suit = "";
};
bj.Card.prototype = Object.create(wood.Model.prototype);
bj.Card.prototype.constructor = bj.Card;

bj.Card.prototype.points = function() { 
    switch (this.value) {
        case "2"  : return 2;
        case "3"  : return 3;
        case "4"  : return 4;
        case "5"  : return 5;
        case "6"  : return 6;
        case "7"  : return 7;
        case "8"  : return 8;
        case "9"  : return 9;
        case "10" : return 10;
        case "J"  : return 10;
        case "Q"  : return 10;
        case "K"  : return 10;
        case "A"  : return 11;      // can change to 1
        default   : return 11;
    }
};

bj.Card.prototype.setValueAndSuit = function(value, suit) { 
    this.value = value;
    this.suit  = suit;
};

bj.Card.prototype.face = function() { 
    var s = this.value + this.suit;
    return s;
};




// bj.MultiDeck
// TO DO: make this a Deck with (n) decks
bj.MultiDeck = function(name, parent) {
    wood.Collection.call(this, name, parent);
    this._className = "bj.MultiDeck";

    this.values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    this.suits  = ["S", "C", "D", "H"];

    this._deckCount = 1;        // default
    this._createDecks();
};
bj.MultiDeck.prototype = Object.create(wood.Collection.prototype);
bj.MultiDeck.prototype.constructor = bj.MultiDeck;

// getters
bj.MultiDeck.prototype.card = function(idx) { return this.object(idx); };
bj.MultiDeck.prototype.cardCount = function() { return this.count(); };
bj.MultiDeck.prototype.deckCount = function() { return this._deckCount; };

bj.MultiDeck.prototype._createDecks = function() {
    var card = null;
    var i = 0;

    this.clear();
    for (var d = 0; d < this._deckCount; d++) {
        for (var v = 0; v < this.values.length; v++) {
            for (var s = 0; s < this.suits.length; s++) {
                card = new bj.Card(this.name() + "_card" + i, this);
                card.setValueAndSuit(this.values[v], this.suits[s]);
                this.addObject(card);
                i++;
            }
        }
    }
};

// PUBLIC API

bj.MultiDeck.prototype.setDeckCount = function(count) {
    if (count < 0) count = 1;
    if (count > 10) count = 10;     // set some limits
    this._deckCount = count;
    this._createDecks();
};


// bj.MultiDeck.prototype.shuffle - NOW IN BASE COLLECTION CLASS

bj.MultiDeck.prototype.getNextCard = function() {
    return this.next();
};

bj.MultiDeck.prototype.info = function() {
	var s = "";
    s += wood.Collection.prototype.infoShort.call(this);      // call base
    s += ".deckCount: " + this.deckCount() + "<br>"
    s += ".cardCount: " + this.cardCount() + "<br>"
	return s;
};


