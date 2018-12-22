/******************************************************************************

	wood.tasks.js
	Andy Knoll
	December 2018
    
    Reexamining the Task objects using timers and callback methods.

    A taskObject is a Pauser object with a Task method in addition to its
    supplied caller and callback method.

    The Task method runs immediately before the pause (setTimeout).

    Runs one time and then calls the callback method.

        TaskObject

******************************************************************************/

// wood.TaskObject class
wood.TaskObject = function(name, parent) {
    wood.Pauser.call(this, name, parent);
    this._className = "wood.TaskObject";
    this._taskCaller = null;
    this._taskMethod = null;
};
wood.TaskObject.prototype = Object.create(wood.Pauser.prototype);
wood.TaskObject.prototype.constructor = wood.TaskObject;

wood.TaskObject.prototype.hasTaskCaller = function() { return this._taskCaller !== null; };
wood.TaskObject.prototype.hasTaskMethod = function() { return this._taskMethod !== null; };

wood.TaskObject.prototype.setTaskCaller = function(caller) {
    this._taskCaller = caller;
};

wood.TaskObject.prototype.setTaskMethod = function(method) {
    this._taskMethod = method;
};

wood.TaskObject.prototype.setTaskCallerAndMethod = function(caller, method) {
    this.setTaskCaller(caller);
    this.setTaskMethod(method);
};

wood.TaskObject.prototype.start = function() {
    if (this._isStarted) return;	    // already started
    this.runTaskMethod();
    wood.Pauser.prototype.start.call(this);      // call base
};

// uses the same caller context
wood.TaskObject.prototype.runTaskMethod = function() {
    if (!this._taskCaller) return false;
    if (!this._taskMethod) return false;
    this._taskMethod.call(this._caller, this);
    return true;
};

