/******************************************************************************

	bj.hand.js
	Andy Knoll
	December 2018
    
    Blackjack Hand class

    Contains the following classes:

        bj.Hand             // collection of Card objects

******************************************************************************/

// bj.Hand class
bj.Hand = function(name, parent) {
    wood.Collection.call(this, name, parent);
    this._className = "bj.Hand";

    // this.action()
    // this.outcome()
};
bj.Hand.prototype = Object.create(wood.Collection.prototype);
bj.Hand.prototype.constructor = bj.Hand;

// getters
bj.Hand.prototype.card = function(idx) { return this.object(idx); };
bj.Hand.prototype.isBusted = function() { return this.points() > 21; };


bj.Hand.prototype.addCard = function(card) {
    return this.addObject(card);
};

bj.Hand.prototype.points = function() {
    var total = 0;
    for (var i = 0; i < this.count(); i++) {
        total += this.card(i).points();
    }
    // subtract 10 if at least one ace
    // if ((total > 21) && (this.hasAce())) total -= 10;
    return total;
};

bj.Hand.prototype.numAces = function() { 
    var total = 0;
    for (var i = 0; i < this.count(); i++) {
        if (this.card(i).value == "A") total++;
    }
    return total;
};

// bj.Hand.prototype.numAces = function() { 


bj.Hand.prototype.faces = function() {
    var s = "";
    for (var i = 0; i < this.count(); i++) {
        s += this.card(i).face() + " ";
    }
    return s;
};

bj.Hand.prototype.info = function() {
	var s = "";
    s += wood.Collection.prototype.info.call(this);      // call base
    s += ".points: "  + this.points() + "<br>"
    s += ".numAces: " + this.numAces() + "<br>"
	return s;
};

bj.Hand.prototype.action = function() {
    // TO DO : USE STRATEY GRIDS
    if (this.points() <= 13) {         // WRONG! TEST ONLY! REMOVE!
        return "HIT";
    } else {
        return "STAY";
    }
};
