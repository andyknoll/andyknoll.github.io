/******************************************************************************

	bj.game-comps-ctrl.js
	Andy Knoll
	December 2018

******************************************************************************/

// bj.GameCompsCtrl class
bj.GameCompsCtrl = function(name, parent) {
    wood.Controller.call(this, name, parent);
	this._className = "bj.GameCompsCtrl";
	
	this.tableComp = null;
	this.anteComp = null;
	this.playComp = null;
	this.debugComp = null;
};
bj.GameCompsCtrl.prototype = Object.create(wood.Controller.prototype);
bj.GameCompsCtrl.prototype.constructor = bj.GameCompsCtrl;

/*
bj.GameCompsCtrl.prototype.tableComp = function() {
	return this.parent()
*/