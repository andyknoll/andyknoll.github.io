/******************************************************************************

	bj.scoreboard-comps.js
	Andy Knoll
	December 2018

	Holds the UI scoreboard for the Blackjack Game.

******************************************************************************/

// bj.ScoreBoardComp class
bj.ScoreBoardComp = function(name, parent, elemId) {
    wood.Panel.call(this, name, parent, elemId);
    this._className = "bj.ScoreBoardComp";
    this.message = "";      // use setProp() or message()
    this.status = "";       // use setProp()
    this.cash   = "";       // use setProp()
    this.ante   = "";       // use setProp()
};
bj.ScoreBoardComp.prototype = Object.create(wood.Panel.prototype);
bj.ScoreBoardComp.prototype.constructor = bj.ScoreBoardComp;

bj.ScoreBoardComp.prototype._template = function() {
    var t = "";
    t += "<div id='logo'    class='scoreboard-logo'></div>";
    t += "<div id='message' class='scoreboard-message'></div>";
    t += "<div id='status'  class='sboard-field sboard-status'></div>";
    t += "<div id='cash'    class='sboard-field sboard-cash'></div>";
    t += "<div id='ante'    class='sboard-field sboard-ante'></div>";
    return t;
};

bj.ScoreBoardComp.prototype._createChildComps = function() {
    this.logo = new wood.Component("logo",  this, "logo");  // simple "stock" component
};

// PUBLIC API

// many objects use showMessage() to write to the ScoreBoard
// the UI comps get updated from the Game and display messages
bj.ScoreBoardComp.prototype.showMessage = function(s) {
    this.setProp("message", s);     // set the property - that's it
};
