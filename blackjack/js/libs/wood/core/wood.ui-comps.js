/******************************************************************************

	wood.ui-comps.js
	Andy Knoll
	December 2018
    
    requires jQuery

    A set of UI common components reusable throughout WOOD applications.

        wood.Panel
        wood.StatusBar
        wood.Display
        wood.Button


    uiComp = new MyUIComp("uiComp", parent, elemId);

******************************************************************************/

// wood.UIComponent class - base UI Component
wood.UIComponent = function(name, parent, elemId) {
    wood.Component.call(this, name, parent, elemId);
    this._className = "wood.UIComponent";
};
wood.UIComponent.prototype = Object.create(wood.Component.prototype);
wood.UIComponent.prototype.constructor = wood.UIComponent;



// wood.Panel class
wood.Panel = function(name, parent, elemId) {
    wood.UIComponent.call(this, name, parent, elemId);
    this._className = "wood.Panel";
};
wood.Panel.prototype = Object.create(wood.UIComponent.prototype);
wood.Panel.prototype.constructor = wood.Panel;

wood.Panel.prototype._template = function() {
    var t = "";
    //t += "<div id='myProp'></div>";
    return t;
};




// wood.StatusBar
wood.StatusBar = function(name, parent, elemId) {
    wood.Panel.call(this, name, parent, elemId);
    this._className = "wood.StatusBar";
    this.content = "";      // display in component
};
wood.StatusBar.prototype = Object.create(wood.Panel.prototype);
wood.StatusBar.prototype.constructor = wood.StatusBar;

wood.StatusBar.prototype._template = function() {
    var t = "";
    t += "<div id='content'></div>";
    return t;
};

wood.StatusBar.prototype.write = function(s) {
    //this.$elem.html(s);           // direct technique
    this.setProp("content", s);     // prop technique
};

wood.StatusBar.prototype.clear = function(s) {
    this.setProp("content", "");
};




// wood.Display
wood.Display = function(name, parent, elemId) {
    wood.StatusBar.call(this, name, parent, elemId);
    this._className = "wood.Display";
};
wood.Display.prototype = Object.create(wood.StatusBar.prototype);
wood.Display.prototype.constructor = wood.Display;

// overridden for Display
wood.Display.prototype.write = function(s) {
    var old = this.content;
    s += "<br>";
    this.setProp("content", old + s);     // prop technique
};



// wood.Button
wood.Button = function(name, parent, elemId) {
    wood.Panel.call(this, name, parent, elemId);
    this._className = "wood.Button";
    this.label = "";
};
wood.Button.prototype = Object.create(wood.Panel.prototype);
wood.Button.prototype.constructor = wood.Button;

wood.Button.prototype._template = function() {
    var t = "";
    t += "<div id='label'></div>";
    return t;
};

// shorthand method
wood.Button.prototype.setLabel = function(s) {
    this.setProp("label", s);     // prop technique
};

wood.Button.prototype.info = function() {
	var s = "";
    s += wood.Panel.prototype.info.call(this);  // call base
    s += ".label: " + this.label;
	return s;
};

