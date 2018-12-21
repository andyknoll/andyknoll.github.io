/******************************************************************************

	bj.game-finish-ctrl.js
	Andy Knoll
	December 2018
    
******************************************************************************/

// bj.GameFinishCtrl class
bj.GameFinishCtrl = function(name, parent) {
    wood.Controller.call(this, name, parent);
    this._className = "bj.GameFinishCtrl";
};
bj.GameFinishCtrl.prototype = Object.create(wood.Controller.prototype);
bj.GameFinishCtrl.prototype.constructor = bj.GameFinishCtrl;

