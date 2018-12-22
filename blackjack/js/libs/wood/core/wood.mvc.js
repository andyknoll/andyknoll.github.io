/******************************************************************************

	wood.mvc.js
	Andy Knoll
	December 2018 (revisited)
    
    This file implements the MvcApp and supporting classes.

    All app functionality is now provided in the custom classes 
    which are the Models, Views, and Controllers for the app.

    The developer will write custom classes which make up the app.

    wood.MvcApp

    wood.Models
    wood.Views
    wood.Controllers

    wood.Model
    wood.View
    wood.Controller

******************************************************************************/

// base wood.MvcApp class
// app functionality is now in the MVC objects
wood.MvcApp = function(name, parent) {
    this._models = null;    // created later
    this._views  = null;
    this._ctrls  = null;
    wood.App.call(this, name, parent);
    this._className = "wood.MvcApp";
    this._createMvcObjects();
};
wood.MvcApp.prototype = Object.create(wood.App.prototype);
wood.MvcApp.prototype.constructor = wood.MvcApp;

// getters
wood.MvcApp.prototype.models = function() { return this._models; };
wood.MvcApp.prototype.views  = function() { return this._views; };
wood.MvcApp.prototype.ctrls  = function() { return this._ctrls; };

wood.MvcApp.prototype.model = function(idx) { return this._models.model(idx); };
wood.MvcApp.prototype.view  = function(idx) { return this._views.view(idx); };
wood.MvcApp.prototype.ctrl  = function(idx) { return this._ctrls.ctrl(idx); };

wood.MvcApp.prototype._createMvcObjects = function() {
    this._models = new wood.Models("_models", this);
    this._views  = new wood.Views("_views", this);
    this._ctrls  = new wood.Controllers("_ctrls", this);
};

wood.MvcApp.prototype.info = function() {
	var s = "";
    s += wood.App.prototype.info.call(this);
    s += "<br>";
    s += ".models: <br>" + this._models.info() + "<br>";
    s += ".views:  <br>" + this._views.info()  + "<br>";
    s += ".ctrls:  <br>" + this._ctrls.info()  + "<br>";
	return s;
};

// for debug only
wood.Object.prototype.infoShort = function() {
    var s = "OBJECT DETAILS <br/>";
    s += ".name: " + this.name() + "<br/>";
    s += ".className: "   + this.className()     + "<br>";
    s += ".models: "      + this._models.name()  + "<br>";
    s += "models count: " + this._models.count() + "<br>";
    s += ".views: "       + this._views.name()   + "<br>";
    s += "views count: "  + this._views.count()  + "<br>";
    s += ".ctrls: "       + this._ctrls.name()   + "<br>";
    s += "ctrls count: "  + this._ctrls.count()  + "<br>";
    return s;
};





// wood.Models class
wood.Models = function(name, parent) {
    wood.Collection.call(this, name, parent);
    this._className = "wood.Models";
}
wood.Models.prototype = Object.create(wood.Collection.prototype);
wood.Models.prototype.constructor = wood.Models;

// getters
wood.Models.prototype.model = function(idx) { return this.object(idx); };
//wood.Models.prototype.app   = function() { return this.parent(); };

wood.Models.prototype.addModel = function(model) { 
    this[model.name()] = model;     // make prop - weird but works
    return this.addObject(model); 
};




// wood.Views class
wood.Views = function(name, parent) {
    wood.Collection.call(this, name, parent);
    this._className = "wood.Views";
}
wood.Views.prototype = Object.create(wood.Collection.prototype);
wood.Views.prototype.constructor = wood.Views;

// getters
wood.Views.prototype.view = function(idx) { return this.object(idx); };
//wood.Views.prototype.app  = function() { return this.parent(); };

wood.Views.prototype.addView = function(view) { 
    this[view.name()] = view;     // make prop - weird but works
    return this.addObject(view); 
};

wood.Views.prototype.addComp = function(comp) { 
    this[comp.name()] = comp;     // make prop - weird but works
    return this.addObject(comp); 
};



// wood.Controllers class
wood.Controllers = function(name, parent) {
    wood.Collection.call(this, name, parent);
    this._className = "wood.Controllers";
}
wood.Controllers.prototype = Object.create(wood.Collection.prototype);
wood.Controllers.prototype.constructor = wood.Controllers;

// getters
wood.Controllers.prototype.ctrl = function(idx) { return this.object(idx); };
wood.Controllers.prototype.app  = function() { return this.parent(); };

// only Controllers have access to Models and Views
wood.Controllers.prototype.models = function() { return this.parent().models(); };
wood.Controllers.prototype.views  = function() { return this.parent().views(); };
wood.Controllers.prototype.model  = function(idx) { return this.models().model(idx); };
wood.Controllers.prototype.view   = function(idx) { return this.views().view(idx); };

wood.Controllers.prototype.addController = function(ctrl) { 
    this[ctrl.name()] = ctrl;     // make prop - weird but works
    return this.addObject(ctrl); 
};




// wood.Model class
wood.Model = function(name, parent) {
    wood.Object.call(this, name, parent);
    this._className = "wood.Model";
    this.props = {};
    this.init();
};
wood.Model.prototype = Object.create(wood.Object.prototype);
wood.Model.prototype.constructor = wood.Model;

// override in custom class
wood.Model.prototype.init = function() { 
};



// wood.View class
// 12-13-2018 this may have to change to a component
wood.View = function(name, parent) {
    wood.Object.call(this, name, parent);
    this._className = "wood.View";
    this.init();
};
wood.View.prototype = Object.create(wood.Object.prototype);
wood.View.prototype.constructor = wood.View;

// override in custom class
wood.View.prototype.init = function() { 
};




// wood.Controller class
wood.Controller = function(name, parent) {
    wood.Object.call(this, name, parent);
    this._className = "wood.Controller";
    this.init();
};
wood.Controller.prototype = Object.create(wood.Object.prototype);
wood.Controller.prototype.constructor = wood.Controller;

// getters
wood.Controller.prototype.app    = function() { return this.parent().app(); };
wood.Controller.prototype.models = function() { return this.parent().models(); };
wood.Controller.prototype.views  = function() { return this.parent().views(); };
wood.Controller.prototype.model  = function(idx) { return this.models().model(idx); };
wood.Controller.prototype.view   = function(idx) { return this.views().view(idx); };

// override in custom class
wood.Controller.prototype.init = function() { 
};

