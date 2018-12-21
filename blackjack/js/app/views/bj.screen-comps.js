/******************************************************************************

	bj.screen-comps.js
	Andy Knoll
	December 2018

    Manages and displays multiple "screens" during the Blackjack Game play.
    The TableScreen is always visible even if beneath other screens.
    These "screens" hold the UI components i.e. TableComp
    Use one of the showNamedScreen() methods.

    Currently each screen holds a single component - this might change!

	ScreensComp
        BaseScreenComp
        
        SplashScreenComp
        TableScreenComp
        AnteScreenComp
        PlayScreenComp
        DebugScreenComp

    THIS IS NOT REALLY A COMPONENT - REMOVE!!! IT IS A COLLECTION

******************************************************************************/

// bj.ScreensComp class - holds all others
bj.ScreensComp = function(name, parent, elemId) {
    wood.Panel.call(this, name, parent, elemId);
    this._className = "bj.ScreensComp";

    this._screens = new wood.Collection("_screens", this);
    this._addScreens();     // TO DO: remove this!
};
bj.ScreensComp.prototype = Object.create(wood.Panel.prototype);
bj.ScreensComp.prototype.constructor = bj.ScreensComp;

bj.ScreensComp.prototype.screen = function(idx) { return this._screens.object(idx); };

bj.ScreensComp.prototype._template = function() {
    var t = "";
    //t += "ScreensComp";
    t += "<div id='splash-screen' class='splash-screen'></div>";
    t += "<div id='table-screen'  class='base-screen'></div>";
    t += "<div id='ante-screen'   class='base-screen'></div>";
    t += "<div id='play-screen'   class='base-screen'></div>";
    t += "<div id='debug-screen'  class='base-screen'></div>";
    return t;
};

bj.ScreensComp.prototype._createChildComps = function() {
    this.splashScreenComp = new bj.SplashScreenComp("splashScreenComp", this, "splash-screen");
    this.tableScreenComp  = new bj.TableScreenComp("tableScreenComp", this, "table-screen");
    this.anteScreenComp   = new bj.AnteScreenComp("anteScreenComp",   this, "ante-screen");
    this.playScreenComp   = new bj.PlayScreenComp("playScreenComp",   this, "play-screen");
    this.debugScreenComp  = new bj.DebugScreenComp("debugScreenComp", this, "debug-screen");

};

// add to internal _screens collection - must call after constructor
// did not really have to use a Collection here but too late!
bj.ScreensComp.prototype._addScreens = function() {
    // do not add splashScreen here
    this._screens.addObject(this.tableScreenComp);
    this._screens.addObject(this.anteScreenComp);
    this._screens.addObject(this.playScreenComp);
    this._screens.addObject(this.debugScreenComp);
};

// show() methods
bj.ScreensComp.prototype.showSplashScreen = function() { 
    //alert("showSplashScreen")
    this.splashScreenComp.show(); 
};

bj.ScreensComp.prototype.showTableScreen = function() { 
    this.screen(0).show(); 
    this.hideAnteScreen(); 
    this.hidePlayScreen(); 
};

bj.ScreensComp.prototype.showAnteScreen = function() { 
    this.screen(1).show(); 
    this.hidePlayScreen(); 
};

bj.ScreensComp.prototype.showPlayScreen = function() { 
    this.screen(2).show(); 
    this.hideAnteScreen(); 
};

bj.ScreensComp.prototype.showDebugScreen = function() { 
    this.screen(3).show(); 
};

// hide() methods
bj.ScreensComp.prototype.hideSplashScreen = function() { 
    this.splashScreenComp.hide(); 
};

bj.ScreensComp.prototype.hideTableScreen = function() { 
    this.screen(0).hide(); 
};

bj.ScreensComp.prototype.hideAnteScreen = function() { 
    this.screen(1).hide(); 
};

bj.ScreensComp.prototype.hidePlayScreen = function() { 
    this.screen(2).hide(); 
};

// leave what is showing beneath
bj.ScreensComp.prototype.hideDebugScreen = function() { 
    this.screen(3).hide(); 
};





// bj.BaseScreenComp class
bj.BaseScreenComp = function(name, parent, elemId) {
    wood.VfxComponent.call(this, name, parent, elemId);
    this._className = "bj.BaseScreenComp";
};
bj.BaseScreenComp.prototype = Object.create(wood.VfxComponent.prototype);
bj.BaseScreenComp.prototype.constructor = bj.BaseScreenComp;

bj.BaseScreenComp.prototype.hide = function() { 
    //this.setCss("visibility", "hidden");
    var props = { "scaleX": 0, "scaleY": 0 };
    this.animate(props, 250, 0);
};

// CSS opacity is initially 0
bj.BaseScreenComp.prototype.show = function() { 
    //this.setCss("visibility", "visible"); 
    var props = { "scaleX": 1, "scaleY": 1, "opacity": 1 };
    this.animate(props, 250, 0);
};



// bj.SplashScreenComp class
bj.SplashScreenComp = function(name, parent, elemId) {
    bj.BaseScreenComp.call(this, name, parent, elemId);
    this._className = "bj.SplashScreenComp";
};
bj.SplashScreenComp.prototype = Object.create(bj.BaseScreenComp.prototype);
bj.SplashScreenComp.prototype.constructor = bj.SplashScreenComp;

bj.SplashScreenComp.prototype._template = function() {
    var t = "<div id='splash-comp' class='splash-comp'></div>";
    return t;
};

bj.SplashScreenComp.prototype._createChildComps = function() {
    this.splashComp = new bj.SplashComp("splashComp", this, "splash-comp");
};

// overridden
bj.SplashScreenComp.prototype.hide = function() { 
    var props = { "scaleX": 0, "scaleY": 0 };
    this.animate(props, 500, 0);
};



// bj.TableScreenComp class
bj.TableScreenComp = function(name, parent, elemId) {
    bj.BaseScreenComp.call(this, name, parent, elemId);
    this._className = "bj.TableScreenComp";
};
bj.TableScreenComp.prototype = Object.create(bj.BaseScreenComp.prototype);
bj.TableScreenComp.prototype.constructor = bj.TableScreenComp;

bj.TableScreenComp.prototype._template = function() {
    var t = "<div id='table-comp' class='table-comp'></div>";
    return t;
};

bj.TableScreenComp.prototype._createChildComps = function() {
    this.tableComp = new bj.TableComp("tableComp", this, "table-comp");
};



// bj.AnteScreenComp class
bj.AnteScreenComp = function(name, parent, elemId) {
    bj.BaseScreenComp.call(this, name, parent, elemId);
    this._className = "bj.AnteScreenComp";
};
bj.AnteScreenComp.prototype = Object.create(bj.BaseScreenComp.prototype);
bj.AnteScreenComp.prototype.constructor = bj.AnteScreenComp;

bj.AnteScreenComp.prototype._template = function() {
    var t = "";
    t += "<div id='ante-comp' class='ante-comp'></div>";
    return t;
};

bj.AnteScreenComp.prototype._createChildComps = function() {
    this.anteComp = new bj.AnteComp("anteComp", this, "ante-comp");
};



// bj.PlayScreenComp class
bj.PlayScreenComp = function(name, parent, elemId) {
    bj.BaseScreenComp.call(this, name, parent, elemId);
    this._className = "bj.PlayScreenComp";
};
bj.PlayScreenComp.prototype = Object.create(bj.BaseScreenComp.prototype);
bj.PlayScreenComp.prototype.constructor = bj.PlayScreenComp;

bj.PlayScreenComp.prototype._template = function() {
    var t = "";
    t += "<div id='play-comp' class='play-comp'></div>";
    return t;
};

bj.PlayScreenComp.prototype._createChildComps = function() {
    this.playComp = new bj.PlayComp("playComp", this, "play-comp");
};




// bj.DebugScreenComp class
bj.DebugScreenComp = function(name, parent, elemId) {
    bj.BaseScreenComp.call(this, name, parent, elemId);
    this._className = "bj.DebugScreenComp";
};
bj.DebugScreenComp.prototype = Object.create(bj.BaseScreenComp.prototype);
bj.DebugScreenComp.prototype.constructor = bj.DebugScreenComp;

bj.DebugScreenComp.prototype._template = function() {
    var t = "";
    t += "<div id='debug-comp' class='debug-comp'></div>";
    return t;
};

bj.DebugScreenComp.prototype._createChildComps = function() {
    this.debugComp = new bj.DebugComp("debugComp", this, "debug-comp");
};

