/******************************************************************************

	bj.scoreboard-comps-ctrl.js
	Andy Knoll
	December 2018
    
******************************************************************************/

// bj.ScoreboardCompsCtrl class
bj.ScoreBoardCompsCtrl = function(name, parent) {
    wood.Controller.call(this, name, parent);
    this._className = "bj.ScoreBoardCompsCtrl";
};
bj.ScoreBoardCompsCtrl.prototype = Object.create(wood.Controller.prototype);
bj.ScoreBoardCompsCtrl.prototype.constructor = bj.ScoreBoardCompsCtrl;

// scoreBoardComp - the component being "controlled" here
bj.ScoreBoardCompsCtrl.prototype.scoreBoard = function() { return this.views().appComp.scoreBoardComp; };
bj.ScoreBoardCompsCtrl.prototype.screensComp = function() { return this.views().appComp.screensComp; };


bj.ScoreBoardCompsCtrl.prototype.init = function() {
	this.scoreBoard().setProp("message",  "Welcome to Blackjack 2018")
	this.scoreBoard().setProp("status", "Player: Vito")
	this.scoreBoard().setProp("cash",   "Cash: $200")
	this.scoreBoard().setProp("ante",   "Ante: $40")
	// click on the logo component to show Debug screen
	this.scoreBoard().logo.addClickHandler(this, this.logoClickHandler);
};

// ScoreBoard Logo component
bj.ScoreBoardCompsCtrl.prototype.logoClickHandler = function(e) {
	var ctrl = e.data.receiver;			  // "this"
	ctrl.screensComp().showDebugScreen();
};



