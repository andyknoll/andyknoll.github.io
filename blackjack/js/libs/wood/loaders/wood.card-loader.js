/******************************************************************************

	wood.card-loader.js
	Andy Knoll
	December 2018
    
    Allows pre-loading of images and access via API

    requires 
    
        jQuery
        wood.ImageLoader        // wood.image-loader.js
        wood.CompLoader         // wood.comp-loader.js

    loader = new wood.CardLoader("loader", parent, "parent-tag");

    12-17-2018

    removing the _comps[] array - does not store internally now
    removing the _elems[] array - does not store internally now

******************************************************************************/

// wood.CardLoader class
// wood.CardLoader = function(name, parent) {
wood.CardLoader = function(name, parent, relPath) {     // 12-20-2018 quick fix
    wood.CompLoader.call(this, name, parent);
    this._className = "wood.CardLoader";
    this.relPath = relPath;

    // hard-code the image names in the /img folder
    var paths = [ 
        "AS.png", "AC.png", "AH.png", "AD.png",
        "2S.png", "2C.png", "2H.png", "2D.png",
        "3S.png", "3C.png", "3H.png", "3D.png",
        "4S.png", "4C.png", "4H.png", "4D.png",
        "5S.png", "5C.png", "5H.png", "5D.png",
        "6S.png", "6C.png", "6H.png", "6D.png",
        "7S.png", "7C.png", "7H.png", "7D.png",
        "8S.png", "8C.png", "8H.png", "8D.png",
        "9S.png", "9C.png", "9H.png", "9D.png",
        "TS.png", "TC.png", "TH.png", "TD.png",
        "JS.png", "JC.png", "JH.png", "JD.png",
        "QS.png", "QC.png", "QH.png", "QD.png",
        "KS.png", "KC.png", "KH.png", "KD.png",
        "_back-red.png"
     ];
    this.setPaths(paths);
};
wood.CardLoader.prototype = Object.create(wood.CompLoader.prototype);
wood.CardLoader.prototype.constructor = wood.CardLoader;

// getters (aliases)
wood.CardLoader.prototype.card = function(idx) { return this.comp(idx); };
wood.CardLoader.prototype.cardCount = function() { return this.compCount(); };

// override this to create a CardComponent
wood.CardLoader.prototype._createCompAs = function(name, parent, elemId) {
    return new wood.CardComponent(name, parent, elemId);
};

// 12-17-2018 need to re-implement the "converter"

wood.CardLoader.prototype._convertValueToIndex = function(value) {
    switch(value) {
        case "A"  : return 0;
        case "2"  : return 1;
        case "3"  : return 2;
        case "4"  : return 3;
        case "5"  : return 4;
        case "6"  : return 5;
        case "7"  : return 6;
        case "8"  : return 7;
        case "9"  : return 8;
        case "0"  : return 9;        // allow 0 for 10
        case "10" : return 9;
        case "J"  : return 10;
        case "Q"  : return 11;
        case "K"  : return 12;
        default   : return 0;
    }
};

wood.CardLoader.prototype._convertSuitToIndex = function(suit) {
    switch(suit.toUpperCase()) {
        case "S"  : return 0;
        case "C"  : return 1;
        case "H"  : return 2;
        case "D"  : return 3;
        default   : return 0;
    }
};

wood.CardLoader.prototype._convertIndexToValue = function(idx) {
    switch(idx) {
        case 0  : return "A";
        case 1  : return "2";
        case 2  : return "3";
        case 3  : return "4";
        case 4  : return "5";
        case 5  : return "6";
        case 6  : return "7";
        case 7  : return "8";
        case 8  : return "9";
        case 9  : return "10";
        case 10 : return "J";
        case 11 : return "Q";
        case 12 : return "K";
        default : return 0;
    }
};

wood.CardLoader.prototype._convertIndexToSuit = function(idx) {
    switch(idx) {
        case 0 : return "S";
        case 1 : return "C";
        case 2 : return "H";
        case 3 : return "D";
        default   : return 0;
    }
};


// public API

// alias method - still passing the HTML parent element
wood.CardLoader.prototype.createCard = function(id, parentElem) {
    return this.createComp(id, parentElem);
};

// pass in parent wood component (not HTML element)
wood.CardLoader.prototype.createCardComp = function(id, parentComp) {
    return this.createComp(id, parentComp.elem());
};

// 2..10 J..A,  S C H D
wood.CardLoader.prototype.getImage = function(value, suit) {
    var v = this._convertValueToIndex(value);
    var s = this._convertSuitToIndex(suit);
    var idx = (v * 4) + s;      // index into array
    return this.image(idx);
};

wood.CardLoader.prototype.getPath = function(value, suit) {
    return this.getImage(value, suit).src;
};

// back is always in [52]
wood.CardLoader.prototype.getBackPath = function() {
    return this.path(52);
};

wood.CardLoader.prototype.setCustomBack = function(path) {
    this._paths[52] = path;
    this._images[52].src = path;
};









// wood.CardComponent class
wood.CardComponent = function(name, parent, elemId) {
    wood.VfxComponent.call(this, name, parent, elemId);
    this._className = "wood.CardComponent";
    this.value = "";
    this.suit = "";

    this._isUp = true;          // private properties
    this._ratioW = .6543;       // for these card images
    this._ratioH = 1.5282;
};
wood.CardComponent.prototype = Object.create(wood.VfxComponent.prototype);
wood.CardComponent.prototype.constructor = wood.CardComponent;

wood.CardComponent.prototype.isUp = function() { return this._isUp; }

wood.CardComponent.prototype.info = function() {
	var s = "";
    s += wood.VfxComponent.prototype.info.call(this);
    s += ".value: " + this.value + "<br>";
    s += ".suit: " + this.suit + "<br>";
	return s;
};

// can only set when showing up at 0 degrees transform
wood.CardComponent.prototype.setValueAndSuit = function(value, suit) {
    if (!this._isUp) return;
    var v = this.parent()._convertValueToIndex(value);
    var s = this.parent()._convertSuitToIndex(suit);
    var idx = (v * 4) + s;      // index into array
    this.value = value;
    this.suit = suit;
    this.setCompBackground(idx);
};

wood.CardComponent.prototype.setRandomValueAndSuit = function() {
    if (!this._isUp) return;
    var v = Math.floor(Math.random() * 13);
    var s = Math.floor(Math.random() * 4);
    var idx = (v * 4) + s;      // index into array
    this.value = this.parent()._convertIndexToValue(v);
    this.suit  = this.parent()._convertIndexToSuit(s);
    this.setCardImage(idx);
};


wood.CardComponent.prototype.setCompBackground = function(idx) {
    if (!this._isUp) return;
    this.parent().setCompBackground(this, idx);
};

// alias for above
wood.CardComponent.prototype.setCardImage = function(idx) {
    if (!this._isUp) return;
    this.parent().setCompBackground(this, idx);
};

wood.CardComponent.prototype.setCardImageToBack = function() {
    this.setCardImage(52);
};


// enforces correct H/W ratio
wood.CardComponent.prototype.setWidth = function(w) {
    this.setCss("width", w);
    this.setCss("height", w * this._ratioH);
};

// enforces correct H/W ratio
wood.CardComponent.prototype.setHeight = function(h) {
    this.setCss("height", h);
    this.setCss("width", h * this._ratioW);
};

wood.CardComponent.prototype.setTop = function(top) {
    this.setCss("top", top);
};

wood.CardComponent.prototype.setLeft = function(left) {
    this.setCss("left", left);
};


// animations
wood.CardComponent.prototype.moveTo = function(top, left, dur, delay) {
    var props = { top: top, left: left };
    this.animate(props, dur, delay);
};

wood.CardComponent.prototype.flipDown = function(dur, delay) {
    if (!this._isUp) return;
    // swap background halfway through
    this.onAnimComplete = function(anim) { 
        this.setCompBackground(52);
        this._isUp = false;      // must set after!
        this.onAnimComplete = null;
        this.animate({ rotationY : 180 }, dur/2, 0);
    };
    this.animate({ rotationY :  90 }, dur/2, delay);
};

wood.CardComponent.prototype.flipUp = function(dur, delay) {
    if (this._isUp) return;
    // swap background halfway through
    this.onAnimComplete = function(anim) { 
        this._isUp = true;      // must set before!
        this.setValueAndSuit(this.value, this.suit);
        this.onAnimComplete = null;
        this.animate({ rotationY : 0 }, dur/2, 0);
    };
    this.animate({ rotationY :  90 }, dur/2, delay);
};

