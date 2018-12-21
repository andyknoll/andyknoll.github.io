/******************************************************************************

	bj.players.js
	Andy Knoll
	December 2018
    
    Blackjack Player classes

    Contains the following classes:

        bj.Person           // common base class
        bj.Player           // has chips, bets
        bj.Dealer           // deals cards, collects/pays cash

    Requires bj.game

******************************************************************************/

// bj.Person
bj.Person = function(name, parent) {
    wood.Model.call(this, name, parent);
    this._className = "bj.Person";

    this.nickname = "";
    this.hand = new bj.Hand(this.name() + "_hand", this);
    this.isAutoPlay = true;
};
bj.Person.prototype = Object.create(wood.Model.prototype);
bj.Person.prototype.constructor = bj.Person;

// getters
bj.Person.prototype.cardCount = function() { return this.hand.count(); };
bj.Person.prototype.isBroke   = function() { return this.cash == 0; };
bj.Person.prototype.isBusted  = function() { return this.hand.isBusted(); };
bj.Person.prototype.action    = function() { return this.hand.action(); };     // TO DO : USE STRATEY GRIDS

bj.Person.prototype.info = function() {
	var s = "";
    s += wood.Model.prototype.info.call(this);      // call base
    s += ".nickname: "   + this.nickname     + "<br>"
    s += ".cardCount: "  + this.cardCount()  + "<br>"
    s += ".isBroke: "    + this.isBroke()    + "<br>"
    s += ".isBusted: "   + this.isBusted()   + "<br>"
    s += ".action: "     + this.action()     + "<br>"
    s += ".hand faces: " + this.hand.faces() + "<br>"
	return s;
};

bj.Person.prototype.addCardToHand = function(card) {
    return this.hand.addCard(card);
};





// bj.Player - has Chips, does not deal()
bj.Player = function(name, parent) {
    bj.Person.call(this, name, parent);
    this._className = "bj.Player";
    this.chips = new bj.Chips(this.name() + "_chips", this);        // UI only?
    this.ante  = new bj.Chips(this.name() + "_ante",  this);        // UI only?
    //this.cash = 200;        // for now... use config
};
bj.Player.prototype = Object.create(bj.Person.prototype);
bj.Player.prototype.constructor = bj.Player;

bj.Player.prototype.chipCount = function() { return this.chips.count(); };
bj.Player.prototype.chipValue = function() { return this.chips.value(); };
bj.Player.prototype.anteCount = function() { return this.ante.count(); };
bj.Player.prototype.anteValue = function() { return this.ante.value(); };

bj.Player.prototype.info = function() {
	var s = "";
    s += bj.Person.prototype.info.call(this);      // call base
    //s += ".cash: "      + this.cash + "<br>"
    //s += ".chips: <br>" + this.chips.info() + "<br>";
    //s += ".ante: <br>"  + this.ante.info()  + "<br>";
    s += ".chipCount: "  + this.chipCount()  + "<br>";
    s += ".chipValue: "  + this.chipValue()  + "<br>";
    s += ".anteCount: "  + this.anteCount()  + "<br>";
    s += ".anteValue: "  + this.anteValue()  + "<br>";
	return s;
};

bj.Player.prototype.addChip = function(chip) { 
    return this.chips.addChip(chip);
};

bj.Player.prototype.addChipToAnte = function() {
    if (this.chips.isEmpty()) return false;
    this.ante.addChip(this.chips.pop());
    return true;
};

bj.Player.prototype.removeChipFromAnte = function() {
    if (this.ante.isEmpty()) return false;
    this.chips.addChip(this.ante.pop());
    return true;
};

bj.Player.prototype.getRandomAnte = function() {
    var count = this.chipCount();
    var rnd = Math.floor(Math.random() * count) + 1;
    return rnd;
};

bj.Player.prototype.placeRandomAnte = function() {
    var rnd = this.getRandomAnte();
    for (var i = 0; i < rnd; i++) {
        // remove and place each chip in ante area
        this.addChipToAnte();
    }
};

bj.Player.prototype.addChip = function(chip) { 
    return this.chips.addChip(chip);
};





// bj.Dealer - does not have Chips, does not placeBet()
bj.Dealer = function(name, parent) {
    bj.Person.call(this, name, parent);
    this._className = "bj.Dealer";
    // this.pay()
    // this.collect()
};
bj.Dealer.prototype = Object.create(bj.Person.prototype);
bj.Dealer.prototype.constructor = bj.Dealer;

bj.Dealer.prototype.dealCardTo = function(deck, player) {
    var card = deck.getNextCard();
    return player.addCardToHand(card);
};

// overridden for Dealer
bj.Dealer.prototype.isBroke = function() { return false; };

// overridden for Dealer
bj.Dealer.prototype.action = function() { 
    if (this.hand.points() <= 17) {
        return "HIT";
    } else {
        return "STAY";
    }
};




// bj.Players
bj.Players = function(name, parent) {
    wood.Collection.call(this, name, parent);
    this._className = "bj.Players";

    // this.addPlayer()
};
bj.Players.prototype = Object.create(wood.Collection.prototype);
bj.Players.prototype.constructor = bj.Players;

// getter
bj.Players.prototype.player = function(idx) { return this.object(idx); };

bj.Players.prototype.addPlayer = function(player) {
    return this.addObject(player);
};

// the Dealer does not have chips
bj.Players.prototype.createAndAddChips = function(numChips, chipValue) {
    for (var i = 0; i < this.count() - 1; i++) {
        this.player(i).chips.createAndAddChips(numChips, chipValue);
    }   
};

