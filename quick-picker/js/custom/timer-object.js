/* 
    timer-object.js

    Andy Knoll
    November 2018

    A generic Timer which will call a provided callback function.
    Provides start() stop() and duration property.
    Can be used with a callback or triggered "timer" event

*/

// TimerObject
TimerObject = function(name, parent) {
    //alert("TimerObject constructor");
    this.name = name;
    this.parent = parent;
    this.duration = 1000;       // default for setInterval()
    this._timer = 0;             // only used internally
    this.cycle = 0;

    // redefine calling context where used
    this.caller = this;
    this.callback = function(timer) {};

    this._$emitter = $("<div></div>");       // for events

    this._onTimer = function(timer) {
        //alert("TimerObject._onTimer cycle: " + timer.cycle);
        timer._$emitter.trigger("timer");
        timer.callback.call(timer.caller, timer);
        timer.cycle++;
    };

    this.start = function() {
        var self = this;
        this.cycle = 0;
        this._timer = setInterval(function() {
            self._onTimer(self)
        }, self.duration);
    };
    
    // runs callback immediately
    this.startNow = function() {
        var self = this;
        this.cycle = 0;
        this._onTimer(this);
        this._timer = setInterval(function() {
            self._onTimer(self)
        }, self.duration);
    };
    
    this.stop = function() {
        clearInterval(this._timer);
    };

    this.setCaller = function(caller) {
        this.caller = caller;
    };

    this.setCallback = function(callback) {
        this.callback = callback;
    };

};




// PauserObject
PauserObject = function(name, parent) {
    //alert("PauserObject constructor");
    this.name = name;
    this.parent = parent;
    this.duration = 1000;

    // redefine calling context where used
    this.caller = this;
    this.callback = function(pauser) {};

    this._afterPause = function(pauser) {
        //alert("_afterPause");
        pauser.callback.call(pauser.caller, pauser);
    };

    this.pause = function(dur) {
        var self = this;
        this.duration = dur;
        setTimeout(function() {
            self._afterPause(self)
        }, self.duration);
    };
    
    this.setCaller = function(caller) {
        this.caller = caller;
    };

    this.setCallback = function(callback) {
        this.callback = callback;
    };

};



