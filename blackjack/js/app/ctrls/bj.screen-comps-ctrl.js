/******************************************************************************

	bj.screen-comps-ctrl.js
	Andy Knoll
	December 2018
	
	This Controller handles the click events from the screen components.
	This is the partner file for screen-comps.js

	Note that these are NOT actually interactiong with the "screens" but
	rather the component that resides on each. 
	
	This design may get improved (time permitting) to remove "screens".
	
    TableScreen		TableComp
    AnteScreen		AnteComp
    PlayScreen		PlayComp
    DebugScreen		DebugComp
		
******************************************************************************/

// bj.ScreenCompsCtrl class
bj.ScreenCompsCtrl = function(name, parent) {
    wood.Controller.call(this, name, parent);
    this._className = "bj.ScreenCompsCtrl";
};
bj.ScreenCompsCtrl.prototype = Object.create(wood.Controller.prototype);
bj.ScreenCompsCtrl.prototype.constructor = bj.ScreenCompsCtrl;


// getters
bj.ScreenCompsCtrl.prototype.appComp  = function() { return this.views().appComp; };
bj.ScreenCompsCtrl.prototype.appGame  = function() { return this.models().appGame; };
bj.ScreenCompsCtrl.prototype.appCtrl  = function() { return this.parent().appCtrl; };
bj.ScreenCompsCtrl.prototype.gameCtrl = function() { return this.parent().gameCtrl; };

// screensComp - access all others from this
bj.ScreenCompsCtrl.prototype.screensComp = function() { return this.appComp().screensComp; };

// splashComp
bj.ScreenCompsCtrl.prototype.splashScreenComp = function() { return this.screensComp().splashScreenComp; };
bj.ScreenCompsCtrl.prototype.splashComp = function() { return this.splashScreenComp().splashComp; };

// tableComp
bj.ScreenCompsCtrl.prototype.tableScreenComp = function() { return this.screensComp().tableScreenComp; };
bj.ScreenCompsCtrl.prototype.tableComp = function() { return this.tableScreenComp().tableComp; };

// anteComp
bj.ScreenCompsCtrl.prototype.anteScreenComp = function() { return this.screensComp().anteScreenComp; };
bj.ScreenCompsCtrl.prototype.anteComp = function() { return this.anteScreenComp().anteComp; };

// playComp
bj.ScreenCompsCtrl.prototype.playScreenComp = function() { return this.screensComp().playScreenComp; };
bj.ScreenCompsCtrl.prototype.playComp = function() { return this.playScreenComp().playComp; };

// debugComp
bj.ScreenCompsCtrl.prototype.debugScreenComp = function() { return this.screensComp().debugScreenComp; };
bj.ScreenCompsCtrl.prototype.debugComp = function() { return this.debugScreenComp().debugComp; };




bj.ScreenCompsCtrl.prototype.init = function() {
	//alert("ScreenCompsCtrl.init");
	var splashComp = this.splashComp();
	var tableComp  = this.tableComp();
	var anteComp   = this.anteComp();
	var playComp   = this.playComp();
	var debugComp  = this.debugComp();

	// Splash button
	splashComp.splashButton.addClickHandler(this, this.buttonClickHandler);

	// Play buttons
	tableComp.buttonInstr.addClickHandler(this, this.buttonClickHandler);
	tableComp.buttonSettings.addClickHandler(this, this.buttonClickHandler);
	tableComp.buttonPlay.addClickHandler(this, this.buttonClickHandler);

	// Ante buttons
	anteComp.buttonIncr.addClickHandler(this, this.buttonClickHandler);
	anteComp.buttonDecr.addClickHandler(this, this.buttonClickHandler);
	anteComp.buttonOK.addClickHandler(this, this.buttonClickHandler);

	// Hit and Stay buttons
	playComp.buttonHit.addClickHandler(this, this.buttonClickHandler);
	playComp.buttonStay.addClickHandler(this, this.buttonClickHandler);

	// Debug screen buttons
	debugComp.button0.addClickHandler(this, this.buttonClickHandler);
	debugComp.button1.addClickHandler(this, this.buttonClickHandler);
	debugComp.button2.addClickHandler(this, this.buttonClickHandler);
	debugComp.button3.addClickHandler(this, this.buttonClickHandler);
	debugComp.button4.addClickHandler(this, this.buttonClickHandler);
	debugComp.button5.addClickHandler(this, this.buttonClickHandler);
	debugComp.button6.addClickHandler(this, this.buttonClickHandler);
	debugComp.button7.addClickHandler(this, this.buttonClickHandler);
	debugComp.button8.addClickHandler(this, this.buttonClickHandler);
};

// combining all screens into a single button click handlers
bj.ScreenCompsCtrl.prototype.buttonClickHandler = function(e) {
	//alert("ScreenCompsCtrl.buttonClickHandler");
	var btn = e.data.sender;
	var ctrl = e.data.receiver;
	var splashComp = ctrl.splashComp();
	var tableComp  = ctrl.tableComp();
	var anteComp   = ctrl.anteComp();
	var playComp   = ctrl.playComp();
	var debugComp  = ctrl.debugComp();

	switch (btn) {
		case splashComp.splashButton : ctrl.splashButtonClickHandler(); break;

		case tableComp.buttonInstr    : ctrl.tableButtonInstrClickHandler(); break;
		case tableComp.buttonSettings : ctrl.tableButtonSettingsClickHandler(); break;
		case tableComp.buttonPlay     : ctrl.tableButtonPlayClickHandler(); break;

		case anteComp.buttonIncr : ctrl.anteButtonIncrClickHandler(); break;
		case anteComp.buttonDecr : ctrl.anteButtonDecrClickHandler(); break;
		case anteComp.buttonOK   : ctrl.anteButtonOKClickHandler(); break;

		case playComp.buttonHit  : ctrl.playButtonHitClickHandler(); break;
		case playComp.buttonStay : ctrl.playButtonStayClickHandler(); break;

		case debugComp.button0 : ctrl.debugButton0ClickHandler(); break;
		case debugComp.button1 : ctrl.debugButton1ClickHandler(); break;
		case debugComp.button2 : ctrl.debugButton2ClickHandler(); break;
		case debugComp.button3 : ctrl.debugButton3ClickHandler(); break;
		case debugComp.button4 : ctrl.debugButton4ClickHandler(); break;
		case debugComp.button5 : ctrl.debugButton5ClickHandler(); break;
		case debugComp.button6 : ctrl.debugButton6ClickHandler(); break;
		case debugComp.button7 : ctrl.debugButton7ClickHandler(); break;
		case debugComp.button8 : ctrl.debugButton8ClickHandler(); break;
	}
};



// splashScreenComp
bj.ScreenCompsCtrl.prototype.splashButtonClickHandler = function() {
	this.screensComp().hideSplashScreen();
	this.screensComp().showTableScreen();
};

// tableScreenComp
bj.ScreenCompsCtrl.prototype.tableButtonInstrClickHandler = function() {
	alert("tableButtonInstrClickHandler");
};

bj.ScreenCompsCtrl.prototype.tableButtonSettingsClickHandler = function() {
	alert("tableButtonSettingsClickHandler");
};

bj.ScreenCompsCtrl.prototype.tableButtonPlayClickHandler = function() {
	//alert("tableButtonPlayClickHandler - START ROUND");
	this.gameCtrl().startGame();
};


// anteScreenComp
bj.ScreenCompsCtrl.prototype.anteButtonIncrClickHandler = function() {
	alert("anteButtonIncrClickHandler");
};

bj.ScreenCompsCtrl.prototype.anteButtonDecrClickHandler = function() {
	alert("anteButtonDecrClickHandler");
};

bj.ScreenCompsCtrl.prototype.anteButtonOKClickHandler = function() {
	alert("anteButtonOKClickHandler");
};


// playScreenComp
bj.ScreenCompsCtrl.prototype.playButtonHitClickHandler = function() {
	alert("playButtonHitClickHandler");
};

bj.ScreenCompsCtrl.prototype.playButtonStayClickHandler = function() {
	alert("playButtonStayClickHandler");
};


// debugScreenComp
// clear display
bj.ScreenCompsCtrl.prototype.debugButton0ClickHandler = function() {
	this.debugComp().clearDisplay();
};

bj.ScreenCompsCtrl.prototype.debugButton1ClickHandler = function() {
	this.debugComp().debug(this.app().info());
};

bj.ScreenCompsCtrl.prototype.debugButton2ClickHandler = function() {
	this.debugComp().debug(this.appGame().info());
};

bj.ScreenCompsCtrl.prototype.debugButton3ClickHandler = function() {
	this.debugComp().debug(this.appCtrl().info());
};

bj.ScreenCompsCtrl.prototype.debugButton4ClickHandler = function() {
};

bj.ScreenCompsCtrl.prototype.debugButton5ClickHandler = function() {
};

bj.ScreenCompsCtrl.prototype.debugButton6ClickHandler = function() {
};

bj.ScreenCompsCtrl.prototype.debugButton7ClickHandler = function() {
};

// close
bj.ScreenCompsCtrl.prototype.debugButton8ClickHandler = function() {
	this.screensComp().hideDebugScreen();
};


