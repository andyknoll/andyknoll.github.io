/******************************************************************************

	wood.image-loader.js
	Andy Knoll
	December 2018
    
    does not require jQuery

    wood.ImageLoader

    loader = new wood.ImageLoader("loader", parent, "parent-tag");

******************************************************************************/

// wood.ImageLoader class
wood.ImageLoader = function(name, parent) {
    wood.Object.call(this, name, parent);
    this._className = "wood.ImageLoader";

    this._paths  = [];           // use a wood Collection?
    this._images = [];
    
    this.relPath = "";
    this.cssClass = "loader-elem";
};
wood.ImageLoader.prototype = Object.create(wood.Object.prototype);
wood.ImageLoader.prototype.constructor = wood.ImageLoader;

// getters
wood.ImageLoader.prototype.path = function(idx) { return this._paths[idx]; };
wood.ImageLoader.prototype.image = function(idx) { return this._images[idx]; };

wood.ImageLoader.prototype.pathCount = function() { return this._paths.length; };
wood.ImageLoader.prototype.imageCount = function() { return this._images.length; };

// private methods

// create an Image for each path entry - called by setPaths()
wood.ImageLoader.prototype._createImages = function() {
    var count = this.pathCount();
    this._images = [];      // clear
    for (var i = 0; i < count; i++) {
        this._images.push(new Image());
    }
};

// public API

wood.ImageLoader.prototype.setPaths = function(paths) {
    var relPath = this.relPath + "img/";
    this._paths = [];       // clear
    this._images = [];
    for (var i = 0; i < paths.length; i++) {
        this._paths.push(relPath + paths[i]);
    }
    this._createImages();
    //this.loadImages();      // auto-load?
};

wood.ImageLoader.prototype.createElement = function(id, parentElem) {
    var elemId = id;
    var elem = document.createElement("div");
    elem.setAttribute("id", elemId);
    elem.className += " " + this.cssClass;      // LET USER SET THE DEFAULT CSS CLASS !!!
    this.appendElementTo(elem, parentElem);
    return elem;
};


wood.ImageLoader.prototype.appendElementTo = function(elem, parentElem) {
    parentElem.appendChild(elem);
};

wood.ImageLoader.prototype.removeElement = function(elem) {
    elem.parentElement.removeChild(elem);
};

// need LOAD_COMPLETE event here!
wood.ImageLoader.prototype.loadImages = function() {
    var count = this.imageCount();
    for (var i = 0; i < count; i++) {
        this.image(i).src = this.path(i);   // load image
    }
};

// Image array must be created first!
wood.ImageLoader.prototype.setElementBackground = function(elem, idx) {
    var path = this.image(idx).src;
    elem.style.backgroundImage = "url('" + path + "')"; 
};

wood.ImageLoader.prototype.info = function() {
	var s = "";
    s += wood.Object.prototype.info.call(this);
    s += ".pathCount: "  + this.imageCount() + "<br>";
    s += ".imageCount: " + this.imageCount() + "<br>";
    s += ".relPath: "    + this.relPath + "<br>";
    s += ".cssClass: "   + this.cssClass + "<br>";
	return s;
};

