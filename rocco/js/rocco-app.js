// rocco-app.js

// the main app object
RoccoApp = function() {

    // app properties

    this.$main    = null;       // <main> to be populated via Ajax
    this.$navbar  = null;

    this.$home    = null;       // clickable menu items that load Pages
    this.$reserve = null;
    this.$about   = null;
    this.$menu    = null;
    this.$media   = null;

    this.$btnReserve = null;    // on Home.html page - dynamically loaded

    this.errHtml = "";          // displayed in <main> if load error
    this.errHtml += "<br><br><h2 class='text-center'>We're sorry but we can't seem to load this page.<br>";
    this.errHtml += "<br>Please try again in a little while.</h2></br>";


    // app methods

    // call this manually after creating this app object
    this.run = function() {
        this.assignObjects();              // create jQuery objects
        this.ajaxLoadPage(this.$home);     // load Home page first
        this.preloadPages();               // cache HTML page snippets
    };
    

    // create jQuery object for the <main> area to hold HTML paegs
    // create jQuery objects for the clickable menu items
    this.assignObjects = function() {

        // assign jQuery objects
        this.$main    = $("main");      // fill with page content
        this.$navbar  = $("#navbarResponsive");    // by id

        this.$home    = $("#home");     // clickable menu items
        this.$reserve = $("#reserve");
        this.$about   = $("#about");
        this.$menu    = $("#menu");
        this.$media   = $("#media");

        // assign click handlers to the menu items
        this.$home.bind("click", this.$home, this._clickHandler);
        this.$reserve.bind("click", this.$reserve, this._clickHandler);
        this.$about.bind("click", this.$about, this._clickHandler);
        this.$menu.bind("click", this.$menu, this._clickHandler);
        this.$media.bind("click", this.$media, this._clickHandler);

        // set an app property for correct context of method calls
        this.$home.app    = this;
        this.$reserve.app = this;
        this.$about.app   = this;
        this.$menu.app    = this;
        this.$media.app   = this;

        // set url prop for loading HTML partial page
        this.$home.url    = "html/home.html";
        this.$reserve.url = "html/reserve.html";
        this.$about.url   = "html/about.html";
        this.$menu.url    = "html/menu.html";
        this.$media.url   = "html/media.html";

        // set the default "Page not found" HTML
        this.$home.htmlContent    = this.errHtml;
        this.$reserve.htmlContent = this.errHtml;
        this.$about.htmlContent   = this.errHtml;
        this.$menu.htmlContent    = this.errHtml;
        this.$media.htmlContent   = this.errHtml;

        //alert("RestaurantApp.assignObjects OK");
    };

    // loads HTML into <main> on main page
    // only used now for initial "home" page load since we are using preLoad page now
    this.ajaxLoadPage = function($item) {
        var self = this;    
        $.get($item.url, null, null, "html")        // must supply empty null params!
            .done(function(data) {
              self.$main.html(data);
            })
            .fail(function() {
              self._ajaxErrorHandler();
            });
    };
    

    // load HTML page snippets into HTML holders - this happens at app startup
    this.preloadPages = function() {
        this.preloadPage(this.$home);
        this.preloadPage(this.$reserve);
        this.preloadPage(this.$about);
        this.preloadPage(this.$menu);
        this.preloadPage(this.$media);
    };

    // loads HTML into objects
    this.preloadPage = function($item) {
        var app = this;
        $.get($item.url, null, null, "html")        // must supply empty null params!
        .done(function(data) {
            $item.htmlContent = data;             // holds the HTML snippet for this page
            if ($item.url == "html/home.html") {
                app.$btnReserve = $("#btn-reserve");
                app.$btnReserve.bind("click", function() {
                    app.$reserve.click();
                });
            }            
        });
    };

    // event handlers
    this._clickHandler = function(e) {
        var $item = e.data;
        var app = $item.app;
        app.$main.html($item.htmlContent);          // fill <main> with Page content
        app.$navbar.collapse("hide");               // must close menu manually - no page refresh
        window.scrollTo(0, 0);                      // scroll to top every refresh
    };

    // display message if Page content does not load
    this._ajaxErrorHandler = function(e) {
        this.$main.html(this.errHtml);
    };

};

