/* 
    qp.views.js 

    Andy Knoll
    November 2018

*/

qp.Views = function(name, parent) {
    qp.debug("==> app creating Views");
    this.name = name;
    this.parent = parent;

    // the app's views
    this.gameView = null;

    // assign all the jQuery objects here
    // these are not part of the game logic - UI only
    this.createViews = function() {
        qp.debug("Views.createViews");
        // create the Game UI
        this.gameView = new qp.GameView("gameView", this);
    };

    this.createViews();
};

qp.GameView = function(name, parent) {
    qp.debug("GameView constructor");
    this.name = name;
    this.parent = parent;

    this.pieces = [];           // holds visual game "pieces" - block + label
    this.currPiece  = null;     // set when selected (clicked)
    this.levelViews = null;     // holds HTML fragments for levels

    // not needed but nice to declare
    this.progressBar = null;

    this.$scoreboard   = null;
    this.$gameboard    = null;
    this.$levelDisplay = null;
    this.$pickDisplay  = null;
    
    this.$btnLevel1 = null;
    this.$btnLevel2 = null;
    this.$btnLevel3 = null;
    this.$btnLevel4 = null;
    
    this.$btnPlay = $("#button-play");
    this.$btnPlayLabel = $("#button-play-label");

    // getter method
    this.piece = function(idx) { return this.pieces[idx]; };


    this.createChildObjects = function() {
        qp.debug("GameView.createChildObjects");

        // progressBar is an Andy custom "component" - not jQuery but uses it
        this.progressBar = new ProgressBar("progressBar", this, "my-progress-bar");
        this.progressBar.min = 0;
        this.progressBar.max = 60;
        this.initProgressBar(0);      // default is 0
    
        this.$btnPlay = $("#button-play");

        this.$btnLevel1 = $("#button-level-1");
        this.$btnLevel2 = $("#button-level-2");
        this.$btnLevel3 = $("#button-level-3");
        this.$btnLevel4 = $("#button-level-4");

        this.$scoreboard   = $("#scoreboard");
        this.$gameboard    = $("#gameboard");
        this.$levelDisplay = $("#current-level-display");
        this.$pickDisplay  = $("#current-pick-display");

        this.levelViews = new qp.LevelViews("levelViews", this);
        this.$header = $("header");        // for launching tests only - disable!
    };

    this.startGame = function(timeRemaining) {
        qp.debug("GameView.startGame");
        this.initProgressBar(timeRemaining);
        this.initAllPieces();
        this.showAllPieces();
        this.$btnPlayLabel.html("QUIT THIS ROUND");
    };

    this.stopGame = function() {
        this.$btnPlayLabel.html("START PICKIN'");
        this.showCurrPick("?");
        //this.initAllPieces();
        //this.showAllPieces();
    };

    this.initGame = function() {
        this.stopGame();
        this.progressBar.setValue(0);
        this.showCurrPick("?");
        //this.initAllPieces();
        //this.showAllPieces();
    };

    this.showCurrPick = function(val) {
        this.$pickDisplay.html(val);
    };
    
    this.initProgressBar = function(val) {
        qp.debug("GameView.initProgressBar");
        this.progressBar.$inner.removeClass("bar-warning");
        this.progressBar.$inner.removeClass("bar-danger");
        //this.progressBar.$inner.removeClass("bar-normal");
        //this.progressBar.$inner.addClass("bar-normal");
        this.progressBar.max = val;
        this.progressBar.setValue(val);
    };

    this.animProgressBarValue = function(val, dur) {
        var cssClass = "";
        var bar = this.progressBar;
        var percent = 0;

        bar.animValue(val, dur);
        percent = bar.percent();

        // update colors
        if (percent > 66) {
            //cssClass = "bar-normal";
        } else if (percent > 33 && percent < 66) {
            cssClass = "bar-warning";
        } else if (percent < 33) {
            cssClass = "bar-danger";
        }
        bar.$inner.addClass(cssClass)
    };

    // pass in the Game's current Level object
    this.loadLevel = function(levelObj) {
        qp.debug("GameView.loadLevel");
        var idx = levelObj.index;
        var html = this.levelViews.view(idx);
        var maxPieces = levelObj.maxPieces;

        this.$gameboard.html(html);             // inject HTML - must rebind handlers
        this.createPiecesArray(maxPieces);      // created each level change
    };

    // called by each loadLevel()
    // the $gameboard HTML must be present!
    this.createPiecesArray = function(maxPieces) {
        qp.debug("GameView.createPiecesArray");
        //alert("GameView.createPiecesArray");
        var piece = null;
        var id = "";

        this.pieces = [];
        for (var i = 0; i < maxPieces; i++) {
            id = "p" + i;       // also in HTML
            piece = new qp.GamePiece(id, this);
            piece.index = i;              // 0-based
            piece.setValue(i + 1);        // 1-based - also updates UI
            this.pieces.push(piece);
        }
        qp.debug("created " + this.pieces.length + " GamePieces");
        qp.debug(this.pieces);
    };


    // sets the order to same as the shuffled source array
    // called by Controller's loadLevel() and startGame()
    this.shufflePieceValues = function(modelPieces) {
        qp.debug("GameView.shufflePiecesArray");
        var maxPieces = this.pieces.length;     // already created
        qp.debug(this.pieces);
        for (var i = 0; i < maxPieces; i++) {
            this.piece(i).setValue(modelPieces[i]);
        }
        qp.debug(this.pieces);
    };

    this.initAllPieces = function() {
        qp.debug("GameView.initAllPieces");
        for (var i = 0; i < this.pieces.length; i++) {
            this.piece(i).showNeutral();
        }
    };

    this.hideAllPieces = function() {
        qp.debug("GameView.hideAllPieces");
        for (var i = 0; i < this.pieces.length; i++) {
            this.piece(i).hide();
        }
    };

    // must be shuffled for this technique to show pieces randomly!
    this.showAllPieces = function() {
        qp.debug("GameView.showAllPieces");
        var self = this;
        var i = 0;
        var rndIdx = 0;
        var pieces = this.pieces;
        var maxPieces = pieces.length;
        var timer = 0;
        var dur = 1000 / maxPieces; // set delay time based on number of pieces

        this.hideAllPieces();
        timer = setInterval(function() {
            rndIdx = self.piece(i).value-1;       // use value, not index!
            self.piece(rndIdx).show();
            i++;
            if (i == maxPieces) {
                clearInterval(timer);
            }
        }, dur);
    };

    // use the overlay screen here
    this.showWinner = function() {
        qp.debug("GameView.showWinner");
        alert("WINNER!");
        // advance to next level
    };

    this.createChildObjects();
};








qp.GamePiece = function(name, parent) {
    //qp.debug("GamePiece constructor for piece: " + name);
    this.name = name;
    this.parent = parent;
    this.value = 0;
    this.index = -1;            // set when creating pieces[] array

    this.$elem = $("#" + name);
    this.$label = this.$elem.find(".label");

    // also updates UI
    this.setValue = function(val) {
        this.value = val;
        this.$label.html(this.value);
    };

    this.showCorrect = function() {
        this.$elem.removeClass("block-incorrect");
        this.$elem.addClass("block-correct");
    };

    this.showIncorrect = function() {
        var self = this;
        this.$elem.removeClass("block-correct");
        this.$elem.addClass("block-incorrect");
        // only show incorrect for 250 msecs
        setTimeout(function() {
            self.showNeutral();
        }, 100);
    };

    this.showNeutral = function() {
        this.$elem.removeClass("block-correct");
        this.$elem.removeClass("block-incorrect");
    };

    this.hide = function() {
        this.$elem.css("visibility", "hidden");
    };
    
    this.show = function() {
        this.$elem.css("visibility", "visible");
    };
    

};








// this is an example of an object acting as an array
qp.LevelViews = function(name, parent) {
    qp.debug("LevelViews constructor");
    this.name = name;
    this.parent = parent;

    this._views = [];       // "private" (not really)

    // getter method
    this.view = function(idx) { return this._views[idx]; };

    // called automatically at creation
    // the ids are CRITICAL to create the jQuery GamePiece objects! use 0-based id values!
    this.createLevelsHtml = function() {
        qp.debug("LevelViews.createLevelsHtml");
        var html = "";

        // 3x3 grid - correct id values are critical
        html = `
            <div class="row h-33">
                <div class="column"><div class="block" id="p0"><div class="label"></div></div></div>
                <div class="column"><div class="block" id="p1"><div class="label"></div></div></div>
                <div class="column"><div class="block" id="p2"><div class="label"></div></div></div>
            </div>
            <div class="row h-33">
                <div class="column"><div class="block" id="p3"><div class="label"></div></div></div>
                <div class="column"><div class="block" id="p4"><div class="label"></div></div></div>
                <div class="column"><div class="block" id="p5"><div class="label"></div></div></div>
            </div>
            <div class="row h-33">
                <div class="column"><div class="block" id="p6"><div class="label"></div></div></div>
                <div class="column"><div class="block" id="p7"><div class="label"></div></div></div>
                <div class="column"><div class="block" id="p8"><div class="label"></div></div></div>
            </div>    
        `;
        this._views.push(html);

        // 4x4 grid - correct id values are critical
        html = `
            <div class="row h-25">
                <div class="column"><div class="block" id="p0"><div class="label">1</div></div></div>
                <div class="column"><div class="block" id="p1"><div class="label">2</div></div></div>
                <div class="column"><div class="block" id="p2"><div class="label">3</div></div></div>
                <div class="column"><div class="block" id="p3"><div class="label">4</div></div></div>
            </div>
            <div class="row h-25">
                <div class="column"><div class="block" id="p4"><div class="label">5</div></div></div>
                <div class="column"><div class="block" id="p5"><div class="label">6</div></div></div>
                <div class="column"><div class="block" id="p6"><div class="label">7</div></div></div>
                <div class="column"><div class="block" id="p7"><div class="label">8</div></div></div>
            </div>
            <div class="row h-25">
                <div class="column"><div class="block" id="p8"><div class="label">9</div></div></div>
                <div class="column"><div class="block" id="p9"><div class="label">10</div></div></div>
                <div class="column"><div class="block" id="p10"><div class="label">11</div></div></div>
                <div class="column"><div class="block" id="p11"><div class="label">12</div></div></div>
            </div>
            <div class="row h-25">
                <div class="column"><div class="block" id="p12"><div class="label">13</div></div></div>
                <div class="column"><div class="block" id="p13"><div class="label">14</div></div></div>
                <div class="column"><div class="block" id="p14"><div class="label">15</div></div></div>
                <div class="column"><div class="block" id="p15"><div class="label">16</div></div></div>
            </div>
        `;
        this._views.push(html);

        // 5x5 grid - correct id values are critical
        html = `
            <div class="row h-20">
                <div class="column"><div class="block" id="p0"><div class="label">1</div></div></div>
                <div class="column"><div class="block" id="p1"><div class="label">2</div></div></div>
                <div class="column"><div class="block" id="p2"><div class="label">3</div></div></div>
                <div class="column"><div class="block" id="p3"><div class="label">4</div></div></div>
                <div class="column"><div class="block" id="p4"><div class="label">5</div></div></div>
            </div>
            <div class="row h-20">
                <div class="column"><div class="block" id="p5"><div class="label">6</div></div></div>
                <div class="column"><div class="block" id="p6"><div class="label">7</div></div></div>
                <div class="column"><div class="block" id="p7"><div class="label">8</div></div></div>
                <div class="column"><div class="block" id="p8"><div class="label">9</div></div></div>
                <div class="column"><div class="block" id="p9"><div class="label">10</div></div></div>
            </div>
            <div class="row h-20">
                <div class="column"><div class="block" id="p10"><div class="label">11</div></div></div>
                <div class="column"><div class="block" id="p11"><div class="label">12</div></div></div>
                <div class="column"><div class="block" id="p12"><div class="label">13</div></div></div>
                <div class="column"><div class="block" id="p13"><div class="label">14</div></div></div>
                <div class="column"><div class="block" id="p14"><div class="label">15</div></div></div>
            </div>
            <div class="row h-20">
                <div class="column"><div class="block" id="p15"><div class="label">16</div></div></div>
                <div class="column"><div class="block" id="p16"><div class="label">17</div></div></div>
                <div class="column"><div class="block" id="p17"><div class="label">18</div></div></div>
                <div class="column"><div class="block" id="p18"><div class="label">19</div></div></div>
                <div class="column"><div class="block" id="p19"><div class="label">20</div></div></div>
            </div>    
            <div class="row h-20">
                <div class="column"><div class="block" id="p20"><div class="label">21</div></div></div>
                <div class="column"><div class="block" id="p21"><div class="label">22</div></div></div>
                <div class="column"><div class="block" id="p22"><div class="label">23</div></div></div>
                <div class="column"><div class="block" id="p23"><div class="label">24</div></div></div>
                <div class="column"><div class="block" id="p24"><div class="label">25</div></div></div>
            </div>
        `;
        this._views.push(html);

        // 6x6 grid - correct id values are critical
        html = `
            <div class="row h-16">
                <div class="column"><div class="block" id="p0"><div class="label">1</div></div></div>
                <div class="column"><div class="block" id="p1"><div class="label">2</div></div></div>
                <div class="column"><div class="block" id="p2"><div class="label">3</div></div></div>
                <div class="column"><div class="block" id="p3"><div class="label">4</div></div></div>
                <div class="column"><div class="block" id="p4"><div class="label">5</div></div></div>
                <div class="column"><div class="block" id="p5"><div class="label">6</div></div></div>
            </div>
            <div class="row h-16">
                <div class="column"><div class="block" id="p6"><div class="label">7</div></div></div>
                <div class="column"><div class="block" id="p7"><div class="label">8</div></div></div>
                <div class="column"><div class="block" id="p8"><div class="label">9</div></div></div>
                <div class="column"><div class="block" id="p9"><div class="label">10</div></div></div>
                <div class="column"><div class="block" id="p10"><div class="label">11</div></div></div>
                <div class="column"><div class="block" id="p11"><div class="label">12</div></div></div>
            </div>
            <div class="row h-16">
                <div class="column"><div class="block" id="p12"><div class="label">13</div></div></div>
                <div class="column"><div class="block" id="p13"><div class="label">14</div></div></div>
                <div class="column"><div class="block" id="p14"><div class="label">15</div></div></div>
                <div class="column"><div class="block" id="p15"><div class="label">16</div></div></div>
                <div class="column"><div class="block" id="p16"><div class="label">17</div></div></div>
                <div class="column"><div class="block" id="p17"><div class="label">18</div></div></div>
            </div>
            <div class="row h-16">
                <div class="column"><div class="block" id="p18"><div class="label">19</div></div></div>
                <div class="column"><div class="block" id="p19"><div class="label">20</div></div></div>
                <div class="column"><div class="block" id="p20"><div class="label">21</div></div></div>
                <div class="column"><div class="block" id="p21"><div class="label">22</div></div></div>
                <div class="column"><div class="block" id="p22"><div class="label">23</div></div></div>
                <div class="column"><div class="block" id="p23"><div class="label">24</div></div></div>
            </div>
            <div class="row h-16">
                <div class="column"><div class="block" id="p24"><div class="label">25</div></div></div>
                <div class="column"><div class="block" id="p25"><div class="label">26</div></div></div>
                <div class="column"><div class="block" id="p26"><div class="label">27</div></div></div>
                <div class="column"><div class="block" id="p27"><div class="label">28</div></div></div>
                <div class="column"><div class="block" id="p28"><div class="label">29</div></div></div>
                <div class="column"><div class="block" id="p29"><div class="label">30</div></div></div>
            </div>
            <div class="row h-16">
                <div class="column"><div class="block" id="p30"><div class="label">31</div></div></div>
                <div class="column"><div class="block" id="p31"><div class="label">32</div></div></div>
                <div class="column"><div class="block" id="p32"><div class="label">33</div></div></div>
                <div class="column"><div class="block" id="p33"><div class="label">34</div></div></div>
                <div class="column"><div class="block" id="p34"><div class="label">35</div></div></div>
                <div class="column"><div class="block" id="p35"><div class="label">36</div></div></div>
            </div>
        `;
        this._views.push(html);
    };

    this.createLevelsHtml();
};


