/******************************************************************************

	wood.comp-loader.js
	Andy Knoll
	December 2018
    
    requires 
    
        jQuery
        wood.ImageLoader

    loader = new wood.CompLoader("loader", parent, "parent-tag");

******************************************************************************/

// wood.CompLoader class
wood.CompLoader = function(name, parent) {
    wood.ImageLoader.call(this, name, parent);
    this._className = "wood.CompLoader";
    this.cssClass = "loader-comp";      // default

};
wood.CompLoader.prototype = Object.create(wood.ImageLoader.prototype);
wood.CompLoader.prototype.constructor = wood.CompLoader;

// getters
wood.ImageLoader.prototype.comp = function(idx) { return this._comps[idx]; };
wood.ImageLoader.prototype.compCount = function() { return this._comps.length; };

wood.CompLoader.prototype.info = function() {
	var s = "";
    s += wood.ImageLoader.prototype.info.call(this);
	return s;
};

// override this in specific loaders (CardLoader creates Cards, etc.)
wood.CompLoader.prototype._createCompAs = function(name, parent, elemId) {
    return new wood.Component(name, parent, elemId);
};


// public API

wood.CompLoader.prototype.createComp = function(id, parentElem) {
    var elem = this.createElement(id, parentElem);
    var elemId = id;
    //this.appendElementTo(elem, parentElem);              // elem now gets appended when creating
    var comp = this._createCompAs(elemId, this, elemId);   // create as specific type (Card, etc.)
    return comp;
};

wood.CompLoader.prototype.appendCompTo = function(comp, targetElem) {
};


// similar to setElementBackground() but passes in comp
wood.ImageLoader.prototype.setCompBackground = function(comp, idx) {
    this.setElementBackground(comp.elem(), idx);
};

