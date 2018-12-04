/*****************************************************************************

    app.js

    Andy Knoll
    November 2018

    Blackjack simulation game - command line version.

    THIS IS THE CONSOLE APP WHICH HOSTS THE GAME OBJECT

    This App object implements a micro-MVC approach where only the
    Controller object can access the Models and Views.

    This maintains separation between the logic and UI (console).

    Modules (objects) :

        App
            AppModels
            AppViews
            AppCtrls

        Game
            Card
            Deck
            MultiDeck
            Dealer
            Player
            Players
            Hand
            Rules
    
    TO DO: add Game state (DEALING, PLAYING, etc.)

*****************************************************************************/


// var AKObjects = require("./js/lib/ak-objects.js");     // why not?

//var AppModels = require("./js/app/app-models.js");
//var AppViews  = require("./js/app/app-views.js");
//var AppCtrls  = require("./js/app/app-ctrls.js");

// var BJTester  = require("./js/tests/bj-tester-2.js");

var br = "\r\n";    // CRLF

// BJConsoleApp "class"
BJConsoleApp = function(name, parent) {
    AKMvcApp.call(this, name, parent);
    this._className = "BJConsoleApp";
    this.msg = "";
    this.DEBUG = false;
};
BJConsoleApp.prototype = Object.create(AKMvcApp.prototype);
BJConsoleApp.prototype.constructor = BJConsoleApp;


BJConsoleApp.prototype.info = function() {
	var s = "";
    s += AKMvcApp.prototype.info.call(this);
    // new properties go here...
    return s;
};



// override these in custom apps like this one
// create the three MVC collections as custom classes
BJConsoleApp.prototype.createModels = function() { 
    return new AppModels("models", this);
};

BJConsoleApp.prototype.createViews = function() { 
    return new AppViews("views", this);
};

BJConsoleApp.prototype.createControllers = function() { 
    return new AppCtrls("ctrls", this);
};



BJConsoleApp.prototype.run = function() {
    /*
    var args = process.argv;        // Node command line
    var numRounds = args[2];
    if (!isNaN(numRounds)) {
        if (numRounds < 0) numrounds = 0;
        this.models.bjGame.maxRounds = numRounds;
    }
    */
    this.ctrls.bjCtrl.run();    // run the Blackjack controller
};

/*
BJConsoleApp.prototype.runTests = function(n) {
    var tester = new BJTester("tester", this);
    tester.runTest(n);
};
*/


// create and run the app object
// now uses command line arguments "node app.js test 4"
var app = new BJConsoleApp("Blackjack Console App", null);      // no parent
app.run();
