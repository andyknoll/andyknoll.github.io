/******************************************************************************

	bj.controllers.js
	Andy Knoll
	December 2018
    
    The Controllers collection for this app. Custom controllers go here.

******************************************************************************/


// bj.CtrlMain class
bj.CtrlMain = function(name, parent) {
    wood.Controller.call(this, name, parent);
    this._className = "bj.CtrlMain";
};
bj.CtrlMain.prototype = Object.create(wood.Controller.prototype);
bj.CtrlMain.prototype.constructor = bj.CtrlMain;

// convenience getter
bj.CtrlMain.prototype.viewMain = function() { 
    return this.views().viewMain; 
};

