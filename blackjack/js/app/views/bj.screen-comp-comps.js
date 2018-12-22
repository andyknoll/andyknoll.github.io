/******************************************************************************

	bj.screen-comp-comps.js
	Andy Knoll
	December 2018

    Holds the UI components for the Blackjack Game.
    The main components currently live on their own "screen" components.

    SplashComp
    AnteComp
    PlayComp
    DebugComp

    TableComp           // now in its own file

******************************************************************************/

// bj.SplashComp class
bj.SplashComp = function(name, parent, elemId) {
    wood.Panel.call(this, name, parent, elemId);
    this._className = "bj.SplashComp";
    this.title = "";        // use setProp()
    this.descr = "";
};
bj.SplashComp.prototype = Object.create(wood.Panel.prototype);
bj.SplashComp.prototype.constructor = bj.SplashComp;

bj.SplashComp.prototype._template = function() {
    var t = "";
    t += "<div id='title' class='splash-title'>Blackjack 2018</div>";
    t += "<div id='descr' class='splash-descr'></div>";
    t += "<button id='splash-button' class='splash-button'></button>";
    return t;
};

bj.SplashComp.prototype._createChildComps = function() {
    this.splashButton = new wood.Button("buttonPlay", this, "splash-button");
};

bj.SplashComp.prototype._initChildComps = function() {
    //this.setProp("title", "this is the title");
    this.splashButton.setLabel("Let's Play!");
};


// bj.TableComp class now in its own file table-comp.js


// bj.AnteComp class
bj.AnteComp = function(name, parent, elemId) {
    wood.Panel.call(this, name, parent, elemId);
    this._className = "bj.AnteComp";
};
bj.AnteComp.prototype = Object.create(wood.Panel.prototype);
bj.AnteComp.prototype.constructor = bj.AnteComp;

bj.AnteComp.prototype._template = function() {
    var t = "";
	//t += "AnteComp";
    t += "<button id='button-incr' class='button-a'></button>";
    t += "<button id='button-decr' class='button-a'></button>";
    t += "<button id='button-ok'   class='button-a'></button>";
    return t;
};

bj.AnteComp.prototype._createChildComps = function() {
    this.buttonIncr = new wood.Button("buttonIncr", this, "button-incr");
    this.buttonDecr = new wood.Button("buttonDecr", this, "button-decr");
    this.buttonOK   = new wood.Button("buttonOK",   this, "button-ok");
    // create all other supporting comps
};

bj.AnteComp.prototype._initChildComps = function() {
    this.buttonIncr.setLabel("INCREASE ANTE");
    this.buttonDecr.setLabel("DECREASE ANTE");
    this.buttonOK.setLabel("OK");
};





// bj.PlayComp class
bj.PlayComp = function(name, parent, elemId) {
    wood.Panel.call(this, name, parent, elemId);
    this._className = "bj.PlayComp";
};
bj.PlayComp.prototype = Object.create(wood.Panel.prototype);
bj.PlayComp.prototype.constructor = bj.PlayComp;

bj.PlayComp.prototype._template = function() {
    var t = "";
	t += "PlayComp";
    t += "<div id='player-play' class='player-comp-big'></div>";
    t += "<button id='button-hit'  class='button-a'></button>";
    t += "<button id='button-stay' class='button-a'></button>";
    return t;
};

bj.PlayComp.prototype._createChildComps = function() {
    this.buttonHit  = new wood.Button("buttonHit",  this, "button-hit");
    this.buttonStay = new wood.Button("buttonStay", this, "button-stay");
    // create all other supporting comps
};

bj.PlayComp.prototype._initChildComps = function() {
    this.buttonHit.setLabel("HIT");
    this.buttonStay.setLabel("STAY");
};




// bj.DebugComp class
bj.DebugComp = function(name, parent, elemId) {
    wood.Panel.call(this, name, parent, elemId);
    this._className = "bj.DebugComp";
};
bj.DebugComp.prototype = Object.create(wood.Panel.prototype);
bj.DebugComp.prototype.constructor = bj.DebugComp;

bj.DebugComp.prototype._template = function() {
    var t = "";
    t += "<div id='display' class='display'></div>";
    t += "<div id='debug-buttons'>";
    t += "  <button id='button-0' class='button-b'></button>";
    t += "  <button id='button-1' class='button-b'></button>";
    t += "  <button id='button-2' class='button-b'></button>";
    t += "  <button id='button-3' class='button-b'></button>";
    t += "  <button id='button-4' class='button-b'></button>";
    t += "  <button id='button-5' class='button-b'></button>";
    t += "  <button id='button-6' class='button-b'></button>";
    t += "  <button id='button-7' class='button-b'></button>";
    t += "  <button id='button-8' class='button-b'></button>";
    t += "</div>";
    return t;
};

bj.DebugComp.prototype._createChildComps = function() {
    this.display = new wood.Display("display", this, "display");

    this.button0 = new wood.Button("button0", this, "button-0");
    this.button1 = new wood.Button("button1", this, "button-1");
    this.button2 = new wood.Button("button2", this, "button-2");
    this.button3 = new wood.Button("button3", this, "button-3");
    this.button4 = new wood.Button("button4", this, "button-4");
    this.button5 = new wood.Button("button5", this, "button-5");
    this.button6 = new wood.Button("button6", this, "button-6");
    this.button7 = new wood.Button("button7", this, "button-7");
    this.button8 = new wood.Button("button8", this, "button-8");
};

bj.DebugComp.prototype._initChildComps = function() {
    this.display.write("Welcome to the Debug Screen");

    this.button0.setLabel("clear");
    this.button1.setLabel("app info");
    this.button2.setLabel("appGame info");
    this.button3.setLabel("appCtrl info");
    this.button4.setLabel("");
    this.button5.setLabel("");
    this.button6.setLabel("");
    this.button7.setLabel("");
    this.button8.setLabel("close screen");
};

// just for testing
bj.DebugComp.prototype.info = function() {
	var s = "";
    s += wood.Panel.prototype.info.call(this);  // call base
    s += ".button0: " + this.button0.label;
	return s;
};

bj.DebugComp.prototype.clearDisplay = function() {
    this.display.clear();
};

bj.DebugComp.prototype.debug = function(s) {
    this.display.write(s);
};


