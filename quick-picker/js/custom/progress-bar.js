/* 
    progess-bar.js

    Andy Knoll
    November 2018

*/

ProgressBar = function(name, parent, elemId) {
    //alert("ProgressBar constructor");
    this.name   = name;
    this.parent = parent;
    this.elemId = elemId;

    this.value  = 0;
    this.min    = 0;
    this.max    = 100;
    this.offset = .9;           // $display width + margin %

    this.$elem    = null;
    this.$inner   = null;
    this.$display = null;


    this.range = function() {
        return this.max - this.min;
    };

    this.percent = function() {
        return (this.value / this.range()) * 100;
    };

    this.getTemplate = function() {
        var t = "";
        var id = this.elemId;
        t += "<div id='" + id + "-progress-display'></div>"
        t += "<div id='" + id + "-progress-inner'></div>"
        return t;
    };

    this.create$Elem = function() {
        var id = this.elemId;
        this.$elem = $("#" + id);                   // create jQuery main bar
        this.$elem.html(this.getTemplate());

        id = this.elemId + "-progress-display";
        this.$display = $("#" + id);                // create jQuery display
        this.$display.addClass("progress-display");

        id = this.elemId + "-progress-inner";
        this.$inner = $("#" + id);                  // create jQuery inner bar
        this.$inner.addClass("progress-inner");
    };

    this.setValue = function(val) {
        this.value = val;
        this.$inner.css("width", this.percent() * this.offset + "%");
        this.$display.html(this.value);
    };

    this.animValue = function(val, msecs) {
        this.value = val;
        this.$inner.animate({width : this.percent() * this.offset + "%"}, msecs, "linear" );
        this.$display.html(this.value);
    };

    this.create$Elem();
    this.setValue(this.value);

};
