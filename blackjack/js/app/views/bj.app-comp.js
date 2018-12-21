/******************************************************************************

	bj.app-comp.js
	Andy Knoll
	December 2018
    
    The main root UI component for the Blackjack Game.
    
    Currently contains only two child components:

        scoreBoard
        screensComp

	Requires:

		bj.scoreboard-comps.js
		bj.screen-comps.js
		
******************************************************************************/

// bj.AppComp class - contains all other components
bj.AppComp = function(name, parent, elemId) {
    wood.Panel.call(this, name, parent, elemId);
    this._className = "bj.AppComp";
};
bj.AppComp.prototype = Object.create(wood.Panel.prototype);
bj.AppComp.prototype.constructor = bj.AppComp;


bj.AppComp.prototype._template = function() {
    var t = "";
    //t += "<div id='splash-comp'></div>";      // Splash screen should be here
    t += "<div id='scoreboard-comp'></div>";
    t += "<div id='screens-comp'></div>";
    return t;
};

bj.AppComp.prototype._createChildComps = function() {
    this.scoreBoardComp = new bj.ScoreBoardComp("scoreBoardComp", this, "scoreboard-comp");
    this.screensComp = new bj.ScreensComp("screensComp", this, "screens-comp");
};

// convenience getters
bj.AppComp.prototype.tableComp = function() { return this.screensComp.tableComp; };
bj.AppComp.prototype.deckComp = function() { return this.tableComp().deckComp; };


// delegate to the tableComp
bj.TableComp.prototype.initGame = function(game) {
    this.tableComp().initGame(game);
};

