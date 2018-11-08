/* 

    qp.audio.js 

    Andy Knoll
    November 2018

    This file provides Game sounds using the Web Audio API buffers.
    May fall back to just playing tiny MP3 files.

*/

qp.GameAudio = function(name, parent) {
    qp.debug("creating GameAudio Object");
    this.name = name;
    this.parent = parent;


    // called automatically at creation
    this.initAudio = function() {
        qp.debug("Tester.initAudio");
    };


    this.initAudio();
};

