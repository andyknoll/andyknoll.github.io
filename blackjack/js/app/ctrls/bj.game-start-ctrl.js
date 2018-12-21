/******************************************************************************

	bj.game-start-ctrl.js
	Andy Knoll
	December 2018
    
******************************************************************************/

// bj.GameStartCtrl class
bj.GameStartCtrl = function(name, parent) {
    wood.Controller.call(this, name, parent);
    this._className = "bj.GameStartCtrl";
};
bj.GameStartCtrl.prototype = Object.create(wood.Controller.prototype);
bj.GameStartCtrl.prototype.constructor = bj.GameStartCtrl;

