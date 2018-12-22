/******************************************************************************

	bj.chips.js
	Andy Knoll
	December 2018
    
    Blackjack Chip and Chips classes

    Contains the following classes:

        bj.Chip             // basic Chip object with a value
        bj.Chips            // collection of Chip objects

******************************************************************************/

// bj.Chip class
bj.Chip = function(name, parent) {
    wood.Object.call(this, name, parent);
    this._className = "bj.Chip";
    this.value = 20;        // get this from confing file!
};
bj.Chip.prototype = Object.create(wood.Object.prototype);
bj.Chip.prototype.constructor = bj.Chip;





// bj.Chips class
bj.Chips = function(name, parent) {
    wood.Collection.call(this, name, parent);
    this._className = "bj.Chips";
};
bj.Chips.prototype = Object.create(wood.Collection.prototype);
bj.Chips.prototype.constructor = bj.Chips;

// getters
bj.Chips.prototype.chip = function(idx) { return this.object(idx); };

// add all chip values
bj.Chips.prototype.value = function() {
    var total = 0;
    for (var i = 0; i < this.count(); i++) {
        total += this.chip(i).value;
    }
    return total;
};

bj.Chips.prototype.createAndAddChips = function(numChips, chipValue) {
    var chip = null;
    if (numChips < 0) numChips = 0;
    if (numChips > 10) numChips = 10;       // set betting limmit
    for (var i = 0; i < numChips; i++) {
        chip = new bj.Chip("chip" + i, this);
        chip.value = chipValue;
        this.addChip(chip);
    }
};

bj.Chips.prototype.addChip = function(chip) {
    return this.addObject(chip);
};

bj.Chips.prototype.info = function() {
	var s = "";
    s += wood.Collection.prototype.info.call(this);      // call base
    s += ".value: " + this.value() + "<br>"
	return s;
};

