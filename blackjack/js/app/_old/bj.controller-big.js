/******************************************************************************

	bj.controller-big.js
	Andy Knoll
	December 2018
    
    The Blackjack Game controller.

******************************************************************************/

// bj.CtrlMain class
bj.CtrlMain = function(name, parent) {
    wood.Controller.call(this, name, parent);
    this._className = "bj.CtrlMain";
    this._timer = new wood.Timer("_timer", this);
};
bj.CtrlMain.prototype = Object.create(wood.Controller.prototype);
bj.CtrlMain.prototype.constructor = bj.CtrlMain;

// convenience getters
bj.CtrlMain.prototype.game = function() { return this.models().game; };
bj.CtrlMain.prototype.view = function() { return this.views().viewMain; };


///////////////////////////////////////////////////////////////////////////////

















bj.CtrlMain.prototype.startGame = function() {
    this.clearLog();
    this.log("CtrlMain.startGame");
    this.initGame();
    //this.initRounds();
    //this.playRounds();
};

// called once
bj.CtrlMain.prototype.initGame = function() {
    this.clearLog();
    this.log("CtrlMain.initGame");
    this.game().initGame();
    this.log(this.game().msg);
    this.view().initGame(this.game());
    this.log("");
};

// NEED TO WAIT FOR INTERACTION
// called once
bj.CtrlMain.prototype.initRounds = function() {
    this.clearLog();
    this.log("CtrlMain.initRounds");
    this.game().initRounds();
    this.log(this.game().msg);
    this.view().initRounds(this.game());
    this.log("");
};

// called once
bj.CtrlMain.prototype.playRounds = function() {
    this.clearLog();
    this.log("CtrlMain.playRounds");
    this.game().playRounds();
    this.log(this.game().msg);
    this.view().playRounds(this.game());

    // no for loop! use event handlers
    //this.initRound();
    //this.playRound();
    this.log("");
};

bj.CtrlMain.prototype.initRound = function() {
    this.clearLog();
    this.log("CtrlMain.initRound");
    this.game().initRound();
    this.log(this.game().msg);
    this.view().initRound(this.game());
    this.log("");
};




// these should each be called by event handlers!
bj.CtrlMain.prototype.playRound = function() {
    this.clearLog();
    this.log("CtrlMain.playRound");
    this.game().playRound();
    this.log(this.game().msg);
    this.view().playRound(this.game());
    this.log("");


bj.CtrlMain.prototype.shuffleDeck = function() {
    this.clearLog();
    this.log("CtrlMain.shuffleDeck");
    this.game().shuffleDeck();
    this.log(this.game().msg);
    this.view().shuffleDeck(this.game());
    this.log("");
};

bj.CtrlMain.prototype.placeBets = function() {
    //this.clearLog();
    this.log("CtrlMain.placeBets");
    this.game().placeBets();
    this.log(this.game().msg);
    this.view().placeBets(this.game());
    this.log("");
};

// NEED TO WAIT FOR INTERACTION
bj.CtrlMain.prototype.placeBet = function() {
    var game = this.game();
    var view = this.view();
    //this.clearLog();
    this.log("");
    this.log("CtrlMain.placeBet");
    //game.placeBet();
    //this.log(this.game().msg);
    //view.placeBet(this.game());
    //this.log("");

    if (game.currPlayer().isAutoPlay) {
        //this.log("auto player about to placeRandomAnte");
        this.placeRandomAnte();
    } else {
        this.log("WAITING TO PLACE ANTE: " + game.currPlayer().name());
    }
};

bj.CtrlMain.prototype.placeRandomAnte = function() {
    this.game().placeRandomAnte();
    this.log(this.game().msg);
    this.view().placeRandomAnte(this.game());
};


bj.CtrlMain.prototype.addChipToAnte = function() {
    if (this.game().addChipToAnte()) {
        this.view().addChipToAnte(this.game());
    } else {
        // FAILED - this.view().addChipToAnteFailed()
    }
};

bj.CtrlMain.prototype.removeChipFromAnte = function() {
    if (this.game().removeChipFromAnte()) {
        this.view().removeChipFromAnte(this.game());
    } else {
        // FAILED - this.view().removeChipFromAnteFailed()
    }
};

// TO DO - ANTE OK BUTTON CANNOT ENABLE UNTIL ANTE > 0
bj.CtrlMain.prototype.playerAntePlaced = function() {
    //this.game().playerAntePlaced();     // TO DO
    //this.view().playerAntePlaced();     // TO DO
    this.game().getNextPlayer();
    this.placeBet();
};



// DON'T FORGET THE isBroke() CHECK! CANNOT PLAY
bj.CtrlMain.prototype.dealFirstCards = function() {
    //this.clearLog();
    this.log("");
    this.log("CtrlMain.dealFirstCards");
    this.game().dealFirstCards();
    this.log(this.game().msg);
    this.view().dealFirstCards(this.game());
    this.log("");
};

// try if/then for Dealer here
bj.CtrlMain.prototype.dealPlayerFirstCards = function() {
    //this.clearLog();
    //this.log("CtrlMain.dealPlayerFirstCards");
    this.game().dealPlayerFirstCards();
    //this.log(this.game().msg);
    this.view().dealPlayerFirstCards(this.game());
    //this.log("");
};


// NEED TO WAIT FOR INTERACTION
bj.CtrlMain.prototype.playPlayersHands = function() {
    //this.clearLog();
    //this.log("CtrlMain.playPlayersHands");
    this.log("");
    this.log("CtrlMain.playPlayersHands");
    this.game().playPlayersHands();
    this.log(this.game().msg);
    this.view().playPlayersHands(this.game());
    this.log("");
};

bj.CtrlMain.prototype.playerHit = function() {
    this.game().playerHit();
    this.view().playerHit(this.game());
};

bj.CtrlMain.prototype.playerStay = function() {
    this.game().playerStay();
    this.view().playerStay(this.game());
};



// NEED TO WAIT FOR INTERACTION
bj.CtrlMain.prototype.playPlayerHand = function() {
    //this.log("CtrlMain.playPlayerHand");
    var game = this.game();
    var view = this.view();

    game.playPlayerHand();
    view.playPlayerHand(game);
    
    if (!game.currPlayer().isAutoPlay) {
        this.log("");
        this.log("WAITING FOR " + game.currPlayer().name() + " TO HIT OR STAY");;
        this.log("");
        return;    // wait for human interaction - button click
    }


    //alert(game.currPlayer().name() + " - " + game.currPlayer().action());
    switch (game.currPlayer().action()) {
        case "HIT" :
            this.playerHit();
            break;
        case "STAY" :
        default :
            this.playerStay();
            break;
    }

    // DON'T FORGET ABOUT BUSTS!
};


bj.CtrlMain.prototype.scorePlayersHands = function() {
    this.log("");
    this.log("CtrlMain.scorePlayersHands");
    this.game().scorePlayersHands();
    //this.log(this.game().msg);
    this.view().scorePlayersHands(this.game());
    this.log("");
};

bj.CtrlMain.prototype.scorePlayerHand = function() {
    //this.log("CtrlMain.scorePlayerHand");
    this.game().scorePlayerHand();
    //this.log(this.game().msg);
    this.view().scorePlayerHand(this.game());
    //this.log("");
};

bj.CtrlMain.prototype.reconcileBets = function() {
    this.log("");
    this.log("CtrlMain.reconcileBets");
    this.game().reconcileBets();
    this.log(this.game().msg);
    this.view().reconcileBets(this.game());
    this.log("");
};

bj.CtrlMain.prototype.completeRound = function() {
    this.log("CtrlMain.completeRound");
    this.game().completeRound();
    this.log(this.game().msg);
    this.view().completeRound(this.game());
    this.log("");
};

////////////////////////////////////////////////////////////////////////////////
















// this handles all the Game events triggered by the view when completed

bj.CtrlMain.prototype.initGameHandler = function() {
    //alert("CtrlMain.initGameHandler");
    this.initRounds();
};

bj.CtrlMain.prototype.initRoundsHandler = function() {
    //alert("CtrlMain.initRoundsHandler");
    this.playRounds();
};

bj.CtrlMain.prototype.playRoundsHandler = function() {
    //alert("CtrlMain.playRoundsHandler");
    this.initRound();
};

// LOOP!
bj.CtrlMain.prototype.initRoundHandler = function() {
    //alert("CtrlMain.initRoundHandler");
    this.playRound();
};

// LOOP!
bj.CtrlMain.prototype.playRoundHandler = function() {
    //alert("CtrlMain.playRoundHandler");
    this.shuffleDeck();
};



bj.CtrlMain.prototype.shuffleDeckHandler = function() {
    //alert("CtrlMain.shuffleDeckHandler");
    this.placeBets();
};

bj.CtrlMain.prototype.placeBetsHandler = function() {
    //alert("CtrlMain.placeBetsHandler");
    this.placeBet();
};

bj.CtrlMain.prototype.placeBetHandler = function() {
    //alert("CtrlMain.placeBetHandler");
    this.game().getNextPlayer();    // getNext() BEFORE check - no dealer bet
    if (this.game().currPlayerIsDealer()) {        
        //alert("dealer - done betting")
        this.dealFirstCards();      // exit
    } else {
        this.placeBet();            // stay in "loop"
    }
};

bj.CtrlMain.prototype.placeRandomAnteHandler = function() {
    //alert("CtrlMain.placeRandomAnte");
    this.game().getNextPlayer();    // getNext() BEFORE check - no dealer bet
    if (this.game().currPlayerIsDealer()) {        
        //alert("dealer - done betting")
        this.dealFirstCards();      // exit
    } else {
        this.placeBet();            // stay in "loop"
    }
};

// loop
bj.CtrlMain.prototype.dealFirstCardsHandler = function() {
    //alert("CtrlMain.dealFirstCardsHandler");
    this.dealPlayerFirstCards();
};

bj.CtrlMain.prototype.dealPlayerCardHandler = function() {
    //alert("CtrlMain.dealPlayerCardHandler");
    var game = this.game();
    if (game.currPlayerIsDealer() && game.currPlayer().cardCount() == 2) {
        // alert("DEALER GOT SECOND CARD")
        // this.flip DealerCard() TO DO!!!
        this.playPlayersHands();        // exit "loop"
    } else {
        game.getNextPlayer();           // will wrap around
        this.dealPlayerFirstCards();    // continue in "loop"    
    }
};



bj.CtrlMain.prototype.playPlayersHandsHandler = function() {
    //alert("CtrlMain.playPlayersHandsHandler");
    this.playPlayerHand();
};

// the decisions are made in the playPlayerHand() method
bj.CtrlMain.prototype.playPlayerHandHandler = function() {
    //alert("CtrlMain.playPlayerHandHandler");
};

bj.CtrlMain.prototype.playerHittingHandler = function() {
    // stay on current player
    this.playPlayerHand();          // stay in "loop"
};

bj.CtrlMain.prototype.playerStayingHandler = function() {
    if (this.currPlayerIsDealer()) {
        this.scorePlayersHands();       // exit "loop"
    } else {
        this.game().getNextPlayer();
        this.playPlayerHand();    
    }
};



/*
bj.CtrlMain.prototype.playDealerHandHandler = function() {
    //alert("CtrlMain.playDealerHandHandler");
    // flip card first!
    this.scorePlayersHands();
};
*/



bj.CtrlMain.prototype.scorePlayersHandsHandler = function() {
    //alert("CtrlMain.scorePlayersHandsHandler");
    this.scorePlayerHand();
};

bj.CtrlMain.prototype.scorePlayerHandHandler = function() {
    //alert("CtrlMain.scorePlayerHandHandler");
    if (this.currPlayerIsDealer()) {
        this.reconcileBets();       // exit "loop"
    } else {
        this.game().getNextPlayer();
        this.scorePlayerHand();    
    }
};

/*
bj.CtrlMain.prototype.scoreDealerHandHandler = function() {
    //alert("CtrlMain.scoreDealerHandHandler");
    this.reconcileBets();
};
*/

bj.CtrlMain.prototype.reconcileBetsHandler = function() {
    //alert("CtrlMain.reconcileBetsHandler");
    this.completeRound();
};

bj.CtrlMain.prototype.completeRoundHandler = function() {
    //alert("CtrlMain.completeRoundHandler");
};


