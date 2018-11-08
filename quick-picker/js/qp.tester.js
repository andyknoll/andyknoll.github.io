/* 

    qp.tester.js 

    Andy Knoll
    November 2018

    This file enables testing of the Game app without cluttering the code.
    Create a Tester object and pass in the parent App (not the Game)

*/

qp.Tester = function(name, parent) {
    qp.debug("creating Tester Object");
    this.name = name;
    this.parent = parent;


    // called automatically at creation
    this.initTester = function() {
        qp.debug("Tester.initTester");
        this.gameModel = parent.models.gameModel;
        this.gameView  = parent.views.gameView;
        this.gameCtrl  = parent.ctrls.gameCtrl;
    
        this.pauser = this.gameCtrl.pauser;
        this.pauser.caller = this;
        this.gameView.$header.on("click", this, this.runTests);
    };

    // called by clicking the $header
    this.runTests = function(e) {
        qp.debug("Tester.runTests");
        var self = e.data;
        self.runTest1();
    };


    // TEST 1 - test timed sequence of loading levels
    this.runTest1 = function() {
        qp.debug("Tester.runTest1");
        this.pauser.callback = this.pauserCallback1;
        this.pauser.pause(1000);
    };

    this.pauserCallback1 = function() { 
        this.gameCtrl.loadLevel(1); 
        this.pauser.callback = this.pauserCallback2;
        this.pauser.pause(1000);
    };

    this.pauserCallback2 = function() { 
        this.gameCtrl.loadLevel(2); 
        this.pauser.callback = this.pauserCallback3;
        this.pauser.pause(1000);
    };

    this.pauserCallback3 = function() { 
        this.gameCtrl.loadLevel(3); 
        this.pauser.callback = this.pauserCallback4;
        this.pauser.pause(1000);
    };

    this.pauserCallback4 = function() { 
        this.gameCtrl.loadLevel(0); 
    };


    // TEST 2
    this.runTest2 = function() {
        alert("runTest2");
    };


    // TEST 3
    this.runTest3 = function() {
        alert("runTest3");
    };

    this.initTester();
};

