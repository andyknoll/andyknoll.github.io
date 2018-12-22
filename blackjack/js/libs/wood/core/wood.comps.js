/******************************************************************************

	wood.comps.js
	Andy Knoll
	December 2018 (revisited)
    
    requires jQuery

    wood.Component

    This replaces/combines the older VisualObject. Uses existing HTML tags.
    No longer re-renders when setting props. Must override setProp() now!

    comp = new MyComp("comp", parent, elemId);

******************************************************************************/

// NOTE: THESE ARE VISIBLE DOM OBJECTS. 
// THE $dispatcher IS REPLACED WITH THE HTML ELEMENT BEING WRAPPED

// wood.Component - uses existing HTML elements
wood.Component = function(name, parent, elemId) {
    wood.Object.call(this, name, parent);
    this._className = "wood.Component";

    this.props = {};                // common to all Components
    this.comps = {};                // common to all Components

    this._$elem = null;                     // until wrapped
    this._elem  = null;                     // the actual HTML element
    this._wrapElement(elemId);              // wrap existing elem in a jQuery object
    this._$dispatcher = this._$elem;        // IMPORTANT!!! replace here in Components

    this.render();                          // calls setHtml() - called only once!
    this.setStyles();                       // inline CSS bundled with comp
    this._createChildComps();               // only after HTML is present
    this._initChildComps();                 // only after comps created
};
wood.Component.prototype = Object.create(wood.Object.prototype);       // no "new"
wood.Component.prototype.constructor = wood.Component;

// getters
wood.Component.prototype.elem    = function() { return this._elem; };
wood.Component.prototype.$elem   = function() { return this._$elem; };
wood.Component.prototype.$elemId = function() { return this._$elem.attr("id"); }

// get unique element name
wood.Component.prototype.uid = function() { 
    var id = "";
    if (this.parent() != null) {
        id += this.parent().$elemId() + "-";
    }
    id += this.$elemId();
    return id; 
};

wood.Component.prototype.isVisual = function() { return this._elem != null; };

// must override this in custom components!
// provide HTML fragment here
wood.Component.prototype._template = function() {
    var t = "";
    return t;
};

wood.Component.prototype._createChildComps = function() {
    // create embedded components here - need the HTML first
};

wood.Component.prototype._initChildComps = function() {
    // init embedded components here - need to be created first
};

// element must already exist! (usually in another comp's template)
wood.Component.prototype._wrapElement = function(elemId) {
    this._$elem = $("#" + elemId);          // wrap existing in a jQuery object
    try {
        if (!this._$elem[0]) {
            throw "ERROR: element '" + elemId + "' does not exist to wrap component"
        }
        this._elem = this._$elem[0];        // first wrapped element    
    } catch(err) {
        alert(err);
    }
};

// convenience methods
wood.Component.prototype.addClickHandler = function(rcvr, handler) {
    this.addHandler(wood.event.CLICK, rcvr, handler);
};

// public - NOW CALLED ONLY ONCE IN CONSTRUCTOR!
// what about child components that need to change?
// calling this again will obliterate them!
wood.Component.prototype.render = function() {
    this.setHtml(this._template());
};

wood.Component.prototype.setStyles = function() {
    // use setCss()
};

// CSS styles - getters and setters
wood.Component.prototype.setCss = function(css, val) { this._$elem.css(css, val); };
wood.Component.prototype.getCss = function(css) { return this._$elem.css(css); };


wood.Component.prototype.setCssTLHW = function(t, l, h, w) {
    this.setCss("top",    t);
    this.setCss("left",   l);
    this.setCss("height", h);
    this.setCss("width",  w);
};

wood.Component.prototype.setHtml = function(text) {
    this.$elem().html(text);
};

wood.Component.prototype.getHtml = function() {
    return this.$elem().html();
};

// similar to wood.Console.write()
wood.Component.prototype.addHtml = function(text) {
    var old = this.getHtml();
    this.setHtml(old + text);
};

wood.Component.prototype.addCssClass = function(cssClass) {
    this.$elem().addClass(cssClass);
};

wood.Component.prototype.removeCssClass = function(cssClass) {
    this.$elem().removeClass(cssClass);
};

wood.Component.prototype.show = function() {
    this.setCss("visibility", "visible");
};

wood.Component.prototype.hide = function() {
    this.setCss("visibility", "hidden");
};


wood.Component.prototype.info = function() {
    var s = "";
    s += wood.Object.prototype.info.call(this);
    if (!this.isVisual()) {
        s += "No visual element properties!"
        return s;
    }
    s += "elem: "    + this.elem() + "<br>";
    s += "$elem: "   + this.$elem() + "<br>";
    s += "$elemId: " + this.$elemId() + "<br>";
    
    // some CSS props
    s += "top: "      + this.getCss("top")     + "<br>";
    s += "left: "     + this.getCss("left")    + "<br>";
    s += "height: "   + this.getCss("height")  + "<br>";
    s += "width: "    + this.getCss("width")   + "<br>";
    s += "opacity: "  + this.getCss("opacity") + "<br>";
    s += "bg-color: " + this.getCss("background-color") + "<br>";
   return s;
};


wood.Component.prototype.addChildComp = function(comp) {
    var id = comp.name();
    return this.comps[id] = comp;
};

wood.Component.prototype.comp = function(name) {
    return this.comps[name];
};

// new 12-09-2018

// right now we are using the string name of the child comp
wood.Component.prototype.setProp = function(prop, val) {
    if (!this.hasOwnProperty(prop)) {
        alert(this.name() + " property does not exist: " + prop);
        return;
    } 
    if (this[prop] === val) return;
    this[prop] = val;
    // now update the UI to reflect change
    this.refreshProp(prop);
};

// called by setProp() only on valid props
wood.Component.prototype.refreshProp = function(prop) {
    var id = "#" + prop;                   // must be DOM unique though!
    var $prop = this.$elem().find(id);     // jQuery portion of HTML
    this[prop] = this.getPropValue(prop);  // for calculated values
    $prop.html(this[prop]);                // keeps child comps intact!
    this.refreshCalcProps(prop);
};


// easy way to handle computed properties if any
wood.Component.prototype.getPropValue = function(prop) {
    var value = this[prop];     // default
    // if (prop = "fullname") value = this.firstname + " " + this.lastname;        // for example
    return value;
};

// override for computed properties if any
wood.Component.prototype.refreshCalcProps = function(prop) {
    // if (prop = "firstname") this.refreshProp("fullname");        // for example
};









//////////////////////////////////////////////////////////////////////////////

// wood.MyComp class - use as a template
wood.MyComp = function(name, parent, elemId) {
    wood.Component.call(this, name, parent, elemId);
    this._className = "wood.MyComp";
};
wood.MyComp.prototype = Object.create(wood.Component.prototype);
wood.MyComp.prototype.constructor = wood.MyComp;


// BE CAREFUL OF CSS NAME AND CLASS COLLISIONS! e.g. id='text'
// prefix with prop- ????
// must override this in custom components!
// provide HTML fragment here
wood.MyComp.prototype._template = function() {
    var t = "";
    t += "<div id='myDiv'></div>";
    return t;
};

wood.MyComp.prototype._createChildComps = function() {
    // create embedded components here - need the HTML first
};

wood.MyComp.prototype._initChildComps = function() {
    // init embedded components here - need to be created first
};

// show child comps if needed...
wood.MyComp.prototype.info = function() {
    var s = wood.Component.prototype.info.call(this);
    // child info here...
    // s += "<br>";
    return s;
};

// easy way to handle computed properties if any
wood.MyComp.prototype.getPropValue = function(prop) {
    var value = wood.Component.prototype.getPropValue.call(this, prop);
    // if (prop = "fullname") value = this.firstname + " " + this.lastname;        // for example
    return value;
};

// override for computed properties if any
wood.MyComp.prototype.refreshCalcProps = function(prop) {
    // if (prop = "firstname") this.refreshProp("fullname");        // for example
};

//////////////////////////////////////////////////////////////////////////////
