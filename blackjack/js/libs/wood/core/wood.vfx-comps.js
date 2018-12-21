/******************************************************************************

	wood.vfx-comps.js
	Andy Knoll
	December 2018 (revisited)
    
    GSAP is not included in this file - use wood.vfx-comps-gsap.js

    wood.VfxAnimation
    wood.VfxComponent
    wood.AnimComponent

******************************************************************************/

// wood.VfxAnimation class - add these to VfxComponents
// adds GSAP animation to Components
// simultaneous animations are supported
wood.VfxAnimation = function(name, parent) {
    // parent will be the VfxObject containing this animation object
    this.props = {};
    this.dur = 1000;
    this.delay = 0;
    wood.Object.call(this, name, parent);
    this._className = "wood.VfxAnimation";
};
wood.VfxAnimation.prototype = Object.create(wood.Object.prototype);
wood.VfxAnimation.prototype.constructor = wood.VfxAnimation;

// getters
wood.VfxAnimation.prototype.elem    = function() { return this._parent.elem(); };
wood.VfxAnimation.prototype.$elem   = function() { return this._parent.$elem(); };
wood.VfxAnimation.prototype.$elemId = function() { return this._parent.$elem().attr("id"); }


// private methods
// these are in GSAP seconds! not msecs
wood.VfxAnimation.prototype._init = function(props, dur, delay) {
    this.dur = dur;    
    this.delay = delay;
    this.props = props;
    this.props.delay = this.delay;

    this.props.onComplete = this._onComplete;   // the private method
    this.props.onCompleteScope = this;
    //this.props.onCompleteParams = [this];
};

// wood.Animation.prototype.run = function(props, dur, delay) {
// this allows us to run the animation using the same settings
wood.VfxAnimation.prototype._run = function() {
    try {
        TweenLite.to(this.elem(), this.dur, this.props);     // GSAP
    } catch (err) {
        alert("ANIMATION ERROR: " + err)
    }
};

wood.VfxAnimation.prototype._onComplete = function() {
    this.parent().onAnimComplete(this);     // public - declared and assigned externally
};


// public methods

// times are in msecs - GSAP uses seconds
// 09-13-2018 Daytona Beach - PUT speed multiplier back in!
wood.VfxAnimation.prototype.animate = function(props, dur, delay) {
    dur = dur / 1000;                   // convert to GSAP seconds
    delay = delay / 1000;               // convert to GSAP seconds
    this._init(props, dur, delay);      // init the single built-in Animation
    this._run();                        // no params
};










// wood.VfxComponent class - contains a single _vfx VfxAnimation object
// uses existing HTML element
// right now sets _elem and _parent - look into this!
wood.VfxComponent = function(name, parent, elemId) {
    wood.Component.call(this, name, parent, elemId);
    this._className = "wood.VfxComponent";
    this._vfx = new wood.VfxAnimation("_vfx", this);      // pass this as parent
    this.onAnimComplete = function(anim) {};              // called when completed
};
wood.VfxComponent.prototype = Object.create(wood.Component.prototype);
wood.VfxComponent.prototype.constructor = wood.VfxComponent;

wood.VfxComponent.prototype.vfx = function() { return this._vfx; };

// now calls the Vfx object - times are in msecs
// 09-13-2018 Daytona Beach - revert these back to operate on object itself?
wood.VfxComponent.prototype.animate = function(props, dur, delay) {
    this._vfx.animate(props, dur, delay);
};

wood.VfxComponent.prototype.reset = function() {
};

wood.VfxComponent.prototype.info = function() {
    var s = "";
    s += wood.Component.prototype.info.call(this);
    s += "vfx: " + this.vfx().name() + "<br/>";
    //s += "onAnimComplete: " + this.onAnimComplete + "<br/>";
    return s;
};









// wood.AnimComponent class
// THIS DOES NOT CONTAIN A TIMER OR TASK ENIGINE
// must be used with a Controller for that functionality
// holds a list of preset animations
// adds runAnim(i) and runNextAnim()
wood.AnimComponent = function(name, parent, elemId) {
    wood.VfxComponent.call(this, name, parent, elemId);
    this._className = "wood.AnimComponent";
    this._anims = new wood.Collection("_anims", this);
};
wood.AnimComponent.prototype = Object.create(wood.VfxComponent.prototype);
wood.AnimComponent.prototype.constructor = wood.AnimComponent;

// getters
wood.AnimComponent.prototype.anims = function() { return this._anims; };


wood.AnimComponent.prototype.runAnim = function(idx) {
    var anim = this._anims.byIndex(idx);
    if (!anim) return;
    this.animate(anim.props, anim.dur, anim.delay);
};

wood.AnimComponent.prototype.runNextAnim = function() {
    var anim = null;
    this._anims.next();     // Collection call
    anim = this._anims.currObject();
    if (!anim) return;
    this.animate(anim.props, anim.dur, anim.delay);
};


wood.AnimComponent.prototype.info = function() {
    var s = "";
    s += wood.VfxComponent.prototype.info.call(this);
    s += "anims: " + this.anims().name() + "<br/>";
    return s;
};







/*****************************************************************************
 
// wood.Scroller
// basically a visual wrapper around a VfxComponent
wood.Scroller = function(name, parent, elemId) {
    wood.VfxComponent.call(this, name, parent, elemId);
    this._className = "wood.Scroller";
    this._superName = "wood.VfxComponent";
    this.reset();
};
wood.Scroller.prototype = Object.create(wood.VfxComponent.prototype);
wood.Scroller.prototype.constructor = wood.Scroller;

wood.Scroller.prototype._template = function() {
    var t = "";
    var id = this.$elemId() + "-text";      // must be DOM unique
    t += "<div id='" + id + "'></div>";     // HTML will be set via setProp()
    return t;
};

wood.Scroller.prototype._createChildComps = function() {
    var id = this.$elemId() + "-text";      // must be DOM unique
    // the component has the same name as the property!
    this.comps.text = new wood.VfxComponent("text", this, id);
};

wood.Scroller.prototype._initChildComps = function() {
    this.duration = 5000;       // default

    // IMPORTANT - set here instead of using global CSS
    this.comps.text.setCss("position", "absolute");
    this.comps.text.setCss("white-space", "nowrap");
    this.comps.text.setCss("box-sizing", "border-box");
};

wood.Scroller.prototype.reset = function() {
    // DO NOT TRY TO SET THE HEIGHT HERE! it will be 0px
    var width = this.getCss("width");
    this.comps.text.setCss("left", width);
};

wood.Scroller.prototype.start = function() {
    var compWidth = this.comps.text.getCss("width");
    // remove "px" or whatever - THIS COULD BE A PROBLEM!
    compWidth = parseInt(compWidth);      
    this.reset();
    // scroll to the left as far as the comp is wide
    this.comps.text.animate({"left": -compWidth, "ease":"linear"}, this.duration, 0);
};

wood.Scroller.prototype.info = function() {
    var s = "";
    s += wood.VfxComponent.prototype.info.call(this);
    s += "props.text: " + this.props.text + "<br/>";
    s += "this.comps.text: <br/>";
    s += this.comps.text.info();
    return s;
};

*****************************************************************************/
