/******************************************************************************

	bj.table-ctrl.js
	Andy Knoll
	December 2018
    
******************************************************************************/

// bj.TableCtrl class
bj.TableCtrl = function(name, parent) {
    wood.Controller.call(this, name, parent);
    this._className = "bj.TableCtrl";
};
bj.TableCtrl.prototype = Object.create(wood.Controller.prototype);
bj.TableCtrl.prototype.constructor = bj.TableCtrl;

