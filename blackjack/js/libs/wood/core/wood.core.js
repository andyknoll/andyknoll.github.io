/******************************************************************************

	wood.core.js
	Andy Knoll
	December 2018 (revisited)
    
    wood.Object
    wood.App
    wood.CallbackObject
    wood.Timer
    wood.Collection

    requires jQuery 3.0+

******************************************************************************/

var wood = {};

wood.event = {};
wood.event.TIMER = "timer";
wood.event.CLICK = "click";



// base wood.Object class
wood.Object = function(name, parent) {
    try {
        this._name = name;
        this._parent = parent;
        this._className = "wood.Object";
        // jQuery object needed for event dispatching - not appended to DOM
        this._$dispatcher = $("<div></div>");       // create it
    } catch(err) {
        alert(err);
    }
};

// getters
wood.Object.prototype.name = function() { return this._name; };
wood.Object.prototype.parent = function() { return this._parent; };
wood.Object.prototype.className = function() { return this._className; };

wood.Object.prototype.addHandler = function(evType, rcvr, evHandler) {
	// always ensure there is e.data being sent
	var data = {};			// create new object with two properties
	data.sender = this;		// auto-supply sender - always this object
	data.receiver = rcvr;	// handler function's owner object
    this._$dispatcher.on(evType, data, evHandler);
};

wood.Object.prototype.removeHandler = function(evType, evHandler) {
	this._$dispatcher.off(evType, evHandler);
};

wood.Object.prototype.triggerEvent = function(evType) {
	// jQuery technique - uses _$dispatcher
	this._$dispatcher.trigger(evType); // "e" is silently passed to handler!
};

// for debug only
wood.Object.prototype.info = function() {
    var s = "OBJECT DETAILS <br>";
    s += ".name: " + this.name() + "<br>";

    if (this.parent() != null) {
        s += ".parent: " + this.parent().name() + "<br>";
    } else {
        s += ".parent: null" + "<br>";
    }

    s += ".className: " + this.className() + "<br>";
    //s += "<br>";
    return s;
};

wood.Object.prototype.infoAsText = function() {
	var info  = this.info();
	var myExp = RegExp("<br>", "g");
	var text  = info.replace(myExp, "\n");
	return text;
};



/*****************************************************************************

// wood.NewObject class
wood.NewObject = function(name, parent) {
    wood.Object.call(this, name, parent);
    this._className = "wood.NewObject";
};
wood.NewObject.prototype = Object.create(wood.Object.prototype);
wood.NewObject.prototype.constructor = wood.NewObject;

wood.NewObject.prototype.info = function() {
	var s = "";
    s += wood.Object.prototype.info.call(this);
	return s;
};

*****************************************************************************/



// wood.App class
wood.App = function(name, parent) {
    wood.Object.call(this, name, parent);
    this._className = "wood.App";

    this.author  = "";
    this.date    = "";
    this.version = "";
};
wood.App.prototype = Object.create(wood.Object.prototype);
wood.App.prototype.constructor = wood.App;

wood.App.prototype.info = function() {
	var s = "";
    s += wood.Object.prototype.info.call(this);
    s += ".author: "  + this.author  + "<br>";
    s += ".date: "    + this.date    + "<br>";
    s += ".version: " + this.version + "<br>";
	return s;
};

wood.App.prototype.setAppInfo = function(author, date, version) {
    this.author  = author;
    this.date    = date;
    this.version = version;
};

wood.App.prototype.log = function(s) {
    document.write(s + "<br>");
};

wood.App.prototype.run = function() {
    // startup code here if desired
};





// wood.CallbackObject
// inherits from wood.Object
wood.CallbackObject = function(name, parent) {
    wood.Object.call(this, name, parent);
    this._className = "wood.CallbackObject";
	this._caller = null;
	this._callback = null;
};
wood.CallbackObject.prototype = Object.create(wood.Object.prototype);
wood.CallbackObject.prototype.constructor = wood.CallbackObject;

// getters
wood.CallbackObject.prototype.caller = function() { return this._caller; };
wood.CallbackObject.prototype.callback = function() { return this._callback; };
wood.CallbackObject.prototype.hasCaller = function() { return this._caller !== null; };
wood.CallbackObject.prototype.hasCallback = function() { return this._callback !== null; };

// setters
wood.CallbackObject.prototype.setCaller = function(caller) {
    this._caller = caller;
};

wood.CallbackObject.prototype.setCallback = function(callback) {
    this._callback = callback;
};

wood.CallbackObject.prototype.setCallerAndCallback = function(caller, callback) {
    this.setCaller(caller);
    this.setCallback(callback);
};

wood.CallbackObject.prototype.info = function() {
	var s = "";
    s += wood.Object.prototype.info.call(this);
    s += "caller: "      + this.caller()      + "<br>";
    s += "hasCaller: "   + this.hasCaller()   + "<br>";
    s += "hasCallback: " + this.hasCallback() + "<br>";
    //s += "callback: "  + this.callback()    + "<br>";
	return s;
};

// execute the callback method one time
wood.CallbackObject.prototype.runCallback = function() {
    if (!this._caller) return false;
    if (!this._callback) return false;
    this._callback.call(this._caller, this);
    return true;
};








// wood.Pauser
// inherits from wood.CallbackObject
// similar to TImer but uses setTimeout() not setInterval()
wood.Pauser = function(name, parent) {
    wood.CallbackObject.call(this, name, parent);
    this._className = "wood.Pauser";

	this._duration  = 1000;	        // mSecs
    this._isStarted = false;
};
wood.Pauser.prototype = Object.create(wood.CallbackObject.prototype);
wood.Pauser.prototype.constructor = wood.Pauser;

// getters
wood.Pauser.prototype.duration  = function() { return this._duration; };
wood.Pauser.prototype.isStarted = function() { return this._isStarted; };

// private internal method - called by setTimeout
wood.Pauser.prototype._onTimer = function() {
    this._isStarted = false;
    this.runCallback();                      // once
    this.triggerEvent(wood.event.TIMER);
};


// public methods
wood.Pauser.prototype.info = function() {
	var s = "";
    s += wood.CallbackObject.prototype.info.call(this);
	s += "duration: "  + this.duration()  + "<br>";
	s += "isStarted: " + this.isStarted() + "<br>";
	return s;
};

// setter
wood.Pauser.prototype.setDuration = function(mSecs) {
	if (mSecs < 0) mSecs = 0;
	this._duration = mSecs;
	
	if (this._isStarted) {
		this.start();                   // restart after setting
	}
};

wood.Pauser.prototype.start = function() {
    var self = this;	                // cache for anonymous function
    
    if (this._isStarted) return;	    // already started
	this._isStarted = true;

	setTimeout(function() {
		self._onTimer();
	}, self._duration);
};


// wood.Timer
// inherits from wood.CallbackObject
// TO DO: this could inherit from wood.Pauser!
wood.Timer = function(name, parent) {
    wood.CallbackObject.call(this, name, parent);
    this._className = "wood.Timer";

	this._timerId   = null;
	this._cycle     = 0;
	this._duration  = 1000;	        // mSecs
    this._isStarted = false;
    
    this.isLooping = true;          // new 12-19-2018
};
wood.Timer.prototype = Object.create(wood.CallbackObject.prototype);
wood.Timer.prototype.constructor = wood.Timer;

// getters
wood.Timer.prototype.cycle     = function() { return this._cycle; };
wood.Timer.prototype.duration  = function() { return this._duration; };
wood.Timer.prototype.isStarted = function() { return this._isStarted; };

// private internal method - called by setInterval
wood.Timer.prototype._onTimer = function() {
    //alert("wood.Timer.prototype._onTimer");
    if (!this.isLooping) this.stop();
    this.runCallback();                      // every additional run until stopped
    this.triggerEvent(wood.event.TIMER);
    this._cycle++;                          // increment AFTER the trigger
    //if (!this._isStarted) clearInterval(this._timerId);     // 12-19-2018
};


// public methods
wood.Timer.prototype.info = function() {
	var s = "";
    s += wood.CallbackObject.prototype.info.call(this);
	s += "duration: "  + this.duration()  + "<br>";
	s += "cycle: "     + this.cycle()     + "<br>";
	s += "isStarted: " + this.isStarted() + "<br>";
	s += "isLooping: " + this.isLooping + "<br>";
	return s;
};

// setter
wood.Timer.prototype.setDuration = function(mSecs) {
	if (mSecs < 0) mSecs = 0;
	this._duration = mSecs;
	
	if (this._isStarted) {
		this.stop();
		this.start();                   // restart after setting
	}
};

wood.Timer.prototype.start = function() {
    var self = this;	                // cache for anonymous function
    
    if (this._isStarted) return;	    // already started
	this._isStarted = true;
	this._cycle = 0;    

	this._timerId = setInterval(function() {
		self._onTimer();
	}, self._duration);
};

wood.Timer.prototype.stop = function() {
	if (!this._isStarted) return;	    // already stopped
	this._isStarted = false;
	// leave _currCycle where it is until next start/resume
	clearInterval(this._timerId);    // NO! let callback complete
    //this.runCallback();                      // every additional run until stopped
    //this.triggerEvent(wood.event.TIMER);
};





// wood.Collection
// a Collection of Objects
wood.Collection = function(name, parent) {
    this._objects = [];
    this._currIndex = -1;
    wood.Object.call(this, name, parent);
    this._className = "wood.Collection";
};
wood.Collection.prototype = Object.create(wood.Object.prototype);
wood.Collection.prototype.constructor = wood.Collection;

// getters
wood.Collection.prototype.object = function(idx) { return this._objects[idx]; };        // no range checks
wood.Collection.prototype.currIndex = function() { return this._currIndex; };
wood.Collection.prototype.count = function() { return this._objects.length; };
wood.Collection.prototype.isEmpty = function() { return this.count() == 0; };

wood.Collection.prototype.isFirstObject = function() { return this._currIndex == 0; };
wood.Collection.prototype.isLastObject  = function() { return this._currIndex == this.lastIndex(); };

// public methods
wood.Collection.prototype.info = function() {
    var s = "";
    s += wood.Object.prototype.info.call(this);
    s += "count: " + this.count() + "<br>";
    s += "objects: <br/>";
    s += this.childrenInfo();
    return s;
};

wood.Collection.prototype.infoShort = function() {
    var s = "";
    s += wood.Object.prototype.info.call(this);
    s += "count: " + this.count() + "<br>";
    return s;
};

wood.Collection.prototype.childrenInfo = function() {
    var s = "";
    var obj = null;
    for (var i = 0; i < this.count(); i++) {
        //obj = this.byIndex(i);
        obj = this.object(i);       // alias method
        s += "&nbsp; [" + i + "] " + obj.name() + "<br>";
    }
    return s;
};


wood.Collection.prototype.currObject = function() {
    if (this.isEmpty()) return null;
    return this._objects[this._currIndex];
};


// returns length
wood.Collection.prototype.addObject = function(obj) {
    return this._objects.push(obj);
};

// search
wood.Collection.prototype.lastIndex = function() {
    return this.count() - 1;
};

wood.Collection.prototype.byIndex = function(idx) {
    if (this.isEmpty()) return null;
    if (idx < 0) return null;
    if (idx > this.lastIndex()) return null;
    return this._objects[idx];
};

// search
wood.Collection.prototype.indexOf = function(name) {
    var count = this.count();
    if (this.isEmpty()) return -1;
    for (var i = 0; i < count; i++) {
        if (this._objects[i].name() == name) {
            return i;
        }
    }
    return -1;
};

wood.Collection.prototype.byName = function(name) {
    var idx = this.indexOf(name);
    if (idx == -1)
        return null;
    else    
        return this._objects[idx];
};

wood.Collection.prototype.clear = function() {
    while (!this.isEmpty()) {
        this._objects.pop();
    }
    this._currIndex = -1;
};


// uses array.splice(idx, numElems)
wood.Collection.prototype.removeObjectByIndex = function(idx) {
    var obj = null;
    if (this.isEmpty()) return null;
    if (idx < 0) return null;
    if (idx > this.lastIndex()) return null;
    obj = this._objects[idx];
    this._objects.splice(idx, 1);
    return obj;
};

wood.Collection.prototype.removeObjectByName = function(name) {
    var idx = this.indexOf(name);
    if (idx == -1) return null;
    return this.removeObjectByIndex(idx);
};

// includes range checks
wood.Collection.prototype.setCurrIndex = function(idx) {
    if (idx < 0) idx = 0;
    if (idx >= this.count()) idx = this.count()-1;
    this._currIndex = idx;
};

// new 09-17-2018 - now returns currObject
wood.Collection.prototype.prev = function() {
    if (this.isEmpty()) return null;
    this._currIndex--;
    if (this._currIndex < 0) {
        this._currIndex = this.count()-1;        // wrap
    }
    return this.currObject();
};

// new 09-17-2018 - now returns currObject
wood.Collection.prototype.next = function() {
    if (this.isEmpty()) return null;
    this._currIndex++;
    if (this._currIndex == this.count()) {
        this._currIndex = 0;                    // wrap
    }
    return this.currObject();
};

// new 09-17-2018
wood.Collection.prototype.first = function() {
    if (this.isEmpty()) return null;
    this._currIndex = 0;
    return this.currObject();
};

// new 09-17-2018
wood.Collection.prototype.last = function() {
    if (this.isEmpty()) return null;
    this._currIndex = this.lastIndex();
    return this.currObject();
};

// new 09-17-2018
wood.Collection.prototype.getNextObject = function() {
    return this.next();
};

// new 09-17-2018
wood.Collection.prototype.getPrevObject = function() {
    return this.prev();
};

// alias methods
wood.Collection.prototype.incrCurrIndex = function() { this.next(); };
wood.Collection.prototype.decrCurrIndex = function() { this.prev(); };

// TO DO
// wood.Collection.prototype.createAndAddObject = function(name) {}
// wood.Collection.prototype.createChildAs = function(name) {}


// Durstenfeld algorithm - shuffle any array in place
wood.Collection.prototype.shuffle = function() {
    var i, j, tempObj;
    for (i = this._objects.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        tempObj = this._objects[i];
        this._objects[i] = this._objects[j];
        this._objects[j] = tempObj;
    }
};

wood.Collection.prototype.showRange = function(min, max) {
    var s = "";
    var obj = null;
    if (min < 0) min = 0;       // range checks
    if (max < min) max = min;
    if (max > this.count()-1) max = this.count()-1;
    for (var i = min; i <= max; i++) {
        obj = this.object(i);
        s += this.childInfo(obj, i);
    }
    return s;
};

wood.Collection.prototype.pop = function() {
    var obj = this._objects.pop();
    this.last();            // set currIndex - could be -1
    return obj;
};
