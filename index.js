(function(global, factory) {
  "use strict";

  if (typeof define === "function" && define.amd) {
    // AMD
    define([], function() {
      factory(global);
    });
  } else if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
    // CommonJS
    module.exports = factory(global);
  } else {
    // Browser globals
    global.startWebAudio = factory(global);
  }

})((this || 0).self || global, function(global) {
  "use strict";

  function startWebAudio(audioContext, elem, callback) {
    if (typeof elem === "function") {
      callback = elem;
      elem = null;
    }
    if (typeof callback !== "function") {
      callback = function() { /* noop */ };
    }

    var ua = global.navigator ? global.navigator.userAgent : "";

    if (!/iPhone|iPad|iPod/.test(ua)) {
      startWebAudio.done = true;
      setTimeout(callback, 0);
      return;
    }

    elem = elem || global;

    function chore(e) {
      if (!startWebAudio.done) {
        play(audioContext, function() {
          startWebAudio.done = true;
          elem.removeEventListener("touchstart", chore, true);
          elem.removeEventListener("touchend", chore, true);
          elem.removeEventListener("click", chore, true);
          callback();
        });
      }
    }

    elem.addEventListener("touchstart", chore, true);
    elem.addEventListener("touchend", chore, true);
    elem.addEventListener("click", chore, true);
  };

  var memo = [];

  function play(audioContext, callback) {
    var bufSrc = audioContext.createBufferSource();

    bufSrc.buffer = audioContext.createBuffer(1, 2, audioContext.sampleRate);
    bufSrc.start(audioContext.currentTime);
    bufSrc.connect(audioContext.destination);

    // clean up audio graph
    bufSrc.onended = function() {
      var index = memo.indexOf(bufSrc);

      if (index !== -1) {
        memo.splice(index, 1);
      }

      bufSrc.disconnect();

      if (typeof callback === "function") {
        callback();
      }
    };
    memo.push(bufSrc);
  }

  startWebAudio.done = false;

  return startWebAudio;
});
