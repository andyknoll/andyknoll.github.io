/* 
    qp.app.js 

    Andy Knoll
    November 2018

*/


var qp = {};        // namespace for this app


// global debug function - can be turned off
qp.IS_DEBUGGING = true;
qp.debug = function(txt) {
    if (!qp.IS_DEBUGGING) return;
    console.log(txt);
};


qp.App = function() {
    qp.debug("creating main App object");

    // create the Game's MVC objects passing id and this app as parent
    this.models = new qp.Models("models", this);
    this.views  = new qp.Views("views", this);
    this.ctrls  = new qp.Controllers("ctrls", this);

    qp.debug("created main App object OK");

    // only include this if using Tester object!
    // this.tester = new qp.Tester("tester", this);

    // called manually after creating App object
    this.run = function() {
        this.ctrls.gameCtrl.loadLevel(0);
    };
    
};

