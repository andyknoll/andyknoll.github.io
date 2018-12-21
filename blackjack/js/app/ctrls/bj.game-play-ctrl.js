/******************************************************************************

	bj.game-play-ctrl.js
	Andy Knoll
	December 2018
    
******************************************************************************/

// bj.GamePlayCtrl class
bj.GamePlayCtrl = function(name, parent) {
    wood.Controller.call(this, name, parent);
    this._className = "bj.GamePlayCtrl";
};
bj.GamePlayCtrl.prototype = Object.create(wood.Controller.prototype);
bj.GamePlayCtrl.prototype.constructor = bj.GamePlayCtrl;

