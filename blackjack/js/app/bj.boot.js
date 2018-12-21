/******************************************************************************

	bj.boot.js
	Andy Knoll
	December 2018
    
    instantiate and run() an appname.App class

******************************************************************************/

window.onload = function() {
	var app = new bj.App("Blackjack Game App", null);
	app.setAppInfo("Andy Knoll", "December 2018", "1.0.0");
	app.run();
}

