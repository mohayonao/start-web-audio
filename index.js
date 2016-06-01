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

  function startWebAudio(audioContext) {
    var args = [].slice.call(arguments, 1);
    var elem = null;
    var requireUserAction = false;
    var callback = null;

    if (args[0] && typeof args[0].addEventListener === "function") {
      elem = args.shift();
    }
    if (typeof args[0] !== "undefined" && typeof args[0] !== "function") {
      requireUserAction = !!args.shift();
    }
    if (typeof args[0] === "function") {
      callback = args.shift();
    }
    if (typeof callback !== "function") {
      callback = function() { /* noop */ };
    }

    elem = elem || global;

    var ua = global.navigator ? global.navigator.userAgent : "";
    var touchEventIsEnabled = ("ontouchstart" in elem);

    if (!requireUserAction && !/iPhone|iPad|iPod/.test(ua)) {
      startWebAudio.done = true;
      setTimeout(callback, 0);
      return;
    }

    function chore(e) {
      if (!startWebAudio.done) {
        play(audioContext, function() {
          startWebAudio.done = true;
          if (touchEventIsEnabled) {
            elem.removeEventListener("touchstart", chore, true);
            elem.removeEventListener("touchend", chore, true);
          } else {
            elem.removeEventListener("mousedown", chore, true);
          }
          callback();
        });
      }
    }

    if (touchEventIsEnabled) {
      elem.addEventListener("touchstart", chore, true);
      elem.addEventListener("touchend", chore, true);
    } else {
      elem.addEventListener("mousedown", chore, true);
    }
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
