/******************************************************************************

	bj.components.js
	Andy Knoll
	December 2018
    
    Blackjack UI Component classes

    Contains the following classes:

        bj.TableComp        // holds all other UI components
        bj.DeckComp
        bj.AnteComp
        bj.DealerComp


        TO DO
        
        bj.PlayerComp
        bj.HandComp
        bj.ChipsComp

******************************************************************************/


// bj.TableComp class
bj.TableComp = function(name, parent, elemId) {
    wood.Component.call(this, name, parent, elemId);
    this._className = "bj.TableComp";
};
bj.TableComp.prototype = Object.create(wood.Component.prototype);
bj.TableComp.prototype.constructor = bj.TableComp;

bj.TableComp.prototype._template = function() {
    var t = "";
    //t += "<div id='table-comp' class='table-comp'>";
    t += "  <div id='deck-comp' class='deck-comp'></div>";
    t += "  <div id='ante-comp' class='ante-comp'></div>";
    t += "  <div id='dealer-comp' class='dealer-comp'></div>";
    t += "  <div id='player-comp' class='player-comp'></div>";
    //t += "</div>";
    return t;
};

bj.TableComp.prototype.setStyles = function() {
    this.setCss("position", "absolute");
    this.setCss("width", "580px");
    this.setCss("height", "500px");
    this.setCss("background-color", "#006600");
};





// bj.DeckComp class
bj.DeckComp = function(name, parent, elemId) {
    wood.Component.call(this, name, parent, elemId);
    this._className = "bj.DeckComp";
};
bj.DeckComp.prototype = Object.create(wood.Component.prototype);
bj.DeckComp.prototype.constructor = bj.DeckComp;

bj.DeckComp.prototype._template = function() {
    var t = "";
    //t += "<div id='deck-comp' class='deck-comp'></div>";
    return t;
};

bj.DeckComp.prototype.setStyles = function() {
    this.setCss("position", "absolute");
    this.setCss("top", "10px");
    this.setCss("left", "10px");
    this.setCss("width", "20%");
    this.setCss("height", "30%");
    //this.setCss("background-color", "#660000");
    this.setCss("border-radius", "10px");
};







// bj.AnteComp class
bj.AnteComp = function(name, parent, elemId) {
    wood.Component.call(this, name, parent, elemId);
    this._className = "bj.AnteComp";
};
bj.AnteComp.prototype = Object.create(wood.Component.prototype);
bj.AnteComp.prototype.constructor = bj.AnteComp;

bj.AnteComp.prototype._template = function() {
    var t = "";
    //t += "<div id='ante-comp' class='ante-comp'></div>";
    return t;
};

bj.AnteComp.prototype.setStyles = function() {
    this.setCss("position", "absolute");
    this.setCssTLHW("40%", "30%", "19%", "38%");
    this.setCss("border", "5px solid white");
};




// bj.DealerComp class
bj.DealerComp = function(name, parent, elemId) {
    wood.Component.call(this, name, parent, elemId);
    this._className = "bj.DealerComp";
    // props
    this.nickname = "";
};
bj.DealerComp.prototype = Object.create(wood.Component.prototype);
bj.DealerComp.prototype.constructor = bj.DealerComp;

bj.DealerComp.prototype._template = function() {
    var t = "";
    t += "<div id='nickname' class='dealer-nickname'></div>";
    return t;
};

bj.DealerComp.prototype.setStyles = function() {
    this.setCss("position", "absolute");
    this.setCssTLHW("5%", "40%", "15%", "20%");
    this.setCss("color", "black");
    this.setCss("border-radius", "50%");
    this.setCss("border", "2px solid red");
    this.setCss("background-color", "#eeeeee");
};


